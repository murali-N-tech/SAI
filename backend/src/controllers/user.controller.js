import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getMyProfile = asyncHandler(async (req, res) => {
    // req.user is attached by the verifyJWT middleware
    return res.status(200).json(new ApiResponse(200, req.user, "User profile fetched successfully."));
});

export { getMyProfile };