import React from 'react';

const TestInstructions = ({ test }) => {
    // This component assumes the 'test' object has a detailed 'instructions' property.
    // We can create a mock mapping for now.
    const MOCK_INSTRUCTIONS = {
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
            "Place two bright orange cones 5 yards (about 4.5 meters) apart.",
            "Ensure both cones are visible in the video frame.",
            "Start at one cone and run to the other, touching the line.",
            "Repeat as many times as you can within the video duration."
        ]
    };

    const instructionsList = MOCK_INSTRUCTIONS[test.name] || ["No specific instructions available."];

    return (
        <div className="space-y-4 text-gray-700">
            <h3 className="text-xl font-bold text-gray-900">
                Instructions for {test.name}
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
                {instructionsList.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                ))}
            </ul>
            <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-red-600">
                    Important: For the most accurate analysis, please ensure you are in a well-lit area and your entire body is visible throughout the video.
                </p>
            </div>
        </div>
    );
};

export default TestInstructions;