import React, { useState, useEffect } from 'react';
import ParticlesBackground from "../Homepage/ParticlesBackground";
import Navbar from "../Navbar/Navbar";
import {TbCategory, TbCategoryMinus, TbCategoryPlus} from "react-icons/tb";
import BudgetModal from "../Budget/BudgetModal";
import StockModal from "./StockModal";

function StockCard({ currentStock, onEdit, onDelete }) {
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        onDelete(currentStock.id);
    }
    return (
        <li className="py-3 sm:py-4 rounded-lg hover:bg-color-1" onClick={() => onEdit(currentStock)}>
            <div className="flex items-center">
                <div className="flex-1 min-w-0 ms-4">
                    <p className="font-semibold text-gray-900 truncate">
                        {currentStock.symbol}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {currentStock.quantity}x
                    </p>
                </div>
                <div className="flex-1 min-w-0 ms-4">
                    <p className="text-md font-medium truncate">
                        {currentStock.purchasePrice}
                    </p>
                </div>
            </div>
        </li>
    )
}

async function fetchUserStockUpdate(id, updatedUserStock) {
    const token = localStorage.getItem('token');
    const data = {
        symbol: updatedUserStock.symbol,
        quantity: updatedUserStock.quantity,
        purchasePrice: updatedUserStock.purchasePrice,
        purchaseDate: `${updatedUserStock.purchaseDate}T00:00`
    };
    const response = await fetch(`${process.env.REACT_APP_PROD}/user-stock/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error('Failed to update the user stock');
    }

    return await response.json();
}

async function fetchUserStockCreate(newUserStock) {
    const token = localStorage.getItem('token');
    console.log(newUserStock);
    const data = {
        symbol: newUserStock.symbol,
        quantity: newUserStock.quantity,
        purchasePrice: newUserStock.purchasePrice,
        purchaseDate: newUserStock.purchaseDate
    };
    const response = await fetch(`${process.env.REACT_APP_PROD}/user-stock/save`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error('Failed to create the user stock');
    }

    return await response.json();
}
const Investments = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userStocks, setUserStocks] = useState([]);
    const [currentStock, setCurrentStock] = useState(null);

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm.length < 3) {
            setResults([]);
            return;
        }

        setIsLoading(true);

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/stock/${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.error('Error fetching data');
                setIsLoading(false);
                return;
            }
            const data = await response.json();
            setResults(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {

        const fetchUserStocks = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.REACT_APP_PROD}/user-stock/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok) {
                    console.error('Unauthorized');
                }
                const data = await response.json();
                setUserStocks(data);
            } catch (error) {
                console.error('Error fetching user stocks');
            }
        };

        fetchUserStocks();
    }, []);

    const handleUserStockUpdate = async (id, updatedUserStock) => {
        try {
            console.log(updatedUserStock);
            if (id) {
                const updated = await fetchUserStockUpdate(id, updatedUserStock);
                setUserStocks(userStocks.map(budget => budget.id === id ? { ...budget, ...updated } : budget));
            } else {
                const newUserStock = await fetchUserStockCreate(updatedUserStock);
                setUserStocks([...userStocks, newUserStock]);
            }
        } catch (error) {
            console.error('Error processing user stock update:', error);
        }
    };

    const handleUserStockDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/user-stock/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(!response.ok) {
                console.error('Failed to delete the user stock');
            }

            setUserStocks(userStocks.filter(stock => stock.id !== id));
        } catch (error) {
            console.error('Error deleting user stock:', error);
        }
    };

    const openNewStockModal = (symbol) => {
        setCurrentStock({symbol: symbol, quantity: '', purchasePrice: '', purchaseDate: ''});
        // setCurrentSymbol(symbol);
    }
    const openExistingStockModal = (stock) => {
        setCurrentStock(stock);
        // setCurrentSymbol(symbol);
    }

    return (
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground/>
            <Navbar/>
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-8 mx-auto max-h-screen-xl w-full bg-color-1">
                {!currentStock &&
                    <div className="items-center justify-center mt-6 mx-auto max-w-screen-md w-full bg-color-1">
                        <input
                            type="search"
                            value={query}
                            onChange={handleSearch}
                            className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-color-3"
                            placeholder="Search on the market..."
                        />
                        {isLoading && <p className="mt-2 text-blue-500">Loading...</p>}
                        <ul className="mt-4 relative">
                            {results.map((item) => (
                                <li key={item.id} className="p-2 border-b rounded-lg border-color-4 bg-white hover:bg-color-1" onClick={e => openNewStockModal(item.symbol)}>
                                    <div className="flex flex-row justify-between">
                                        <p className="content-center">{item.symbol} - {item.name}</p>
                                        <p className="rounded-full bg-color-4 text-white p-1">{item.exchangeShortName}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>}
                {!currentStock && <div
                    className="flex flex-col items-center justify-center px-6 py-8 mx-auto max-h-screen-xl w-full bg-color-1">
                    <div className="w-full max-w-screen-sm p-4 bg-white border rounded-lg shadow z-10">
                        <div className="flex items-center justify-between">
                            <h5 className="text-xl font-bold font-roboto leading-none text-gray-900">Your investments</h5>
                            {/*<a href="#" className="text-sm font-medium text-blue-600 hover:underline">*/}
                            {/*    View all*/}
                            {/*</a>*/}
                            {/*<button className="font-roboto hover:font-bold" onClick={openNewStockModal}>+ Add*/}
                            {/*    stock*/}
                            {/*</button>*/}
                        </div>
                        <div className="flow-root">
                            <ul role="list" className="divide-y">
                                <li className="py-3 sm:py-4 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="font-bold font-roboto text-xl truncate">
                                                Symbol
                                            </p>
                                        </div>
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="font-bold font-roboto text-xl truncate">
                                                Purchase price
                                            </p>
                                        </div>
                                    </div>
                                </li>

                                {userStocks.map(selectedStock => (
                                    <StockCard key={selectedStock.id} currentStock={selectedStock}
                                               onEdit={openExistingStockModal}
                                               onDelete={handleUserStockDelete}/>
                                ))}
                                {userStocks.length === 0 &&
                                    <p className="truncate font-roboto">No stocks added</p>}
                            </ul>
                        </div>
                    </div>
                </div>}
                <StockModal
                    userStock={currentStock}
                    // symbol={currentSymbol}
                    isOpen={!!currentStock}
                    onClose={() => {setCurrentStock(null)}}
                    onSave={handleUserStockUpdate}
                    onDelete={handleUserStockDelete}
                />
            </div>
            </div>


    );
};

export default Investments;
