import ImageKit from 'imagekit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const getSignedUrlForVideo = asyncHandler(async (req, res) => {
    // This line looks for `fileUrl` in the request body.
    const { fileUrl } = req.body;

    // If `fileUrl` is missing, we throw the 400 error.
    if (!fileUrl) {
        throw new ApiError(400, "File URL is required in the request body.");
    }

    try {
        const urlObject = new URL(fileUrl);
        const path = urlObject.pathname;

        const signedUrl = imagekit.url({
            path: path,
            signed: true,
            expireSeconds: 600,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { signedUrl },
                    "Signed URL generated successfully."
                )
            );
    } catch (error) {
        console.error("ImageKit Signed URL Error:", error);
        throw new ApiError(500, "An error occurred while generating the signed URL.");
    }
});

export { getSignedUrlForVideo };