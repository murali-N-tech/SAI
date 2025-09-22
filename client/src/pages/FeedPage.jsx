import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import PostCard from '../components/posts/PostCard';
import CreatePost from '../components/posts/CreatePost';
import Spinner from '../components/common/Spinner';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // This function fetches the posts from the backend API
    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Community Feed</h1>
            <CreatePost onPostCreated={fetchPosts} />
            <div className="mt-4">
                {/* Here, it maps over the posts and renders a PostCard for each one */}
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default FeedPage;