import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Post } from '../../types/api';
import { Video } from 'expo-av';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.name}>{post.user.name}</Text>
            <Text style={styles.description}>{post.description}</Text>
            <Video
                source={{ uri: post.videoUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={styles.video}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 16,
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
    video: {
        width: '100%',
        height: 200,
    },
});

export default PostCard;