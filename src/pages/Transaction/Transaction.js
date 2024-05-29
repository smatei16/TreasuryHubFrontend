import React, { useState, useEffect } from 'react';
import TransactionModal from './TransactionModal';
import './Transaction.css';
import Navbar from "../Navbar/Navbar";

function TransactionCard({ transaction, categories, accounts, onEdit, onDelete }) {
    // const categoryName = categories[transaction.transaction];
    // const accountName = accounts[transaction.accountId];
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        onDelete(transaction.id);
    }
    return (
        <div className="transaction-card" onClick={() => onEdit(transaction)}>
            <h3 className="transaction-h3">{transaction.type}</h3>
            <div className="transaction-details">
                <div className="transaction-info">
                    <div className="transaction-column">
                        {transaction.transactionCategoryId !== null &&
                            <span className="transaction-label">Category</span>}
                        {transaction.type !== "TRANSFER" && <span className="transaction-label">Account</span>}
                        {transaction.type === "TRANSFER" && <span className="transaction-label">From</span>}
                        {transaction.type === "TRANSFER" && <span className="transaction-label">To</span>}
                        <span className="transaction-label">Amount</span>
                        {transaction.type === "EXPENSE" && <span className="transaction-label">Merchant</span>}
                    </div>
                    <div className="transaction-column">
                        {transaction.transactionCategoryId !== null &&
                            <span className="transaction-value">{transaction.type}</span>}
                        {transaction.type !== "TRANSFER" &&
                            <span className="transaction-value">{transaction.sourceAccountBankName}</span>}
                        {transaction.type === "TRANSFER" &&
                            <span className="transaction-value">{transaction.sourceAccountBankName}</span>}
                        {transaction.type === "TRANSFER" &&
                            <span className="transaction-value">{transaction.destinationAccountBankName}</span>}
                        <span className="transaction-value">{transaction.amount}</span>
                        {transaction.type === "EXPENSE" && <span
                            className="transaction-value">{transaction.merchant !== null ? transaction.merchant : 'Not set'}</span>}
                    </div>
                    <div className="transaction-column">
                        <button className="transaction-delete-button" onClick={handleDeleteClick}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function fetchUpdate(id, updatedTransaction) {
    const token = localStorage.getItem('token');
    const data = {
        transactionCategoryId: updatedTransaction.transactionCategoryId, amount: updatedTransaction.amount,
        sourceAccountId: updatedTransaction.sourceAccountId, destinationAccountId: updatedTransaction.destinationAccountId,
        merchant: updatedTransaction.merchant, details: updatedTransaction.details, date: updatedTransaction.date}
    const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if(!response.ok) {
        console.error('Failed to update the transaction');
    }

    return await response.json();
}

async function fetchCreate(newTransaction) {
    const token = localStorage.getItem('token');
    const data =  {transactionCategoryId: newTransaction.transactionCategoryId, amount: newTransaction.amount,
        sourceAccountId: newTransaction.sourceAccountId, destinationAccountId: newTransaction.destinationAccountId,
        merchant: newTransaction.merchant, details: newTransaction.details, date: newTransaction.date}
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
        <div className="transaction-container">
            <Navbar/>
            <div className="transaction-div">
                {Object.entries(groupedTransactions).map(([date, transactions]) => (
                    <div>
                        <h2>{date}</h2>
                        <div className="transaction-date" key={date}>
                            {transactions.map(transaction => (
                                <TransactionCard key={transaction.id} transaction={transaction} categories={categories}
                                                 accounts={accounts} onEdit={setCurrentTransaction}
                                                 onDelete={handleDeleteTransaction}/>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="transaction-add-button-div">
                    <button className="transaction-add-button" onClick={openNewTransactionModal}></button>
                </div>

                <TransactionModal
                    currentTransaction={currentTransaction}
                    categories={categories}
                    accounts={accounts}
                    isOpen={!!currentTransaction}
                    onClose={() => setCurrentTransaction(null)}
                    onSave={handleTransactionUpdate}
                />
            </div>
        </div>
    );
}

export default Transaction;