import React, { useState, useEffect } from 'react';
import TransactionModal from './TransactionModal';
import './Transaction.css';
import Navbar from "../Navbar/Navbar";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import {TbCategory, TbCategory2, TbCategoryMinus, TbCategoryPlus} from "react-icons/tb";
import BudgetModal from "../Budget/BudgetModal";
import {FaArrowDownLong} from "react-icons/fa6";
import {FaArrowCircleRight} from "react-icons/fa";
import {MdOutlineDocumentScanner} from "react-icons/md";
import ReceiptModal from "./ReceiptModal";
import {generateReceiptInfo, handleImageUpload} from "./TransactionUtils";

function TransactionCard({ transaction, onEdit, onDelete }) {
    // const categoryName = categories[transaction.transaction];
    // const accountName = accounts[transaction.accountId];
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        onDelete(transaction.id);
    }
    return (
        <li className="py-3 sm:py-4 rounded-lg hover:bg-color-1" onClick={() => onEdit(transaction)}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {transaction.type === 'INCOME' && <TbCategoryPlus className="w-8 h-8 rounded-full"/>}
                    {transaction.type === 'EXPENSE' && <TbCategoryMinus className="w-8 h-8 rounded-full"/>}
                    {transaction.type === 'TRANSFER' && <TbCategory2 className="w-8 h-8 rounded-full"/>}
                </div>
                {/*<div className="flex-1 min-w-0 ms-4">*/}
                {/*    <p className="text-md font-medium truncate">*/}
                {/*        {transaction.name}*/}
                {/*    </p>*/}
                {/*</div>*/}
                <div className="flex-1 min-w-0 ms-4">
                    <div>
                        <p className="font-bold truncate mr-1">
                            {transaction.name}
                        </p>
                    </div>
                    <div className="flex flex-row justify-center content-center items-center">
                        <p className="font-semibold truncate mr-1">
                            {transaction.sourceAccountBankName}
                        </p>
                        {transaction.type === 'TRANSFER' && <FaArrowCircleRight/>}
                        {transaction.type === 'TRANSFER' && <p className="font-semibold truncate ml-1">
                            {transaction.destinationAccountBankName}
                        </p>}
                    </div>
                </div>
                <div className="flex-1 min-w-0 ms-4">
                    <p className="text-md font-medium truncate">
                        {transaction.amount}
                    </p>
                    <p className="text-md font-medium truncate">
                        {transaction.merchant}
                    </p>
                </div>
            </div>
        </li>
    );
}

async function fetchUpdate(id, updatedTransaction) {
    const token = localStorage.getItem('token');
    const data = {
        transactionCategoryId: updatedTransaction.transactionCategoryId,
        amount: updatedTransaction.amount,
        sourceAccountId: updatedTransaction.sourceAccountId,
        destinationAccountId: updatedTransaction.destinationAccountId,
        merchant: updatedTransaction.merchant,
        details: updatedTransaction.details,
        date: updatedTransaction.date,
        url: updatedTransaction.imageUrl
    }
    const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error('Failed to update the transaction');
    }

    return await response.json();
}

