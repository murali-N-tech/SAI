import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import api from '../../lib/axios';
import Button from '../common/Button';
import { Submission } from '../../types/api';

interface VideoUploaderProps {
    testId: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ testId }) => {
    const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Submission | null>(null);

    const handleFileChange = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setFile(result.assets[0]);
            setResult(null);
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
        formData.append('testId', testId);

        setLoading(true);
        setResult(null);

        try {
            const response = await api.post('/submissions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Toast.show({ type: 'success', text1: response.data.message });
            setResult(response.data.data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
            Toast.show({ type: 'error', text1: 'Upload Error', text2: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button onPress={handleFileChange} variant="secondary">
                {file ? 'Change Video' : 'Select Video'}
            </Button>
            {file && <Text style={styles.fileName}>Selected: {file.uri.split('/').pop()}</Text>}

            <Button onPress={handleSubmit} loading={loading} disabled={!file || loading} style={{ marginTop: 20 }}>
                {loading ? 'Analyzing...' : 'Upload & Analyze'}
            </Button>

            {result && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Analysis Complete!</Text>
                    <Text style={styles.resultLabel}>Your score for this test is:</Text>
                    <Text style={styles.resultScore}>{result.score}</Text>
                     <Text style={[styles.resultStatus, result.status === 'prospect_approved' ? styles.statusApproved : styles.statusNormal]}>
                        Status: {result.status === 'prospect_approved' ? 'Promising Athlete!' : 'Keep Practicing!'}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    fileName: {
        marginTop: 10,
        textAlign: 'center',
        color: '#6b7280',
    },
    resultContainer: {
        marginTop: 24,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    resultLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
    },
    resultScore: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#3b82f6',
        marginVertical: 8,
    },
    resultStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
    statusApproved: {
        color: '#16a34a',
    },
    statusNormal: {
        color: '#4b5563',
    },
});

export default VideoUploader;