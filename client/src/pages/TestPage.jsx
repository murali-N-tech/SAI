import React from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoUploader from '../components/tests/VideoUploader';
import TestInstructions from '../components/tests/TestInstructions'; // You need this import

const MOCK_TESTS = {
    '60d0fe4f5311236168a109ca': { name: 'Vertical Jump', description: 'Stand sideways to the camera, jump as high as you can from a standstill, and land safely.' },
    '60d0fe4f5311236168a109cb': { name: 'Sit-ups', description: 'Perform as many sit-ups as you can with correct form. Ensure your hands touch your knees at the top.' },
    '60d0fe4f5311236168a109cc': { name: 'Endurance Run', description: 'Perform high-knees in place for 60 seconds, bringing your knees above your hips each time.' },
    '60d0fe4f5311236168a109cd': { name: 'Shuttle Run', description: 'Place two bright orange cones 5 yards apart. Run between them as many times as possible.' },
    '68d194a772df635c09c25d25': { name: 'Push-ups', description: 'Perform as many push-ups as you can with proper form. Keep your back straight.' },
};

const TestPage = () => {
    const { testId } = useParams();
    const test = MOCK_TESTS[testId];

    if (!test) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Test Not Found</h2>
                <Link to="/dashboard" className="text-blue-600 hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">{test.name}</h1>
                <p className="mt-2 max-w-2xl mx-auto text-md text-gray-600">
                    <strong>Instructions:</strong> {test.description}
                </p>
            </div>
            
            <VideoUploader testId={testId} />
        </div>
    );
};

export default TestPage;