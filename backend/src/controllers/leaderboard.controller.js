import { Submission } from '../models/submission.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

const getLeaderboardByTest = asyncHandler(async (req, res) => {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid Test ID format."));
    }

    const leaderboard = await Submission.aggregate([
        // Match submissions for the specific test
        { $match: { test: new mongoose.Types.ObjectId(testId) } }, // <-- FIX: Used 'new' keyword

        // Sort by score descending to get the highest score first
        { $sort: { score: -1 } },

        // Group by athlete to get their best score
        {
            $group: {
                _id: '$athlete',
                highScore: { $first: '$score' },
                submissionDate: { $first: '$createdAt' },
            }
        },

        // Sort again by the high score
        { $sort: { highScore: -1 } },

        // Limit to top 10
        { $limit: 10 },

        // Lookup athlete details
        {
            $lookup: {
                from: 'users',
                localField: '_id', // high-level grouping
                foreignField: '_id',
                as: 'athleteInfo'
            }
        },

        // Deconstruct the athleteInfo array
        { $unwind: '$athleteInfo' },

        // Project the final fields
        {
            $project: {
                _id: 0,
                athleteId: '$_id',
                name: '$athleteInfo.name',
                location: '$athleteInfo.location',
                score: '$highScore',
                date: '$submissionDate'
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, leaderboard, "Leaderboard fetched successfully."));
});

export { getLeaderboardByTest };
