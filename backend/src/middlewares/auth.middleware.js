import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error("Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password");
        
        if (!user) {
            throw new Error("Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new Error(error?.message || "Invalid access token");
    }
});