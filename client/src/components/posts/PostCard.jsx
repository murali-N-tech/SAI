import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

const PostCard = ({ post }) => {
    const [videoSrc, setVideoSrc] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSignedUrl = async () => {
            if (!post.videoUrl) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.post('/media/signed-url', { filePath: post.videoUrl });
                setVideoSrc(response.data.data.signedUrl);
            } catch (error) {
                console.error("Could not fetch signed URL", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSignedUrl();
    }, [post.videoUrl]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
                <span className="font-bold text-gray-800">{post.user.name}</span>
            </div>
            {post.description && <p className="text-gray-600 mb-4">{post.description}</p>}
            
            {isLoading ? (
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                    <p>Loading video...</p>
                </div>
            ) : videoSrc ? (
                <video controls className="w-full rounded">
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                    <p>No video available.</p>
                </div>
            )}
        </div>
    );
};

export default PostCard;
