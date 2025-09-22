import { Submission } from '../models/submission.model.js';
import { Test } from '../models/test.model.js';
import { uploadToImageKit } from '../services/analysis.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import mongoose from 'mongoose'; // Import mongoose

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
    let status = "completed";

    try {
        const videoBuffer = fs.readFileSync(videoFile.path);

        const formData = new FormData();
        formData.append('video', videoBuffer, {
            filename: videoFile.originalname,
            contentType: videoFile.mimetype,
        });
        formData.append('testType', test.name);

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

        const uploadResult = await uploadToImageKit(videoBuffer, videoFile.originalname);
        videoUrl = uploadResult.url;

    } catch (error) {
        console.error("Error during analysis or upload:", error.message);
        if (videoFile && fs.existsSync(videoFile.path)) {
            fs.unlinkSync(videoFile.path);
        }
        return res.status(500).json(new ApiResponse(500, null, "Failed to process video."));
    } finally {
        if (videoFile && fs.existsSync(videoFile.path)) {
            fs.unlinkSync(videoFile.path);
        }
    }

    const submission = await Submission.create({
        athlete: athleteId,
        test: testId,
        videoUrl: videoUrl,
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

export { createSubmission, getMySubmissions };