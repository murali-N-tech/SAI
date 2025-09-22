import React from 'react';

const PostCard = ({ post }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
                <span className="font-bold text-gray-800">{post.user.name}</span>
            </div>
            <p className="text-gray-600 mb-4">{post.description}</p>
            <video controls className="w-full rounded">
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default PostCard;