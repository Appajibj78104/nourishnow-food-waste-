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
    Legend
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

const ImpactChart = ({ donations }) => {
    // Process donations data for the chart
    const monthlyData = donations.reduce((acc, donation) => {
        const date = new Date(donation.createdAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        acc[monthYear] = (acc[monthYear] || 0) + Number(donation.quantity);
        return acc;
    }, {});

    const data = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: 'Donations Impact',
                data: Object.values(monthlyData),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white'
                }
            },
            title: {
                display: true,
                text: 'Monthly Donation Trends',
                color: 'white'
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'white'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'white'
                }
            }
        }
    };

    return (
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
            <Line data={data} options={options} />
        </div>
    );
};

export default ImpactChart; 