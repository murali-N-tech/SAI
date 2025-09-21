// File: backend/src/controllers/submission.controller.js

import { Submission } from '../models/submission.model.js';
import { Test } from '../models/test.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { analyzeVideo } from '../services/analysis.service.js';
import imagekit from '../config/imagekit.config.js';
import fs from 'fs'; // Import the fs module

// ---------------------------------------------
// Create Submission (start analysis in background)
// ---------------------------------------------
const createSubmission = asyncHandler(async (req, res) => {
  const { testId } = req.body;
  const videoFile = req.file;
  const athleteHeightCm = req.user.height; // Get height from the authenticated user

  if (!videoFile) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'Video file is required.'));
  }

  // Validate test
  const test = await Test.findById(testId);
  if (!test) {
    // Clean up the temp file if the test is not valid
    fs.unlinkSync(videoFile.path);
    return res
      .status(404)
      .json(new ApiResponse(404, null, 'Test not found.'));
  }

  // 1. Create submission with "processing" status
  const submission = await Submission.create({
    athlete: req.user._id, // FIX: Changed 'user' to 'athlete' to match the schema
    test: testId,
    score: 0, // Default score
    status: 'processing',
  });

  try {
    // 2. Trigger background analysis (async)
    analyzeVideo(videoFile, test.name, athleteHeightCm, submission._id);

    // 3. Respond immediately
    return res.status(202).json(
      new ApiResponse(
        202,
        submission,
        'Analysis has started. The result will be available on your dashboard shortly.'
      )
    );
  } catch (error) {
    // If analysis call fails
    submission.status = 'failed';
    await submission.save();

    console.error('Error calling analysis service:', error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'Failed to start video analysis.'));
  }
});

// ---------------------------------------------
// Update Submission Score (called by Python service)
// ---------------------------------------------
const updateSubmissionScore = asyncHandler(async (req, res) => {
  const { submissionId, score, cheatDetected, cheatReason } = req.body;

  if (!submissionId || score === undefined) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          'Submission ID and score are required.'
        )
      );
  }

  const submission = await Submission.findByIdAndUpdate(
    submissionId,
    {
      score: score,
      status: cheatDetected ? 'failed' : 'completed',
      feedback: cheatDetected ? cheatReason : 'Analysis Complete',
    },
    { new: true } // return updated doc
  );

  if (!submission) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, 'Submission not found.'));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, submission, 'Submission updated successfully.')
    );
});

// ---------------------------------------------
// Get submissions by logged-in user
// ---------------------------------------------
const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ athlete: req.user._id }) // FIX: Changed 'user' to 'athlete'
    .populate('test', 'name')
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      submissions,
      'Submissions retrieved successfully.'
    )
  );
});

// FIX: Renamed getSubmissionsByUser to getMySubmissions to be consistent
export { createSubmission, updateSubmissionScore, getMySubmissions };