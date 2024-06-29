import React, {useEffect, useState} from 'react';
import {FaArrowTrendDown, FaArrowTrendUp, FaMinus, FaPlus} from "react-icons/fa6";

function StockModal({ userStock, isOpen, onClose, onSave, onDelete }) {

    const [quantity, setQuantity] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [stockInfo, setStockInfo] = useState(null);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [error, setError] = useState('');
    const [symbol, setSymbol] = useState('');
    
    const [stockInfoName, setStockInfoName] = useState('');
    const [stockInfoSymbol, setStockInfoSymbol] = useState('');
    const [stockInfoExchange, setStockInfoExchange] = useState('');
    const [stockInfoPrice, setStockInfoPrice] = useState('');
    const [stockInfoChange, setStockInfoChange] = useState('');
    const [stockInfoChangesPercentage, setStockInfoChangesPercentage] = useState('');
    const [stockInfoMarketCap, setStockInfoMarketCap] = useState('');
    const [companyInfoCurrency, setCompanyInfoCurrency] = useState('');
    const [companyInfoExchange, setCompanyInfoExchange] = useState('');

    useEffect(() => {
        if (isOpen && userStock) {
            setQuantity(userStock.quantity);
            setPurchasePrice(userStock.purchasePrice);
            setPurchaseDate(userStock.purchaseDate);
            setSymbol(userStock.symbol);
            setError('');
        }
    }, [isOpen, userStock]);

    useEffect(() => {
        if(isOpen && stockInfo) {
            setStockInfoName(stockInfo.name);
            setStockInfoSymbol(stockInfo.symbol);
            setStockInfoExchange(stockInfo.exchange);
            setStockInfoPrice(stockInfo.price);
            setStockInfoChange(stockInfo.change);
            setStockInfoChangesPercentage(stockInfo.changesPercentage);
            setStockInfoMarketCap(stockInfo.marketCap);
        }
    }, [isOpen, stockInfo]);

    useEffect(() => {
        if(isOpen && companyInfo) {
            setCompanyInfoExchange(companyInfo.stockExchange);
            setCompanyInfoCurrency(companyInfo.currency);
        }
    }, [isOpen, companyInfo]);

    useEffect(() => {
        const fetchStockInformation = async () => {
            try {
                const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=iQ9IE0esp1r6ONQNVvNwLf6m9HnhBlvU`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok) {
                    console.error('Unauthorized');
                }
                const data = await response.json();
                setStockInfo(data[0]);
                console.log(symbol);
                console.log(data[0]);
            } catch (error) {
                console.error('Error fetching stock info');
            }
        };

        const fetchCompanyInformation = async () => {
            try {
                const response = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${symbol}&apikey=iQ9IE0esp1r6ONQNVvNwLf6m9HnhBlvU`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok) {
                    console.error('Unauthorized');
                }
                const data = await response.json();
                setCompanyInfo(data[0]);
                console.log(symbol);
                console.log(data[0]);
            } catch (error) {
                console.error('Error fetching stock info');
            }
        };

        fetchCompanyInformation();
        fetchStockInformation();
    }, [symbol]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await onSave(userStock.id, { symbol, quantity, purchasePrice, purchaseDate });
            onClose();
        } catch (error) {
            setError("Error");
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            await onDelete(userStock.id);
            onClose();
        } catch (error) {
            setError("Error");
        }
    }

    if(!isOpen) return null;

    return (
        <div className="w-full rounded-lg shadow max-w-lg bg-color-3 z-10">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                    <div className="flex flex-row justify-center items-center">
                        <p className="rounded-full bg-color-4 text-white p-1 m-1">{stockInfoExchange}</p>
                        <p className="text-xl font-roboto font-bold m-1">{stockInfoName}</p>
                    </div>
                    <button type="button"
                            className="text-gray-400 bg-transparent rounded-lg text-lg p-1.5 ml-auto inline-flex items-center"
                            onClick={onClose}>
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                        <p className="text-xl font-roboto font-bold">Symbol</p>
                        <p className="text-2xl font-roboto font-bold">{stockInfoSymbol}</p>
                    </div>
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                        <p className="text-xl font-roboto font-bold">Exchange</p>
                        <p className="text-2xl font-roboto font-bold">{companyInfoExchange}</p>
                    </div>
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                        <p className="text-xl font-roboto font-bold">Currency</p>
                        <p className="text-2xl font-roboto font-bold">{companyInfoCurrency}</p>
                    </div>
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                        <p className="text-xl font-roboto font-bold">Market capitalization</p>
                        <p className="text-2xl font-roboto font-bold">{formatCapitalization(stockInfoMarketCap)}</p>
                    </div>
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                        <p className="text-xl font-roboto font-bold">Price</p>
                        <p className="text-2xl font-roboto font-bold">{stockInfoPrice}</p>
                    </div>
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                        <p className="text-xl font-roboto font-bold">Price change</p>
                        <div className="flex flex-row items-center">
                            {stockInfoChange >= 0 && <FaPlus className="w-8 h-8 mr-2"></FaPlus>}
                            {stockInfoChange < 0 && <FaMinus className="w-8 h-8 mr-2"></FaMinus>}
                            <p className="text-2xl font-roboto font-bold">{positiveNumber(stockInfoChange)}</p>
                        </div>

                    </div>
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                        <p className="text-xl font-roboto font-bold">Percentage change</p>
                        <div className="flex flex-row items-center">
                            {stockInfoChangesPercentage < 0 &&
                                <FaArrowTrendDown className="w-8 h-8 mr-2"></FaArrowTrendDown>}
                            {stockInfoChangesPercentage >= 0 &&
                                <FaArrowTrendUp className="w-8 h-8 mr-2"></FaArrowTrendUp>}
                            <p className="text-2xl font-roboto font-bold">{positiveNumber(stockInfoChangesPercentage)}</p>
                        </div>

                    </div>
                </div>
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Purchased
                                quantity</label>
                            <input type="number"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter quantity" value={quantity}
                                   onChange={e => setQuantity(e.target.value)}
                                   required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Purchase price</label>
                            <input type="number"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter account type" value={purchasePrice}
                                   onChange={e => setPurchasePrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Purchase date</label>
                            <input type="date"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter account type" value={purchaseDate}
                                   onChange={e => setPurchaseDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="text-sm">
                            <label
                                className="font-bold">{error ? error : ""}</label>
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4 justify-center">
                        <button type="submit"
                                className="w-1/2 bg-color-1 hover:bg-orange-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            {userStock.id ? 'Save investment' : 'Add investment'}
                        </button>
                        {userStock.id &&
                            <button type="button"
                                    className="w-1/2 bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    onClick={handleDelete}>
                                Delete Investment from portfolio
                            </button>}
                    </div>
                </form>
            </div>
        </div>
    );
}

function formatCapitalization(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B'; // Billion
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M'; // Million
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K'; // Thousand
    } else {
        return num.toString(); // Less than 1000
    }
}

function positiveNumber(num) {
    if(num < 0)  return num * (-1);
    else return num;
}

export default StockModal;

