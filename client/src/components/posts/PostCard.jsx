import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ImageKit from 'imagekit-javascript';

// Securely initialize ImageKit using environment variables from .env.local
const imagekit = new ImageKit({
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
    privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT
});

const PostCard = ({ post }) => {
    const [videoUrl, setVideoUrl] = useState(null);
    // Destructure properties directly from the post object
    const { user, description, createdAt, videoUrl: videoPath } = post;

    useEffect(() => {
        // Check for videoPath (which is post.videoUrl)
        if (videoPath) {
            try {
                // Extracts the path from the full URL for signing
                const path = new URL(videoPath).pathname;

                const signedUrl = imagekit.url({
                    path: path,
                    signed: true,
                    expireSeconds: 600, // URL is valid for 10 minutes
                });
                setVideoUrl(signedUrl);
            } catch (error) {
                console.error("Error generating signed URL on frontend:", error);
            }
        }
    }, [videoPath]); // Depend on videoPath

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center mb-2">
                <img
                    src={user?.avatar || 'https://via.placeholder.com/40'}
                    alt={user?.username || 'User'}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <p className="font-semibold">{user?.name || 'Anonymous'}</p>
                    <p className="text-gray-500 text-sm">
                        {formatDistanceToNow(new Date(createdAt))} ago
                    </p>
                </div>
            </div>
            <p className="mb-3">{description}</p>

            {/* Check for the existence of videoPath */}
            {videoPath && (
                <div className="rounded-lg overflow-hidden bg-gray-200 aspect-video">
                    {videoUrl ? (
                        <video controls src={videoUrl} className="w-full h-full">
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-500">Loading video...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;