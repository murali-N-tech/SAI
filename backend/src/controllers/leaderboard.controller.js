import { Submission } from '../models/submission.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getLeaderboardByTest = asyncHandler(async (req, res) => {
    const { testId } = req.params;

    const leaderboard = await Submission.aggregate([
        // Filter by the specific test and completed status
        { $match: { test: new mongoose.Types.ObjectId(testId), status: 'completed' } },
        // Sort by score descending
        { $sort: { score: -1 } },
        // Group by athlete to get their best score
        {
            $group: {
                _id: "$athlete",
                bestScore: { $first: "$score" },
                submissionDate: { $first: "$createdAt" }
            }
        },
        // Re-sort after grouping
        { $sort: { bestScore: -1 } },
        // Limit to top 50
        { $limit: 50 },
        // Lookup user details
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "athleteDetails"
            }
        },
        // Deconstruct the athleteDetails array
        { $unwind: "$athleteDetails" },
        // Project final fields
        {
            $project: {
                _id: 0,
                athleteId: "$_id",
                name: "$athleteDetails.name",
                location: "$athleteDetails.location",
                score: "$bestScore",
                date: "$submissionDate"
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, leaderboard, "Leaderboard fetched successfully."));
});

export { getLeaderboardByTest };