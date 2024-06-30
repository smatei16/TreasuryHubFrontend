// // ./src/components/TopGainsChart.js
// import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
//
// // Înregistrează componentele necesare
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
// );
//
// const TopGainsChart = () => {
//     const [data, setData] = useState([]);
//     const [userStocks, setUserStocks] = useState([]);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//
//         const fetchUserStocks = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const response = await fetch(`${process.env.REACT_APP_PROD}/user-stock/user`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });
//                 if(!response.ok) {
//                     console.error('Unauthorized');
//                 }
//                 const data = await response.json();
//                 setUserStocks(data.map(item => item.symbol));
//             } catch (error) {
//                 console.error('Error fetching user stocks');
//             }
//         };
//
//         fetchUserStocks();
//     }, []);
//
//
//
//     // const labels = data.map(item => item.indice);
//     const chartData = {
//         labels: userStocks.map(item => item.symbol),
//         datasets: [
//             {
//                 label: 'Percentage change',
//                 data: data.map(item => item.percentage),
//                 backgroundColor: 'rgba(75, 192, 192, 0.6)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };
//
//     const options = {
//         indexAxis: 'y',
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//             x: {
//                 beginAtZero: true,
//             },
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };
//
//     return (
//         <div className="w-full h-96 bg-white p-4 rounded-lg shadow-md">
//             <Bar data={chartData} options={options} />
//         </div>
//     );
// };
//
// export default TopGainsChart;
