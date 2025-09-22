// src/controllers/media.controller.js
import ImageKit from 'imagekit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Initialize ImageKit instance
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * @description Generates authentication parameters for client-side uploads to ImageKit.
 * @route POST /api/v1/media/signed-url
 * @access Private
 */
const getAuthenticationParametersForUpload = asyncHandler(async (req, res) => {
    try {
        // ✅ The correct function for client-side upload authentication
        const authenticationParameters = imagekit.getAuthenticationParameters();

        // Send the token, signature, and expire time to the client
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    authenticationParameters,
                    "Authentication parameters generated successfully."
                )
            );

    } catch (error) {
        console.error("ImageKit Auth Parameters Error:", error);
        throw new ApiError(500, "An error occurred while generating authentication parameters.");
    }
});

export { getAuthenticationParametersForUpload };