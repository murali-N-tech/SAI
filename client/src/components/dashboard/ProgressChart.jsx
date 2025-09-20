import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart = ({ submissions = [] }) => {
    const data = {
        labels: submissions.map(s => new Date(s.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Your Score',
                data: submissions.map(s => s.score),
                fill: false,
                backgroundColor: 'rgb(59, 130, 246)',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Your Performance Over Time',
            },
        },
    };
    
    if (submissions.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                <p>No submission data yet. Complete a test to see your progress!</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <Line data={data} options={options} />
        </div>
    );
};

export default ProgressChart;