async function fetchCreate(newTransaction) {
    const token = localStorage.getItem('token');
    const data = {
        transactionCategoryId: newTransaction.transactionCategoryId, amount: newTransaction.amount,
        sourceAccountId: newTransaction.sourceAccountId, destinationAccountId: newTransaction.destinationAccountId,
        merchant: newTransaction.merchant, details: newTransaction.details, date: newTransaction.date,
        url: newTransaction.imageUrl}
    console.log(data);
    const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/save`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if(!response.ok) {
        console.error('Failed to create the transaction');
    }

    return await response.json();
}

async function fetchDetailedTransactionId(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/user/detailed/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if(!response.ok) {
        console.error('Failed to fetch the transaction');
    }

    return await response.json();
}



function Transaction() {
    const [transactions, setTransactions] = useState([]);
    const [groupedTransactions, setGroupedTransactions] = useState({});
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [receiptFile, setReceiptFile] = useState(null);
    const [currentReceipt, setCurrentReceipt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generatingError, setGeneratingError] = useState('');

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

        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_PROD}/account/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setAccounts(data);
        };

        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/user/detailed`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            await fetchCategories();
            await fetchAccounts();
            setTransactions(data);
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        const grouped = transactions.reduce((acc, transaction) => {
            const date = transaction.date.split('T')[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(transaction);
            return acc;
        }, {});
        setGroupedTransactions(grouped);
    }, [transactions]);

    const handleTransactionUpdate = async (id, updatedTransaction ) => {
        try {
            if (id) {
                const updated = await fetchUpdate(id, updatedTransaction);
                const response = await fetchDetailedTransactionId(updated.id);
                setTransactions(transactions
                    .map(transaction => transaction.id === id ? { ...transaction, ...response } : transaction)
                    .sort((transaction1, transaction2) => new Date(transaction1.date) > new Date(transaction2.date) ? -1 : 1));
            } else {
                const newTransaction = await fetchCreate(updatedTransaction);
                const response = await fetchDetailedTransactionId(newTransaction.id);
                setTransactions([...transactions, response].sort((transaction1, transaction2) => new Date(transaction1.date) > new Date(transaction2.date) ? -1 : 1));
            }
        } catch (error) {
            console.error('Error processing transaction update:', error);
        }
    };

    const handleDeleteTransaction = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(!response.ok) {
                console.error('Failed to delete the transaction');
            } else {
                setTransactions(transactions.filter(transaction => transaction.id !== id));
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleReceiptImageChange = (event) => {
        setReceiptFile(event.target.files[0]);
    }

    const openNewTransactionModal = () => {
        setCurrentTransaction({ transactionCategoryId: '', amount: '', sourceAccountId: '', destinationAccountId: '', merchant: '', details: '', date: '', url: '' });
    };

    const openNewReceiptModal = async () => {
        setLoading(true);
        try {
            let imageUrl = '';
            let receiptInfo = '';
            const expenseCategories = categories
                .filter(category => category.transactionType === 'EXPENSE')
                .map(category => ({
                    id: category.id,
                    name: category.name,
                }));
            imageUrl = await handleImageUpload(receiptFile);
            console.log(imageUrl);
            receiptInfo = await generateReceiptInfo(imageUrl, expenseCategories);
            console.log(receiptInfo);
            console.log(receiptInfo.date);
            console.log(receiptInfo.merchant);
            console.log(receiptInfo.categories);
            console.log(expenseCategories);
            console.log(JSON.stringify(expenseCategories));
            setCurrentReceipt({ date: receiptInfo.date, merchant: receiptInfo.merchant, url: imageUrl, categories: receiptInfo.categories});
            console.log(currentReceipt);
        } catch (error) {
            console.error('Error generating transaction:', error);
            setGeneratingError(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground/>
            <Navbar/>
            {!currentTransaction && !currentReceipt && <div className="flex flex-col items-center w-full pt-8">
                <div className="max-w-screen-sm items-center w-full">
                    {/*<input className="border border-color-1 text-lf font-bold font-roboto rounded-lg block p-2.5 bg-color-3 hover:bg-orange-200 w-full"*/}
                    {/*        onClick={openNewTransactionModal}><MdOutlineDocumentScanner className="inline-block"/> Scan receipt*/}
                    {/*</input>*/}
                    <div className="flex flex-row items-center w-full">
                        <span className="w-full font-roboto text-lg font-bold"><MdOutlineDocumentScanner
                            className="inline-block"/>Scan Receipt</span>
                        <input
                            type="file"
                            accept="image/*"
                            // capture="environment"
                            onChange={handleReceiptImageChange}
                            className="w-full text-lg
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-color-3 file:text-color-4
                            hover:file:bg-orange-200"
                        />
                        <button
                            className="border border-color-1 text-lg font-bold font-roboto rounded-lg block p-2.5 bg-color-3 hover:bg-orange-200 w-full m-4"
                            onClick={openNewReceiptModal}>Generate transaction
                        </button>
                        {loading && <div className="">
                            <svg className="w-8 h-8 animate-spin text-white fill-color-3"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>}
                    </div>
                    <button
                        className="border border-color-1 text-lg font-bold font-roboto rounded-lg block p-2.5 bg-color-3 hover:bg-orange-200 w-full my-2"
                        onClick={openNewTransactionModal}>+ Add transaction
                    </button>
                    {generatingError && <p className="m-2 font-bold font-roboto">{generatingError}</p>}
                </div>
            </div>}
            <div
                className="flex-grow flex flex-col items-center justify-center px-6 mx-auto max-h-screen-xl w-full bg-color-1 gap-4">
                {!currentTransaction && !currentReceipt && Object.entries(groupedTransactions).map(([date, transactions], index) => (
                    <div className="w-full max-w-screen-sm p-4 bg-white border rounded-lg shadow z-10">
                        <div className="flex items-center justify-between">
                            <h5 className="text-xl font-bold font-roboto leading-none text-gray-900">{date}</h5>
                            {/*<a href="#" className="text-sm font-medium text-blue-600 hover:underline">*/}
                            {/*    View all*/}
                            {/*</a>*/}
                            {/*{index === 0 && <button className="font-roboto hover:font-bold" onClick={openNewTransactionModal}>+ Add*/}
                            {/*    transaction*/}
                            {/*</button>}*/}
                        </div>
                        <div className="flow-root">
                            <ul role="list" className="divide-y">
                                {/*<li className="py-3 sm:py-4 rounded-lg">*/}
                                {/*    <div className="flex items-center">*/}
                                {/*        <div className="flex-shrink-0">*/}
                                {/*            <TbCategory className="w-8 h-8 rounded-full"/>*/}
                                {/*        </div>*/}
                                {/*        <div className="flex-1 min-w-0 ms-4">*/}
                                {/*            <p className="font-bold font-roboto text-xl truncate">*/}
                                {/*                Category*/}
                                {/*            </p>*/}
                                {/*        </div>*/}
                                {/*        <div className="flex-1 min-w-0 ms-4">*/}
                                {/*            <p className="font-bold font-roboto text-xl truncate">*/}
                                {/*                Budget*/}
                                {/*            </p>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</li>*/}
                                {transactions.map(transaction => (
                                    <TransactionCard key={transaction.id} transaction={transaction}
                                                     onEdit={setCurrentTransaction}
                                                     onDelete={handleDeleteTransaction}/>
                                ))}
                                {transactions.length === 0 &&
                                    <p className="truncate font-roboto">No categories added</p>}
                            </ul>
                        </div>
                    </div>
                ))
                }
                <TransactionModal
                    currentTransaction={currentTransaction}
                    categories={categories}
                    accounts={accounts}
                    isOpen={!!currentTransaction}
                    onClose={() => setCurrentTransaction(null)}
                    onSave={handleTransactionUpdate}
                    onDelete={handleDeleteTransaction}
                />
                <ReceiptModal
                    currentReceipt={currentReceipt}
                    categories={categories}
                    accounts={accounts}
                    isOpen={!!currentReceipt}
                    onClose={()  => setCurrentReceipt(null)}
                    onSave={handleTransactionUpdate}
                    />
            </div>
        </div>


        // <div className="transaction-container">
        //     <Navbar/>
        //     <div className="transaction-div">
        //         {Object.entries(groupedTransactions).map(([date, transactions]) => (
        //             <div>
        //                 <h2>{date}</h2>
        //                 <div className="transaction-date" key={date}>
        //                     {transactions.map(transaction => (
        //                         <TransactionCard key={transaction.id} transaction={transaction} categories={categories}
        //                                          accounts={accounts} onEdit={setCurrentTransaction}
        //                                          onDelete={handleDeleteTransaction}/>
        //                     ))}
        //                 </div>
        //             </div>
        //         ))}
        //
        //         <div className="transaction-add-button-div">
        //             <button className="transaction-add-button" onClick={openNewTransactionModal}></button>
        //         </div>
        //
        //         <TransactionModal
        //             currentTransaction={currentTransaction}
        //             categories={categories}
        //             accounts={accounts}
        //             isOpen={!!currentTransaction}
        //             onClose={() => setCurrentTransaction(null)}
        //             onSave={handleTransactionUpdate}
        //         />
        //     </div>
        // </div>
    );
}

export default Transaction;