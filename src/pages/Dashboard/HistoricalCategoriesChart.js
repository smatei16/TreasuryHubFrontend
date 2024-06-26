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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const HistoricalCategoriesChart = ({ category }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [category]);

    const fetchData = () => {
        // fetch(`/api/rapoarte/budget-execution?utilizatorId=${utilizatorId}&startDate=${startDate}&endDate=${endDate}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         setData(displayType === 'venituri' ? data.venituri : data.cheltuieli);
        //     })
        //     .catch(error => console.error('Error fetching data:', error));
    };



    const labels = data.map(item => item.categorie);
    const chartData = {
        labels: ['Jan', 'Feb'],
        datasets: [
            {
                label: category,
                // data: data.map(item => item.suma),
                data: [1000, 200],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
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
            <Bar data={chartData} options={options}/>
        </div>
    );
};

export default HistoricalCategoriesChart;
