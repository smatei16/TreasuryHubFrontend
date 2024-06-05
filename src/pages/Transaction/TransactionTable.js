import React, { useState, useEffect } from 'react';
import TransactionModal from './TransactionModal';
import './Transaction.css';
import Navbar from "../Navbar/Navbar";
import ParticlesBackground from "../Homepage/ParticlesBackground";

function TransactionCard({ transaction, categories, accounts, onEdit, onDelete }) {
    // const categoryName = categories[transaction.transaction];
    // const accountName = accounts[transaction.accountId];
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        onDelete(transaction.id);
    }
    return (
        // <div className="transaction-card" onClick={() => onEdit(transaction)}>
        //     <h3 className="transaction-h3">{transaction.type}</h3>
        //     <div className="transaction-details">
        //         <div className="transaction-info">
        //             <div className="transaction-column">
        //                 {transaction.transactionCategoryId !== null &&
        //                     <span className="transaction-label">Category</span>}
        //                 {transaction.type !== "TRANSFER" && <span className="transaction-label">Account</span>}
        //                 {transaction.type === "TRANSFER" && <span className="transaction-label">From</span>}
        //                 {transaction.type === "TRANSFER" && <span className="transaction-label">To</span>}
        //                 <span className="transaction-label">Amount</span>
        //                 {transaction.type === "EXPENSE" && <span className="transaction-label">Merchant</span>}
        //             </div>
        //             <div className="transaction-column">
        //                 {transaction.transactionCategoryId !== null &&
        //                     <span className="transaction-value">{transaction.name}</span>}
        //                 {transaction.type !== "TRANSFER" &&
        //                     <span className="transaction-value">{transaction.sourceAccountBankName}</span>}
        //                 {transaction.type === "TRANSFER" &&
        //                     <span className="transaction-value">{transaction.sourceAccountBankName}</span>}
        //                 {transaction.type === "TRANSFER" &&
        //                     <span className="transaction-value">{transaction.destinationAccountBankName}</span>}
        //                 <span className="transaction-value">{transaction.amount}</span>
        //                 {transaction.type === "EXPENSE" && <span
        //                     className="transaction-value">{transaction.merchant !== null ? transaction.merchant : 'Not set'}</span>}
        //             </div>
        //             <div className="transaction-column">
        //                 <button className="transaction-delete-button" onClick={handleDeleteClick}>Delete</button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <tr className="border-b hover:bg-color-1">
            <th scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap">
                Apple MacBook Pro 17"
            </th>
            <td className="px-6 py-4">
                Silver
            </td>
            <td className="px-6 py-4">
                Laptop
            </td>
            <td className="px-6 py-4">
                $2999
            </td>
            {/*<td className="px-6 py-4">*/}
            {/*    <a href="#"*/}
            {/*       className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>*/}
            {/*</td>*/}
        </tr>
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
        date: updatedTransaction.date
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
        merchant: newTransaction.merchant, details: newTransaction.details, date: newTransaction.date}
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


function Transaction2() {
    const [transactions, setTransactions] = useState([]);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);

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
            // setCategories(data.reduce((acc, item) => {
            //     acc[item.id] = item.name;
            //     return acc;
            // }, {}));
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
            // setAccounts(data.reduce((acc, item) => {
            //     acc[item.id] = item.bankName;
            //     return acc;
            // }, {}));
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

    const handleTransactionUpdate = async (id, updatedTransaction ) => {
        try {
            if (id) {
                const updated = await fetchUpdate(id, updatedTransaction);
                const response = await fetchDetailedTransactionId(updated.id);
                setTransactions(transactions.map(transaction => transaction.id === id ? { ...transaction, ...response } : transaction));
            } else {
                const newTransaction = await fetchCreate(updatedTransaction);
                const response = await fetchDetailedTransactionId(newTransaction.id);
                setTransactions([...transactions, response]);
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

    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const date = transaction.date.split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(transaction);
        return acc;
    }, {});

    const openNewTransactionModal = () => {
        setCurrentTransaction({ transactionCategoryId: '', amount: '', sourceAccountId: '', destinationAccountId: '', merchant: '', details: '', date: '' });
    };

    return (
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground/>
            <Navbar/>
            <div
                className="flex-grow flex flex-col items-center justify-center px-6 py-8 mx-auto max-h-screen-xl max-w-screen-xl w-full bg-color-1">
                <div className="overflow-x-auto shadow-md sm:rounded-lg w-full z-10 bg-white">
                    <table className="w-full text-md text-left rtl:text-right">
                        <thead
                            className="text-lg font-roboto uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Color
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            {/*<th scope="col" className="px-6 py-3">*/}
                            {/*    Action*/}
                            {/*</th>*/}
                        </tr>
                        </thead>
                        <tbody>
                        <TransactionCard/>
                        <TransactionCard/>
                        </tbody>
                    </table>
                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-6"
                         aria-label="Table navigation">
                        <span
                            className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span
                            className="font-semibold text-gray-900 dark:text-white">1-10</span> of <span
                            className="font-semibold text-gray-900 dark:text-white">1000</span></span>
                        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                            </li>
                            <li>
                                <a href="#" aria-current="page"
                                   className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
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

export default Transaction2;