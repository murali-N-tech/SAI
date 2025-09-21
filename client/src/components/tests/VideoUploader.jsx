// File: client/src/components/tests/VideoUploader.jsx

import React, { useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Button from '../common/Button';

const VideoUploader = ({ testId }) => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
        setUploadProgress(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a video file first.');
            return;
        }

        const formData = new FormData();
        formData.append('video', file);
        formData.append('testId', testId);

        setLoading(true);
        setResult(null);

        try {
            const response = await api.post('/submissions', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            const responseData = response.data.data;
            setResult(responseData);

            if (responseData.status === 'failed') {
                toast.error(`Analysis failed: ${responseData.feedback}`);
            } else {
                toast.success('Analysis complete!');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 mb-2">
                        Select your performance video:
                    </label>
                    <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}

                <Button type="submit" loading={loading} disabled={!file || loading}>
                    {loading ? 'Analyzing...' : 'Upload & Analyze'}
                </Button>
            </form>

            {result && (
                <div className="mt-6 p-4 rounded-lg border text-center">
                    {result.status === 'failed' ? (
                        <div className="bg-red-50 border-red-200 text-red-700">
                            <h3 className="text-lg font-bold">Analysis Failed</h3>
                            <p className="text-sm mt-2">{result.feedback}</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">Analysis Complete!</h3>
                            <p className="text-sm text-gray-600 mt-2">Your score for this test is:</p>
                            <p className="text-4xl font-extrabold text-blue-600 my-2">{result.score}</p>
                            <p className={`text-sm font-semibold ${result.status === 'prospect_approved' ? 'text-green-600' : 'text-gray-500'}`}>
                                Status: {result.status === 'prospect_approved' ? 'Promising Athlete!' : 'Keep Practicing!'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoUploader;