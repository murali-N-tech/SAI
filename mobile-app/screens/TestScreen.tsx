import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { TestScreenRouteProp } from '../types/navigation';
import VideoUploader from '../components/tests/VideoUploader';
import TestInstructions from '../components/tests/TestInstructions';

const TestScreen = () => {
    const route = useRoute<TestScreenRouteProp>();
    const { testId, testName } = route.params;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <TestInstructions testName={testName} />
            <VideoUploader testId={testId} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    contentContainer: {
        padding: 16,
    },
});

export default TestScreen;