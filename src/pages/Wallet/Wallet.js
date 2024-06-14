import React, {useEffect, useState} from 'react';
import './Wallet.css';
import Navbar from "../Navbar/Navbar";
import AccountModal from "./AccountModal";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import {MdAccountBalance} from "react-icons/md";

function BankAccountCard({ account, onEdit, onDelete }) {
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        onDelete(account.id);
    }
    return (
        // <div className="wallet-card" onClick={() => onEdit(account)}>
        //     <h3 className="wallet-h3">{account.bankName}</h3>
        //     <div className="wallet-details">
        //         <div className="wallet-info">
        //             <div className="wallet-column">
        //                 <span className="wallet-label">Account type</span>
        //                 <span className="wallet-label">Account number</span>
        //                 <span className="wallet-label">Balance</span>
        //             </div>
        //             <div className="wallet-column">
        //                 <span className="wallet-value">{account.accountType.length !== 0 ? account.accountType : 'Not set'}</span>
        //                 <span className="wallet-value">{account.accountNumber.length !== 0 ? account.accountNumber : 'Not set'}</span>
        //                 <span className="wallet-value">{account.balance}</span>
        //             </div>
        //             <div className="wallet-column">
        //                 <button className="wallet-delete-button" onClick={handleDeleteClick}>Delete</button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <li className="py-3 sm:py-4 rounded-lg hover:bg-color-1" onClick={() => onEdit(account)}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <MdAccountBalance className="w-8 h-8 rounded-full"/>
                </div>
                <div className="flex-1 min-w-0 ms-4">
                    <p className="font-semibold text-gray-900 truncate">
                        {account.bankName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {account.accountNumber}
                    </p>
                </div>
                <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {account.accountType}
                    </p>
                </div>
                <div
                    className="flex-1 font-bold">
                    {account.balance} {account.currency}
                </div>
            </div>
        </li>
    );
}

async function fetchUpdate(id, updatedAccount) {
    const token = localStorage.getItem('token');
    const data = {
        bankName: updatedAccount.bankName, accountType: updatedAccount.accountType,
        accountNumber: updatedAccount.accountNumber, balance: updatedAccount.balance,
        currency: updatedAccount.currency
    }
    const response = await fetch(`${process.env.REACT_APP_PROD}/account/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error('Failed to update the account');
    }

    return await response.json();
}

async function fetchCreate(newAccount) {
    const token = localStorage.getItem('token');
    const data = {
        bankName: newAccount.bankName, accountType: newAccount.accountType,
        accountNumber: newAccount.accountNumber, balance: newAccount.balance,
        currency: newAccount.currency
    }
    const response = await fetch(`${process.env.REACT_APP_PROD}/account/save`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if(!response.ok) {
        console.error('Failed to create the account');
    }

    return await response.json();
}

function Wallet() {
    const [accounts, setAccounts] = useState([]);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.REACT_APP_PROD}/account/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok) {
                    console.error('Response error');
                }
                const data = await response.json();
                setAccounts(data);
                console.log(data);
            } catch (error) {
                console.error('Fetch error');
            }
        };

        const fetchCurrencies = async () => {
            try {
                const response = await fetch(`https://v6.exchangerate-api.com/v6/4997e360e3c90c05c69560bc/codes`, {
                    method: 'GET',
                });
                if(!response.ok) {
                    console.error('Response error');
                }
                const data = await response.json();
                const codes = data.supported_codes.map(([code, name]) => ({currency_code: code, currency_name: name}));
                setCurrencies(codes);
            } catch (error) {
                console.error('Fetch error');
            }
        };

        fetchAccounts();
        fetchCurrencies();
    }, []);

    const handleAccountUpdate = async (id, updatedAccount) => {
        try {
            if (id) {
                const updated = await fetchUpdate(id, updatedAccount);
                setAccounts(accounts.map(account => account.id === id ? { ...account, ...updated } : account));
            } else {
                const newAccount = await fetchCreate(updatedAccount);
                setAccounts([...accounts, newAccount]);
            }
        } catch (error) {
            console.error('Error processing account update:', error);
        }
    };

    const handleDeleteAccount = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/account/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(!response.ok) {
                console.error('Failed to delete the account');
            }

            setAccounts(accounts.filter(account => account.id !== id));
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const openNewAccountModal = () => {
        setCurrentAccount({ bankName: '', accountType: '', accountNumber: '', balance: '' }); // Cont gol pentru creare
    };

    return (
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground/>
            <Navbar/>
            <div
                className="flex-grow flex flex-col items-center justify-center px-6 py-8 mx-auto max-h-screen-xl w-full bg-color-1">
                {!currentAccount &&
                    <div className="w-full max-w-screen-sm p-4 bg-white border rounded-lg shadow z-10">
                        <div className="flex items-center justify-between">
                            <h5 className="text-xl font-bold font-roboto leading-none text-gray-900">Accounts</h5>
                            {/*<a href="#" className="text-sm font-medium text-blue-600 hover:underline">*/}
                            {/*    View all*/}
                            {/*</a>*/}
                            <button className="font-roboto hover:font-bold" onClick={openNewAccountModal}>+ Add
                                account
                            </button>
                        </div>
                        <div className="flow-root">
                            <ul role="list" className="divide-y">
                                {accounts.map(account => (
                                    <BankAccountCard key={account.id} account={account} onEdit={setCurrentAccount}
                                                     onDelete={handleDeleteAccount}/>
                                ))}
                                {accounts.length === 0 &&
                                    <p className="truncate font-roboto">No accounts added</p>}
                            </ul>
                        </div>
                    </div>
                }
                <AccountModal
                    account={currentAccount}
                    currencies={currencies}
                    isOpen={!!currentAccount}
                    onClose={() => setCurrentAccount(null)}
                    onSave={handleAccountUpdate}
                    onDelete={handleDeleteAccount}
                />
            </div>
        </div>

        // <div className="wallet-container">
        //     <Navbar />
        //     <div className="wallet-div">
        //         {accounts.map(account => (
        //             <BankAccountCard key={account.id} account={account} onEdit={setCurrentAccount} onDelete={handleDeleteAccount} />
        //         ))}
        //         <div className="wallet-add-button-div">
        //             <button className="wallet-add-button" onClick={openNewAccountModal}></button>
        //         </div>
        //         <AccountModal
        //             account={currentAccount}
        //             isOpen={!!currentAccount}
        //             onClose={() => setCurrentAccount(null)}
        //             onSave={handleAccountUpdate}
        //         />
        //     </div>
        // </div>
    );
}

export default Wallet;

