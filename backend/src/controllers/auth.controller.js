import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, age, height, weight, location } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json(new ApiResponse(400, null, "Name, email, and password are required."));
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        return res.status(409).json(new ApiResponse(409, null, "User with this email already exists."));
    }

    const user = await User.create({ name, email, password, role, age, height, weight, location });
    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(new ApiResponse(400, null, "Email and password are required."));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User does not exist."));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return res.status(401).json(new ApiResponse(401, null, "Invalid user credentials."));
    }

    const accessToken = user.generateAccessToken();
    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(200).json(
        new ApiResponse(
            200,
            { user: loggedInUser, accessToken },
            "User logged in successfully."
        )
    );
});

export { registerUser, loginUser };