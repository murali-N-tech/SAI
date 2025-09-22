import { Submission } from '../models/submission.model.js';
import { Test } from '../models/test.model.js';
import { uploadToImageKit } from '../services/analysis.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import mongoose from 'mongoose'; // Import mongoose

// Define performance thresholds for each test
const PERFORMANCE_THRESHOLDS = {
    'Sit-ups': 20,          // e.g., Must do more than 20 sit-ups
    'Vertical Jump': 40,    // e.g., Must jump higher than 40 cm
    'Endurance Run': 30,    // e.g., More than 30 high-knees
};

const createSubmission = asyncHandler(async (req, res) => {
    const { testId } = req.body;
    const athleteId = req.user._id;
    const videoFile = req.file;

    if (!videoFile) {
        return res.status(400).json(new ApiResponse(400, null, "Video file is required."));
    }

    if (!mongoose.Types.ObjectId.isValid(testId)) {
        if (videoFile && fs.existsSync(videoFile.path)) {
            fs.unlinkSync(videoFile.path);
        }
        return res.status(400).json(new ApiResponse(400, null, "Invalid Test ID format."));
    }


    const test = await Test.findById(testId);
    if (!test) {
        // Clean up the uploaded file if the test is invalid
        if (videoFile && fs.existsSync(videoFile.path)) {
            fs.unlinkSync(videoFile.path);
        }
        return res.status(404).json(new ApiResponse(404, null, `Test with ID '${testId}' not found.`));
    }

    let score = 0;
    let videoUrl = null;
    let status = "normal_user";

    try {
        // Corrected: Read the file into a buffer before sending it to the analysis service.
        const videoBuffer = fs.readFileSync(videoFile.path);

        const formData = new FormData();
        formData.append('video', videoBuffer, {
            filename: videoFile.originalname,
            contentType: videoFile.mimetype,
        });
        formData.append('testType', test.name);

        // Pass athlete height if available (useful for Vertical Jump test)
        if (test.name === 'Vertical Jump' && req.user.height) {
            formData.append('athleteHeightCm', req.user.height);
        }

        const analysisResponse = await axios.post(
            process.env.ANALYSIS_SERVICE_URL,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'X-Internal-API-Secret': process.env.ANALYSIS_API_SECRET,
                },
            }
        );

        score = analysisResponse.data.score;

        // 2. Check score against the threshold
        const threshold = PERFORMANCE_THRESHOLDS[test.name] || 0;

        if (score > threshold) {
            // 3. If performance is good, upload to ImageKit
            console.log(`Performance good (${score} > ${threshold}). Uploading to ImageKit...`);
            const uploadResult = await uploadToImageKit(videoBuffer, videoFile.originalname);
            videoUrl = uploadResult.url;
            status = "prospect_approved";
        } else {
            console.log(`Performance normal (${score} <= ${threshold}). Discarding video.`);
            status = "normal_user";
        }

    } catch (error) {
        console.error("Error during analysis or upload:", error.message);
        // Clean up the file on error
        if (videoFile && fs.existsSync(videoFile.path)) {
            fs.unlinkSync(videoFile.path);
        }
        return res.status(500).json(new ApiResponse(500, null, "Failed to process video."));
    }

    // 4. Clean up the temporary file from the server
    if (videoFile && fs.existsSync(videoFile.path)) {
        fs.unlinkSync(videoFile.path);
    }

    // 5. Create the submission record in the database
    const submission = await Submission.create({
        athlete: athleteId,
        test: testId,
        videoUrl: videoUrl, // Will be null for normal users
        score: score,
        status: status,
    });

    return res.status(201).json(new ApiResponse(201, submission, "Analysis complete."));
});

const getMySubmissions = asyncHandler(async (req, res) => {
    const submissions = await Submission.find({ athlete: req.user._id })
        .populate('test', 'name')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, submissions, "Submissions retrieved successfully."));
});

// INTERNAL endpoint for Python service to update score/status if needed
const updateSubmissionScore = asyncHandler(async (req, res) => {
    const { submissionId } = req.params;
    const { score, status } = req.body;
    const secret = req.header('X-Internal-API-Secret');

    // Security check
    if (secret !== process.env.ANALYSIS_API_SECRET) {
        return res.status(401).json(new ApiResponse(401, null, "Unauthorized."));
    }

    const submission = await Submission.findByIdAndUpdate(
        submissionId,
        { score, status },
        { new: true }
    );

    if (!submission) {
        return res.status(404).json(new ApiResponse(404, null, "Submission not found."));
    }

    console.log(`Score updated for submission ${submissionId} to ${score}`);
    return res.status(200).json(new ApiResponse(200, submission, "Score updated successfully."));
});

export { createSubmission, getMySubmissions, updateSubmissionScore };