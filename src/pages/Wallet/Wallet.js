import React, {useEffect, useState} from 'react';
import './Wallet.css';
import Navbar from "../Navbar/Navbar";
import AccountModal from "./AccountModal";

function BankAccountCard({ account, onEdit, onDelete }) {
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        onDelete(account.id);
    }
    return (
        <div className="wallet-card" onClick={() => onEdit(account)}>
            <h3 className="wallet-h3">{account.bankName}</h3>
            <div className="wallet-details">
                <div className="wallet-info">
                    <div className="wallet-column">
                        <span className="wallet-label">Account type</span>
                        <span className="wallet-label">Account number</span>
                        <span className="wallet-label">Balance</span>
                    </div>
                    <div className="wallet-column">
                        <span className="wallet-value">{account.accountType.length !== 0 ? account.accountType : '-'}</span>
                        <span className="wallet-value">{account.accountNumber.length !== 0 ? account.accountNumber : '-'}</span>
                        <span className="wallet-value">{account.balance}</span>
                    </div>
                    <div className="wallet-column">
                        <button className="wallet-delete-button" onClick={handleDeleteClick}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function fetchUpdate(id, updatedAccount) {
    const token = localStorage.getItem('token');
    const data = {bankName: updatedAccount.bankName, accountType: updatedAccount.accountType,
        accountNumber: updatedAccount.accountNumber, balance: updatedAccount.balance}
    const response = await fetch(`${process.env.REACT_APP_PROD}/account/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if(!response.ok) {
        console.error('Failed to update the account');
    }

    return await response.json();
}

async function fetchCreate(newAccount) {
    const token = localStorage.getItem('token');
    const data = {bankName: newAccount.bankName, accountType: newAccount.accountType,
        accountNumber: newAccount.accountNumber, balance: newAccount.balance}
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
            } catch (error) {
                console.error('Fetch error: ');
            }
        };

        fetchAccounts();
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
        <div className="wallet-container">
            <Navbar />
            <div className="wallet-div">
                {accounts.map(account => (
                    <BankAccountCard key={account.id} account={account} onEdit={setCurrentAccount} onDelete={handleDeleteAccount} />
                ))}
                <div className="wallet-add-button-div">
                    <button className="wallet-add-button" onClick={openNewAccountModal}></button>
                </div>
                <AccountModal
                    account={currentAccount}
                    isOpen={!!currentAccount}
                    onClose={() => setCurrentAccount(null)}
                    onSave={handleAccountUpdate}
                />
            </div>
        </div>
    );
}

export default Wallet;

