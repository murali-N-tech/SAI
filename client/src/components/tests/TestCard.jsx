import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const TestCard = ({ test }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-800">{test.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{test.description}</p>
            </div>
            <div className="mt-4">
                <Link to={`/test/${test.id}`}>
                    <Button variant="primary">Start Test</Button>
                </Link>
            </div>
        </div>
    );
};

export default TestCard;