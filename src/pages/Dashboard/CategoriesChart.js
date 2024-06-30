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

const CategoriesChart = ({ type }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/category-summary/${type}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(!response.ok) {
                console.log('Unauthorized');
                setError("No data to display.")
            }
            try {
                const data = await response.json();
                setData(data);
                setError(null);
            } catch (error) {
                console.log("Ecountered an error fetching data: " +error);
                setError("No data to display.");
            }
        };
        if(type) fetchData();
    }, [type]);



    const chartData = {
        labels: data.categoryNames,
        datasets: [
            {
                label: type === 'INCOME' ? 'Income' : 'Spent',
                // data: data.map(item => item.suma),
                data: data.totalPerCategory,
                backgroundColor: type === 'INCOME' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)',
                borderColor: type === 'EXPENSE' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Buget',
                // data: data.map(item => item.buget),
                data: data.categoryBudgets,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
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
            {!error && <Bar data={chartData} options={options}/>}
            { error && <p className="font-xl font-roboto font-bold">{error}</p>}
        </div>
    );
};

export default CategoriesChart;
