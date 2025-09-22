// src/services/analysis.service.js
import axios from 'axios';
import FormData from 'form-data';
import ImageKit from 'imagekit';
import fs from 'fs';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload a video to ImageKit as private
 * Returns filePath (not public URL)
 */
export const uploadToImageKit = async (fileBuffer, fileName) => {
    try {
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName,
            folder: "athlete_submissions",
            useUniqueFileName: true,
            isPrivateFile: true, // 👈 private file
        });

        return response.filePath; // save filePath in DB
    } catch (error) {
        console.error("ImageKit Upload Error:", error.message);
        throw new Error("Failed to upload video.");
    }
};

/**
 * Trigger video analysis in background
 */
export const triggerVideoAnalysis = async (videoFilePath, submissionId, testType) => {
    try {
        const url = `${process.env.IMAGEKIT_URL_ENDPOINT}${videoFilePath}`;

        const formData = new FormData();
        formData.append('submissionId', submissionId);
        formData.append('testType', testType);
        formData.append('videoUrl', url);

        axios.post(process.env.ANALYSIS_SERVICE_URL, formData, {
            headers: formData.getHeaders(),
        }).catch(err => {
            console.error(`Failed to trigger analysis for submission ${submissionId}:`, err.message);
        });

        console.log(`Analysis triggered for submission: ${submissionId}`);
    } catch (error) {
        console.error("Error triggering analysis service:", error.message);
    }
};
