import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TestInstructionsProps {
    testName: string;
}

const MOCK_INSTRUCTIONS: { [key: string]: string[] } = {
    'Vertical Jump': [
        "Stand side-on to the camera in a well-lit area.",
        "Ensure your entire body is visible in the frame.",
        "From a standstill, jump as high as you possibly can.",
        "Land safely with your knees bent."
    ],
    'Sit-ups': [
        "Lie on your back with your knees bent and feet flat on the floor.",
        "Place your hands behind your head or across your chest.",
        "Raise your upper body towards your knees.",
        "Lower yourself back down to the starting position to complete one rep."
    ],
    'Endurance Run': [
        "This is a 60-second high-knee test.",
        "Stand in one place facing the camera.",
        "Run in place, bringing each knee up above your hip level.",
        "Continue for the full duration of the video."
    ],
    'Shuttle Run': [
        "Place two bright cones 5 yards (about 4.5 meters) apart.",
        "Ensure both cones are visible in the video frame.",
        "Start at one cone and run to the other, touching the line.",
        "Repeat as many times as you can within the video duration."
    ]
};

const TestInstructions: React.FC<TestInstructionsProps> = ({ testName }) => {
    const instructionsList = MOCK_INSTRUCTIONS[testName] || ["No specific instructions available."];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Instructions for {testName}</Text>
            {instructionsList.map((instruction, index) => (
                <Text key={index} style={styles.instructionItem}>• {instruction}</Text>
            ))}
            <View style={styles.importantBox}>
                <Text style={styles.importantText}>
                    Important: For the most accurate analysis, please ensure you are in a well-lit area and your entire body is visible throughout the video.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#111827',
    },
    instructionItem: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 5,
    },
    importantBox: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#fee2e2',
        borderRadius: 6,
    },
    importantText: {
        color: '#b91c1c',
        fontSize: 13,
        fontWeight: '500',
    },
});

export default TestInstructions;