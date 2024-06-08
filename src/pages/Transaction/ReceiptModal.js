import React, { useState, useEffect } from 'react';
import './TransactionModal.css';
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../firebase";
import {v4} from 'uuid';
import {generateReceiptInfo, handleImageUpload} from "./TransactionUtils";

function ReceiptModal({ currentReceipt, categories, accounts, isOpen, onClose, onSave}) {
    const [transactionType, setTransactionType] = useState('EXPENSE');
    const [selectedSourceAccountId, setSelectedSourceAccountId] = useState('');
    const [selectedDestinationAccountId, setSelectedDestinationAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [transactionItems, setTransactionItems] = useState([{id: '', amount: ''}]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        setFilteredCategories(categories.filter(category => category.transactionType === transactionType))
    }, [categories, transactionType]);

    useEffect(() => {
        if(isOpen && currentReceipt) {
            setMerchant(currentReceipt.merchant || '');
            setDate(currentReceipt.date || '');
            setUrl(currentReceipt.url || '');
            setTransactionItems(currentReceipt.categories);
            setError('');
            setSelectedSourceAccountId('');
            setSelectedDestinationAccountId('');
            setDetails('');
        }
    }, [isOpen, currentReceipt]);

    const handleAddTransactionItem = ()  => {
        setTransactionItems([...transactionItems,  {id: '', amount: ''}]);
    }

    const handleRemoveTransactionItem = (index) => {
        setTransactionItems(transactionItems.filter((_, i) => i !== index));
    }

    const handleCategoryChange = (index, value) => {
        const updatedItems = [...transactionItems];
        updatedItems[index].id = value;
        setTransactionItems(updatedItems);
    };

    const handleAmountChange = (index, value) => {
        const updatedItems = [...transactionItems];
        updatedItems[index].amount = value;
        setTransactionItems(updatedItems);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        console.log(transactionItems);
        if(!transactionType || transactionType === 'Select a transaction type') setError('You must select a transaction type');
        else if((transactionType === 'INCOME' || transactionType === 'EXPENSE') && (transactionItems.length === 0 || (transactionItems.length === 1 && !transactionItems[0].id)))  setError('You must select a category');
        else if((transactionType === 'INCOME' || transactionType === 'EXPENSE') && (!selectedSourceAccountId || selectedSourceAccountId === 'Select an account'))  setError('You must select an account');
        else if(transactionType === 'TRANSFER' && (!selectedSourceAccountId || selectedSourceAccountId === 'Select an account' || !selectedDestinationAccountId || selectedDestinationAccountId === 'Select an account')) setError('You must select an account');

        else {
            try {
                let imageUrl = '';
                if(file) {
                    imageUrl = await handleImageUpload(file);
                    console.log(imageUrl);
                } else {
                    imageUrl = currentReceipt.url;
                }
                const sourceAccountId = selectedSourceAccountId;
                const destinationAccountId = selectedDestinationAccountId;
                if(transactionType === 'TRANSFER') {
                    await onSave('', {sourceAccountId, destinationAccountId, amount, details, date, imageUrl});
                } else {
                    for (const item of transactionItems) {
                        const transactionCategoryId = item.id;
                        const amount = item.amount;
                        await onSave('', {transactionCategoryId, sourceAccountId, amount, merchant, details, date, imageUrl});
                    }
                }
                onClose();
            } catch (error) {
                setError("Error submitting the transaction");
            }
        }
    };

    if(!isOpen) return null;

    const getGridClass = (length) => {
        if (length === 1) {
            return 'sm:grid-cols-2';
        } else if (length > 1) {
            return 'sm:grid-cols-3';
        } else {
            return '';
        }
    };
    const gridClass = `grid ${getGridClass(transactionItems.length)} gap-4`;

    const handleImageChange = (event) => {
        setFile(event.target.files[0]);
    }

    return (
        <div className="w-full rounded-lg shadow max-w-2xl bg-color-3 z-20 m-4">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                    <h1 className="text-xl font-roboto font-bold">
                        Create a transaction
                    </h1>
                    <button type="button"
                            className="text-gray-400 bg-transparent rounded-lg text-lg p-1.5 ml-auto inline-flex items-center"
                            onClick={onClose}>
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Transaction
                                Date</label>
                            <input type="datetime-local"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter transaction date" value={date}
                                   onChange={e => setDate(e.target.value)}
                                   required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Transaction
                                Type</label>
                            <select className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                    value={transactionType} onChange={e => setTransactionType(e.target.value)}>
                                <option selected="">Select type</option>
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                                <option value="TRANSFER">Transfer</option>
                            </select>
                        </div>
                        {transactionType !== 'TRANSFER' && transactionItems.map((item, index) => (
                            <div>
                                <div className={gridClass}>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Transaction
                                            Category</label>
                                        <select
                                            className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                            value={item.id}
                                            onChange={e => handleCategoryChange(index, e.target.value)}>
                                            <option selected="">Select a category</option>
                                            {filteredCategories.map(category => (
                                                <option value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium font-roboto text-gray-900">Amount</label>
                                        <input type="number"
                                               className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                               placeholder="Enter transaction amount" value={item.amount}
                                               onChange={e => handleAmountChange(index, e.target.value)}
                                               required
                                        />
                                    </div>
                                    {transactionItems.length > 1 && <div>
                                        <label
                                            className="block mb-2 text-sm font-medium font-roboto text-gray-900">Remove
                                            category</label>
                                        <button type="button"
                                                className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5 bg-color-1 hover:bg-orange-200"
                                                onClick={() => handleRemoveTransactionItem(index)}>
                                            Delete
                                        </button>
                                    </div>}
                                </div>
                                <div className="flex justify-center">
                                    <button type="button"
                                            className="border border-color-4 text-sm font-roboto rounded-lg block p-2.5 bg-color-1 hover:bg-orange-200"
                                            onClick={() => handleAddTransactionItem(index)}>
                                        Add category
                                    </button>
                                </div>
                            </div>

                        ))}
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Source
                                Account</label>
                            <select className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                    value={selectedSourceAccountId}
                                    onChange={e => setSelectedSourceAccountId(e.target.value)}>
                                <option selected="">Select account</option>
                                {accounts.map(account => (
                                    <option value={account.id}>{account.bankName}</option>
                                ))}
                            </select>
                        </div>
                        {transactionType === 'TRANSFER' && <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Destination
                                Account</label>
                            <select className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                    value={selectedDestinationAccountId}
                                    onChange={e => setSelectedDestinationAccountId(e.target.value)}>
                                <option selected="">Select account</option>
                                {accounts.map(account => (
                                    <option value={account.id}>{account.bankName}</option>
                                ))}
                            </select>
                        </div>}
                        {transactionType === 'EXPENSE' && <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Merchant</label>
                            <input type="text"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter merchant" value={merchant}
                                   onChange={e => setMerchant(e.target.value)}
                            />
                        </div>}
                        {transactionType === 'TRANSFER' && <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Amount</label>
                            <input type="number"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   value={amount}
                                   placeholder="Enter amount"
                                   onChange={e => setAmount(e.target.value)}/>
                        </div>
                        }
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Details</label>
                            <input type="text"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter transaction details" value={details}
                                   onChange={e => setDetails(e.target.value)}
                            />
                        </div>
                        {url && <div className="flex flex-col content-center items-center">
                            {/*<label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Details</label>*/}
                            <img className="h-auto w-full rounded-lg" src={url}
                                 alt="image description"/>
                        </div>}
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Add
                                image</label>
                            <input type="file"
                                   accept="image/*"
                                   className="w-full text-lg
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-white file:text-color-4
                                    hover:file:bg-orange-200"
                                   onChange={handleImageChange}
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
                            Create Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReceiptModal;
