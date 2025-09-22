import { User } from '../models/user.model.js';
import { Submission } from '../models/submission.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getMyProfile = asyncHandler(async (req, res) => {
    // req.user is attached by the verifyJWT middleware
    return res.status(200).json(new ApiResponse(200, req.user, "User profile fetched successfully."));
});

const getAllSubmissionsForAdmin = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse(403, null, "You are not authorized to perform this action."));
    }

    const submissions = await Submission.find({})
        .populate('athlete', 'name email')
        .populate('test', 'name')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, submissions, "All submissions retrieved successfully."));
});

export { getMyProfile, getAllSubmissionsForAdmin };