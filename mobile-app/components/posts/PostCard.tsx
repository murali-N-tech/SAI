import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { Post } from '../../types/api';
import api from '../../lib/axios';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<Video>(null);

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
        <View style={styles.card}>
            <Text style={styles.name}>{post.user.name}</Text>
            {post.description && <Text style={styles.description}>{post.description}</Text>}
            <View style={styles.videoContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#3b82f6" />
                ) : videoSrc ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: videoSrc }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        useNativeControls
                        style={styles.video}
                    />
                ) : (
                    <Text>No video available.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
        marginBottom: 16,
    },
    videoContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#e5e7eb',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    video: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
});

export default PostCard;
