import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import LeaderboardTable from '../components/LeaderboardTable';
import Spinner from '../components/common/Spinner';

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await api.get('/tests');
                setTests(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedTest(response.data.data[0]._id);
                }
            } catch (error) {
                console.error("Failed to fetch tests", error);
            }
        };
        fetchTests();
    }, []);

    useEffect(() => {
        if (selectedTest) {
            const fetchLeaderboard = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/leaderboard/${selectedTest}`);
                    setLeaderboard(response.data.data);
                } catch (error) {
                    console.error("Failed to fetch leaderboard", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchLeaderboard();
        }
    }, [selectedTest]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
            <div className="max-w-xs">
                <select
                    value={selectedTest}
                    onChange={(e) => setSelectedTest(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {tests.map(test => (
                        <option key={test._id} value={test._id}>{test.name}</option>
                    ))}
                </select>
            </div>
            {loading ? <Spinner /> : <LeaderboardTable data={leaderboard} />}
        </div>
    );
};

export default LeaderboardPage;