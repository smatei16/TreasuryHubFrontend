import React, {useEffect, useState} from 'react';
import "./AccountModal.css";

function AccountModal({ account, isOpen, onClose, onSave }) {

    const [bankName, setBankName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [balance, setBalance] = useState('');

    useEffect(() => {
        if (isOpen && account) {
            setBankName(account.bankName);
            setAccountType(account.accountType);
            setAccountNumber(account.accountNumber);
            setBalance(account.balance);
        }
    }, [isOpen, account]);

    const handleSave = () => {
        onSave(account.id, { bankName, accountType, accountNumber, balance });
        onClose();
    };

    if(!isOpen) return null;

    return (
        <div className="wallet-modal">
            <div className="wallet-modal-content">
                <span className="wallet-modal-close" onClick={onClose}>&times;</span>
                <h2>{account.id ? 'Edit Account' : 'Add New Account'}</h2>
                <div className="wallet-modal-info">
                    <div className="wallet-modal-column">
                        <span className="wallet-modal-label">Account name</span>
                        <span className="wallet-modal-label">Account type</span>
                        <span className="wallet-modal-label">Account number</span>
                        <span className="wallet-modal-label">Balance</span>
                    </div>
                    <div className="wallet-modal-column">
                        <input className="wallet-modal-input" type="text" value={bankName} onChange={e => setBankName(e.target.value)} required/>
                        <input className="wallet-modal-input" type="text" value={accountType} onChange={e => setAccountType(e.target.value)}/>
                        <input className="wallet-modal-input" type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)}/>
                        <input className="wallet-modal-input" type="text" value={balance} onChange={e => setBalance(e.target.value)} required/>
                    </div>
                </div>
                <button onClick={handleSave}>{account.id ? 'Save Changes' : 'Create Account'}</button>
            </div>
        </div>
    );
}

export default AccountModal;