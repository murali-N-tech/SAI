import { Test } from '../models/test.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getAllTests = asyncHandler(async (req, res) => {
    const tests = await Test.find({});
    return res.status(200).json(new ApiResponse(200, tests, "Tests retrieved successfully."));
});

export { getAllTests };