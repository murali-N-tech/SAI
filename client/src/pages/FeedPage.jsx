import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import Spinner from '../components/common/Spinner';
import PostCard from '../components/posts/PostCard';
import CreatePost from '../components/posts/CreatePost';
import { useAuth } from '../hooks/useAuth';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onPostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
            {isAuthenticated && <CreatePost onPostCreated={onPostCreated} />}
            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default FeedPage;