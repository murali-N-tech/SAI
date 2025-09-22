import ImageKit from 'imagekit';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadToImageKit = async (fileBuffer, fileName) => {
    try {
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: fileName,
            folder: "athlete_submissions",
        });
        return response;
    } catch (error) {
        console.error("ImageKit Upload Error:", error);
        throw new Error("Failed to upload video.");
    }
};

export const triggerVideoAnalysis = async (videoUrl, submissionId, testType) => {
    try {
        const formData = new FormData();
        formData.append('submissionId', submissionId);
        formData.append('testType', testType);
        
        // This is a simplified approach. The analysis service needs a way to fetch the video.
        // A better approach would be to send a temporary signed URL from ImageKit.
        // For now, sending the public URL.
        formData.append('videoUrl', videoUrl);

        // Making a POST request to the Python service.
        // We do not await this, it runs in the background.
        axios.post(process.env.ANALYSIS_SERVICE_URL, formData, {
            headers: formData.getHeaders(),
        }).catch(err => {
            console.error(`Failed to trigger analysis for submission ${submissionId}:`, err.message);
            // Optionally, update submission status to 'failed' here
        });

        console.log(`Analysis triggered for submission: ${submissionId}`);

    } catch (error) {
        console.error("Error triggering analysis service:", error.message);
    }
};