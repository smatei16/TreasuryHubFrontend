import {Line} from "react-chartjs-2";
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
import {useEffect, useState} from "react";

// Înregistrează componentele necesare
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const IncomeExpenseChart = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/monthly-summary`, {
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
        fetchData();
    }, []);

    const chartData = {
        labels: data.months,
        datasets: [
            {
                label: 'Incomes',
                data: data.totalIncomes,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Cheltuieli',
                data: data.totalExpenses,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="w-full h-96 bg-white p-4 rounded-lg shadow-md z-10">
            { !error && <Line data={chartData} options={options} />}
            { error && <p className="font-xl font-roboto font-bold">{error}</p>}
        </div>
    );
};

export default IncomeExpenseChart;