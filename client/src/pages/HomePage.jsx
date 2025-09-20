import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const HomePage = () => {
    return (
        <div className="text-center py-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Discover India's Next
                <span className="block text-blue-600">Athletic Champions</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                A standardized, tech-driven platform to identify and nurture sporting talent from every corner of the nation.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Link to="/register" className="w-48">
                    <Button variant="primary">Get Started</Button>
                </Link>
                <Link to="/leaderboard" className="w-48">
                    <Button variant="secondary">View Leaderboard</Button>
                </Link>
            </div>
             <div className="mt-16">
                
            </div>
        </div>
    );
};

export default HomePage;