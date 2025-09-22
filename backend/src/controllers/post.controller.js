import { Post } from '../models/post.model.js';
import { uploadToImageKit } from '../services/analysis.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import fs from 'fs';

const createPost = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const userId = req.user._id;
    const videoFile = req.file;

    if (!videoFile) {
        return res.status(400).json(new ApiResponse(400, null, "Video file is required."));
    }

    let videoUrl = null;

    try {
        const videoBuffer = fs.readFileSync(videoFile.path);
        const uploadResult = await uploadToImageKit(videoBuffer, videoFile.originalname);
        videoUrl = uploadResult.url;

    } catch (error) {
        console.error("Error during video upload:", error.message);
        if (videoFile && fs.existsSync(videoFile.path)) {
            fs.unlinkSync(videoFile.path);
        }
        return res.status(500).json(new ApiResponse(500, null, "Failed to upload video."));
    } finally {
        if (videoFile && fs.existsSync(videoFile.path)) {
            fs.unlinkSync(videoFile.path);
        }
    }

    const post = await Post.create({
        user: userId,
        videoUrl: videoUrl,
        description: description,
    });

    return res.status(201).json(new ApiResponse(201, post, "Post created successfully."));
});

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({})
        .populate('user', 'name')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, posts, "Posts retrieved successfully."));
});

export { createPost, getAllPosts };