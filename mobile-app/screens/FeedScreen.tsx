import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import api from '../lib/axios';
import { Post } from '../types/api';
import PostCard from '../components/posts/PostCard';
import CreatePost from '../components/posts/CreatePost';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

const FeedScreen = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts();
    }, []);

    const onPostCreated = (newPost: Post) => {
        setPosts([newPost, ...posts]);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <View style={styles.container}>
            {isAuthenticated && <CreatePost onPostCreated={onPostCreated} />}
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostCard post={item} />}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#6b7280',
    },
});

export default FeedScreen;
