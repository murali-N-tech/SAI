import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });


// This should be 'http://localhost:5001' from your .env file
const ANALYSIS_SERVICE_URL = process.env.ANALYSIS_SERVICE_URL;
const INTERNAL_API_SECRET = process.env.ANALYSIS_API_SECRET;

export const analyzeVideo = async (videoFile, testType, athleteHeightCm, submissionId) => {
  const form = new FormData();

  try {
    // Read the file into a buffer to avoid stream-related errors
    const videoBuffer = fs.readFileSync(videoFile.path);

    // Append the buffer to the form, providing the original filename
    form.append('video', videoBuffer, { filename: videoFile.originalname });

    form.append('testType', testType);
    form.append('submissionId', submissionId);
    if (athleteHeightCm) {
      form.append('athleteHeightCm', athleteHeightCm);
    }

    // The '/analyze' path is added here to the base URL
    const response = await axios.post(`${ANALYSIS_SERVICE_URL}/analyze`, form, {
      headers: {
        ...form.getHeaders(),
        'x-internal-api-secret': INTERNAL_API_SECRET,
      },
    });

    console.log('Analysis service responded:', response.data.message);
    return response;

  } catch (error) {
    // This logs the actual error from the failed communication attempt
    console.error('Error analyzing video:', error.message);
    throw new Error('Failed to communicate with analysis service');
  } finally {
    // Clean up the temporary file uploaded by Multer
    fs.unlinkSync(videoFile.path);
  }
};