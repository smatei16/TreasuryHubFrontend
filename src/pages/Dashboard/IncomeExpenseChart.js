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
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar'], // Ex. ['Jan', 'Feb', 'Mar']
        datasets: [
            {
                label: 'Venituri',
                data: [5000, 6000, 5500], // Ex. [5000, 6000, 5500]
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Cheltuieli',
                data: [4000, 4500, 4800], // Ex. [4000, 4500, 4800]
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
            <Line data={chartData} options={options} />
        </div>
    );
};

export default IncomeExpenseChart;