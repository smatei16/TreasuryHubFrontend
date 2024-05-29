import React, { useState, useEffect } from 'react';
import './TransactionModal.css';

function TransactionModal({ currentTransaction, categories, accounts, isOpen, onClose, onSave }) {
    const [transactionType, setTransactionType] = useState('INCOME');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSourceAccountId, setSelectedSourceAccountId] = useState('');
    const [selectedDestinationAccountId, setSelectedDestinationAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
        setFilteredCategories(categories.filter(category => category.transactionType === transactionType))
    }, [categories, transactionType]);

    useEffect(() => {
        if(isOpen && currentTransaction) {
            setTransactionType(currentTransaction.type || 'INCOME');
            setSelectedCategoryId(currentTransaction.transactionCategoryId || '');
            setSelectedSourceAccountId(currentTransaction.sourceAccountId  || '');
            setSelectedDestinationAccountId(currentTransaction.destinationAccountId || '');
            setAmount(currentTransaction.amount || '');
            setMerchant(currentTransaction.merchant || '');
            setDetails(currentTransaction.details || '');
            setDate(currentTransaction.date || '');
            setError('');
        }
    }, [isOpen, currentTransaction]);

    const handleSubmit = async(event) => {
        event.preventDefault();
        // if(!transactionType || transactionType === 'Select a transaction type') setError('You must select a transaction type');
        if(transactionType === 'TRANSFER' && (!selectedSourceAccountId || selectedSourceAccountId === 'Select an account' || !selectedDestinationAccountId || selectedDestinationAccountId === 'Select an account')) setError('You must select an account');
        else if((transactionType === 'INCOME' || transactionType === 'EXPENSE') && (!selectedCategoryId || selectedCategoryId === 'Select a category'))  setError('You must select a category');
        else if((transactionType === 'INCOME' || transactionType === 'EXPENSE') && (!selectedSourceAccountId || selectedSourceAccountId === 'Select an account'))  setError('You must select an account');
        else {
            try {
                const transactionCategoryId =  selectedCategoryId;
                const sourceAccountId = selectedSourceAccountId;
                const destinationAccountId = selectedDestinationAccountId;
                await onSave(currentTransaction.id, {transactionCategoryId, sourceAccountId, destinationAccountId, amount, merchant, details, date});
                onClose();
            } catch (error) {
                setError("Error submitting the transaction");
            }
        }
    };

    if(!isOpen) return null;

    return (
        <div className="transaction-modal">
             <div className="transaction-modal-content">
                 <span className="transaction-modal-close" onClick={onClose}>&times;</span>
                 <h2>{currentTransaction.id ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                 <form onSubmit={handleSubmit}>
                     <div className="transaction-modal-input-box">
                         <label className="transaction-modal-label">Type</label>
                         <select className="transaction-modal-select" value={transactionType}
                                 onChange={e => setTransactionType(e.target.value)}>
                             {/*<option className="transaction-modal-option" value="Select a transaction type">Select a transaction type</option>*/}
                             <option className="transaction-modal-option" value="INCOME">Income</option>
                             <option className="transaction-modal-option" value="EXPENSE">Expense</option>
                             <option className="transaction-modal-option" value="TRANSFER">Transfer</option>
                         </select>
                     </div>
                     {
                         transactionType !== 'TRANSFER' && (
                             <div className="transaction-modal-input-box">
                                 <label className="transaction-modal-label">Category</label>
                                 <select className="transaction-modal-select" value={selectedCategoryId}
                                         onChange={e => setSelectedCategoryId(e.target.value)}>
                                     <option className="transaction-modal-option" value="Select a category">Select a category</option>
                                     {filteredCategories.map(category => (
                                         <option className="transaction-modal-option"
                                                 key={category.id} value={category.id}>{category.name}</option>
                                     ))}
                                 </select>
                             </div>
                         )
                     }
                     <div className="transaction-modal-input-box">
                         <label className="transaction-modal-label">Source Account</label>
                         <select className="transaction-modal-select" value={selectedSourceAccountId}
                                 onChange={e => setSelectedSourceAccountId(e.target.value)}>
                             <option className="transaction-modal-option" value="Select an account">Select an account</option>
                             {accounts.map(account => (
                                 <option className="transaction-modal-option"
                                         key={account.id} value={account.id}>{account.bankName}</option>
                             ))}
                         </select>
                     </div>
                     {
                         transactionType === 'TRANSFER' && (
                             <div className="transaction-modal-input-box">
                                 <label className="transaction-modal-label">Destination Account</label>
                                 <select className="transaction-modal-select" value={selectedDestinationAccountId}
                                         onChange={e => setSelectedDestinationAccountId(e.target.value)}>
                                     <option className="transaction-modal-option" value="Select an account">Select an account</option>
                                     {accounts.map(account => (
                                         <option className="transaction-modal-option"
                                                 key={account.id} value={account.id}>{account.bankName}</option>
                                     ))}
                                 </select>
                             </div>
                         )
                     }
                     {
                         transactionType === 'TRANSFER' && (
                             <div className="transaction-modal-input-box">
                                 <label className="transaction-modal-label">Amount</label>
                                 <input className="transaction-modal-input" type="number" value={amount}
                                        onChange={e => setAmount(e.target.value)}/>
                             </div>
                         )
                     }
                     {
                         transactionType === 'EXPENSE' && (
                             <div className="transaction-modal-input-box">
                                 <label className="transaction-modal-label">Merchant</label>
                                 <input className="transaction-modal-input" type="text" value={merchant}
                                        onChange={e => setMerchant(e.target.value)}/>
                             </div>
                         )
                     }
                     <div className="transaction-modal-input-box">
                         <label className="transaction-modal-label">Details</label>
                         <input className="transaction-modal-input" type="text" value={details}
                                onChange={e => setDetails(e.target.value)}/>
                     </div>
                     <div className="transaction-modal-input-box">
                         <label className="transaction-modal-label">Date</label>
                         <input className="transaction-modal-input" type="datetime-local" value={date}
                                onChange={e => setDate(e.target.value)} required/>
                     </div>
                     <div className="transaction-modal-input-box">
                         <button className="transaction-modal-submit-button"
                                 type="submit">{currentTransaction.id ? 'Save Changes' : 'Create Category'}</button>
                     </div>
                     {
                         error &&
                         <div className="transaction-modal-input-box">
                             <p className="transaction-modal-error">{error}</p>
                         </div>}
                 </form>
             </div>
        </div>
    )
}
export default TransactionModal;
