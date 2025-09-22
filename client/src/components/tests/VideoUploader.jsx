import React, { useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AnalysisReport from './AnalysisReport';
import { FaUpload, FaCheckCircle } from 'react-icons/fa';

const VideoUploader = ({ testId }) => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            setResult(response.data.data);
            toast.success('Analysis complete!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Upload failed.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 mb-2">
                        Select your performance video:
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="video-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    <span>Upload a file</span>
                                    <input id="video-upload" name="video" type="file" className="sr-only" accept="video/*" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">MP4, MOV, AVI up to 50MB</p>
                        </div>
                    </div>
                    {file && <p className="text-sm text-gray-500 mt-2">Selected: {file.name}</p>}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}

                <Button type="submit" loading={loading} disabled={!file || loading}>
                    {loading ? 'Analyzing...' : 'Upload & Analyze'}
                </Button>
            </form>

            {result && (
                <div className="mt-6 p-6 rounded-lg bg-green-50 border border-green-200 text-center">
                    <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="text-lg font-bold text-gray-800 mt-4">Analysis Complete!</h3>
                    <p className="text-sm text-gray-600 mt-2">Your score for this test is:</p>
                    <p className="text-5xl font-extrabold text-green-600 my-2">{result.score}</p>
                    
                    <div className="text-left text-sm text-gray-700 my-4 p-3 bg-blue-50 rounded-md">
                        <p className="font-semibold mb-1">Suggestions for Improvement:</p>
                        {result.feedback && result.feedback.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {result.feedback.map((fb, index) => <li key={index}>{fb}</li>)}
                            </ul>
                        ) : <p>No specific feedback provided. Keep up the great work!</p>}
                    </div>
                    
                    <Button onClick={() => setIsModalOpen(true)} variant="secondary">
                        View Full Report
                    </Button>
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detailed Analysis Report">
                {result && <AnalysisReport report={result.analysisReport} />}
            </Modal>
        </div>
    );
};

export default VideoUploader;