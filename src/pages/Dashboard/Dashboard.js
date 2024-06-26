import React, {useEffect, useState} from "react";
import Navbar from "../Navbar/Navbar";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import IncomeExpenseChart from "./IncomeExpenseChart";
import CategoriesChart from "./CategoriesChart";
import HistoricalCategoriesChart from "./HistoricalCategoriesChart";
import TopGainsChart from "./TopGainsChart";

const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const getFirstDayOfMonth = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}-01`;
};
export default function Dashboard() {

    const [chart1TransactionType, setChart1TransactionType] = useState('');
    const [chart2TransactionType, setChart2TransactionType] = useState('');
    const [categories, setCategories] = useState([]);
    const [chart1FilteredCategories, setChart1FilteredCategories] = useState([]);
    const [chart2FilteredCategories, setChart2FilteredCategories] = useState([]);
    const [chart2SelectedCategory, setChart2SelectedCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/category/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setChart2FilteredCategories(categories.filter(category => category.transactionType === chart2TransactionType))
    }, [categories, chart2TransactionType]);

    return(
        <div className="w-full min-h-screen bg-color-1 flex flex-col">
            <ParticlesBackground />
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-md z-20">
                            <div className="flex justify-center mb-4">
                                <p className="font-roboto font-bold px-4 py-2 mx-2 bg-color-4 text-color-3 rounded">Last 12 months trends</p>
                            </div>
                            <IncomeExpenseChart/>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md z-20">
                            <div className="flex justify-center mb-4">
                                <p className="font-roboto font-bold px-4 py-2 mx-2 bg-color-4 text-color-3 rounded">This
                                    month categories trends</p>
                                <select id="category"
                                        className="border border-color-4 text-sm font-roboto rounded-lg block px-4 py-2 mx-2"
                                        value={chart1TransactionType} onChange={e => setChart1TransactionType(e.target.value)}>
                                    <option selected="">Select transaction type</option>
                                    <option value="INCOME">Income</option>
                                    <option value="EXPENSE">Expense</option>
                                </select>
                            </div>
                            <CategoriesChart type={chart1TransactionType}/>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md z-20">
                            <div className="flex justify-center mb-4">
                                <p className="font-roboto font-bold px-4 py-2 mx-2 bg-color-4 text-color-3 rounded">Last
                                    12 months categories trends</p>
                                <select id="category"
                                        className="border border-color-4 text-sm font-roboto rounded-lg block px-4 py-2 mx-2"
                                        value={chart2TransactionType} onChange={e => setChart2TransactionType(e.target.value)}>
                                    <option selected="">Select transaction type</option>
                                    <option value="INCOME">Income</option>
                                    <option value="EXPENSE">Expense</option>
                                </select>
                                <select
                                    className="border border-color-4 text-sm font-roboto rounded-lg block px-4 py-2 mx-2"
                                    onChange={e => setChart2SelectedCategory(e.target.value)}>
                                    <option selected="">Select a category</option>
                                    {chart2FilteredCategories.map(category => (
                                        <option value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <HistoricalCategoriesChart category={chart2SelectedCategory}/>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md z-20">
                            <div className="flex justify-center mb-4">
                                <p className="font-roboto font-bold px-4 py-2 mx-2 bg-color-4 text-color-3 rounded">Today
                                    trending stocks</p>
                            </div>
                            <TopGainsChart/>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}