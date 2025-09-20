import React, { useState, useEffect } from 'react';
import api from '../lib/axios'; // Using the direct axios instance for data fetching
import StatCard from '../components/dashboard/StatCard';
import ProgressChart from '../components/dashboard/ProgressChart';
import TestCard from '../components/tests/TestCard';
import Spinner from '../components/common/Spinner';

// Mock data for tests - in a real app, this would come from an API call
const MOCK_TESTS = [
    { id: '60d0fe4f5311236168a109ca', name: 'Vertical Jump', description: 'Test your explosive leg power.' },
    { id: '60d0fe4f5311236168a109cb', name: 'Sit-ups', description: 'Measure your core muscular endurance.' },
    { id: '60d0fe4f5311236168a109cc', name: 'Endurance Run', description: 'A proxy test for cardiovascular fitness.' },
    { id: '60d0fe4f5311236168a109cd', name: 'Shuttle Run', description: 'Test your agility and speed.' },
];

const DashboardPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, bestScore: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, you would fetch both tests and submissions
                // For now, we mock tests and fetch submissions
                const response = await api.get('/submissions/me');
                const userSubmissions = response.data.data;
                setSubmissions(userSubmissions);
                
                // Calculate stats
                if (userSubmissions.length > 0) {
                    const best = userSubmissions.reduce((max, s) => s.score > max ? s.score : max, 0);
                    setStats({ total: userSubmissions.length, bestScore: best });
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Tests Taken" value={stats.total} />
                <StatCard title="Best Overall Score" value={stats.bestScore} />
                <StatCard title="National Rank" value="N/A" />
            </div>

            {/* Progress Chart */}
            <div>
                <ProgressChart submissions={submissions} />
            </div>

            {/* Available Tests Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Tests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_TESTS.map(test => (
                        <TestCard key={test.id} test={test} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;