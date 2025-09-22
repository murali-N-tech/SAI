import React, { useState } from 'react';
import { View, StyleSheet, Platform, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import api from '../../lib/axios';
import Button from '../common/Button';
import { Post } from '../../types/api';

interface CreatePostProps {
    onPostCreated: (post: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
    const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setFile(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            Toast.show({ type: 'error', text1: 'Please select a video file first.' });
            return;
        }

        const uri = Platform.OS === "android" ? file.uri : file.uri.replace("file://", "");
        const filename = file.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename as string);
        const type = match ? `video/${match[1]}` : `video`;

        const formData = new FormData();
        formData.append('video', { uri, name: filename, type } as any);
        formData.append('description', description);

        setLoading(true);

        try {
            const response = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Toast.show({ type: 'success', text1: 'Post created successfully!' });
            onPostCreated(response.data.data);
            setFile(null);
            setDescription('');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
            Toast.show({ type: 'error', text1: 'Upload Error', text2: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Share something..."
                value={description}
                onChangeText={setDescription}
            />
            <Button onPress={handleFileChange} variant="secondary">
                {file ? 'Change Video' : 'Select Video'}
            </Button>
            <Button onPress={handleSubmit} loading={loading} disabled={!file || loading} style={{ marginTop: 10 }}>
                {loading ? 'Posting...' : 'Create Post'}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
    },
});

export default CreatePost;