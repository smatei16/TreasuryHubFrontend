// ./src/components/TopGainsChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Înregistrează componentele necesare
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TopGainsChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        // fetch(`/api/rapoarte/top-gains?utilizatorId=$`)
        //     .then(response => response.json())
        //     .then(data => {
        //         setData(data);
        //     })
        //     .catch(error => console.error('Error fetching data:', error));
    };

    // const labels = data.map(item => item.indice);
    const labels = ["AAPL", "NVIDIA"]
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Creșteri (%)',
                // data: data.map(item => item.procent),
                data: [-10, 15],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="w-full h-96 bg-white p-4 rounded-lg shadow-md">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default TopGainsChart;
