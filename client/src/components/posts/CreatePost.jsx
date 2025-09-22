import React, { useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Button from '../common/Button';

const CreatePost = ({ onPostCreated }) => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a video file.');
            return;
        }

        const formData = new FormData();
        formData.append('video', file);
        formData.append('description', description);

        setLoading(true);

        try {
            const response = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Post created successfully!');
            onPostCreated(response.data.data);
            setFile(null);
            setDescription('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Share something about your performance..."
                    className="w-full border rounded-md p-2"
                />
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <Button type="submit" loading={loading} disabled={loading}>
                    Post
                </Button>
            </form>
        </div>
    );
};

export default CreatePost;