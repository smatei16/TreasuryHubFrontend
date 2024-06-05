import React, { useState, useEffect } from 'react';
import './TransactionModal.css';

function TransactionModal({ currentTransaction, categories, accounts, isOpen, onClose, onSave, onDelete }) {
    const [transactionType, setTransactionType] = useState('INCOME');
    // const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSourceAccountId, setSelectedSourceAccountId] = useState('');
    const [selectedDestinationAccountId, setSelectedDestinationAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [transactionItems, setTransactionItems] = useState([{categoryId: '', amount: ''}]);

    useEffect(() => {
        setFilteredCategories(categories.filter(category => category.transactionType === transactionType))
    }, [categories, transactionType]);

    useEffect(() => {
        if(isOpen && currentTransaction) {
            setTransactionType(currentTransaction.type || '');
            // setSelectedCategoryId(currentTransaction.transactionCategoryId || '');
            setSelectedSourceAccountId(currentTransaction.sourceAccountId  || '');
            setSelectedDestinationAccountId(currentTransaction.destinationAccountId || '');
            setAmount(currentTransaction.amount || '');
            setMerchant(currentTransaction.merchant || '');
            setDetails(currentTransaction.details || '');
            setDate(currentTransaction.date || '');
            setTransactionItems([{categoryId: currentTransaction.transactionCategoryId || '', amount: currentTransaction.amount || ''}]);
            setError('');
        }
    }, [isOpen, currentTransaction]);

    const handleAddTransactionItem = ()  => {
        setTransactionItems([...transactionItems,  {categoryId: '', amount: ''}]);
    }

    const handleRemoveTransactionItem = (index) => {
        setTransactionItems(transactionItems.filter((_, i) => i !== index));
    }

    const handleCategoryChange = (index, value) => {
        const updatedItems = [...transactionItems];
        updatedItems[index].categoryId = value;
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
        else if((transactionType === 'INCOME' || transactionType === 'EXPENSE') && (transactionItems.length === 0 || (transactionItems.length === 1 && !transactionItems[0].categoryId)))  setError('You must select a category');
        else if((transactionType === 'INCOME' || transactionType === 'EXPENSE') && (!selectedSourceAccountId || selectedSourceAccountId === 'Select an account'))  setError('You must select an account');
        else if(transactionType === 'TRANSFER' && (!selectedSourceAccountId || selectedSourceAccountId === 'Select an account' || !selectedDestinationAccountId || selectedDestinationAccountId === 'Select an account')) setError('You must select an account');

        else {
            try {
                const sourceAccountId = selectedSourceAccountId;
                const destinationAccountId = selectedDestinationAccountId;
                if(transactionType === 'TRANSFER') {
                    await onSave(currentTransaction.id, {sourceAccountId, destinationAccountId, amount, details, date});
                } else {
                    for (const item of transactionItems) {
                        const transactionCategoryId = item.categoryId;
                        const amount = item.amount;
                        await onSave(currentTransaction.id, {transactionCategoryId, sourceAccountId, amount, merchant, details, date});
                    }
                }
                onClose();
            } catch (error) {
                setError("Error submitting the transaction");
            }
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            await onDelete(currentTransaction.id);
            onClose();
        } catch (error) {
            setError("Error");
        }
    }

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

    return (
        <div className="w-full rounded-lg shadow max-w-2xl bg-color-3 z-10">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                    <h1 className="text-xl font-roboto font-bold">
                        {currentTransaction.id ? 'Edit transaction' : 'Create a transaction'}
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
                                            value={item.categoryId}
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
                                            className="border border-color-4 text-sm font-roboto rounded-lg block p-2.5 bg-color-1 hover:bg-orange-200 "
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
                                           className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5" value={amount}
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
                            {currentTransaction.id ? 'Save Changes' : 'Create Transaction'}
                        </button>
                        {currentTransaction.id &&
                            <button type="button"
                                    className="w-1/2 bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    onClick={handleDelete}>
                                'Delete Account'
                            </button>}
                    </div>
                </form>
            </div>
        </div>


        // <div className="transaction-modal">
        //      <div className="transaction-modal-content">
        //          <span className="transaction-modal-close" onClick={onClose}>&times;</span>
        //          <h2>{currentTransaction.id ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        //          <form onSubmit={handleSubmit}>
        //
        //              <div className="transaction-modal-input-box">
        //                  <label className="transaction-modal-label">Type</label>
        //                  <select className="transaction-modal-select" value={transactionType}
        //                          onChange={e => setTransactionType(e.target.value)}>
        //                      {/*<option className="transaction-modal-option" value="Select a transaction type">Select a transaction type</option>*/}
        //                      <option className="transaction-modal-option" value="INCOME">Income</option>
        //                      <option className="transaction-modal-option" value="EXPENSE">Expense</option>
        //                      <option className="transaction-modal-option" value="TRANSFER">Transfer</option>
        //                  </select>
        //              </div>
        //
        //              {transactionType !== 'TRANSFER' && transactionItems.map((item, index) => (
        //                  <div key={index} className="transaction-modal-input-box">
        //                      <label className="transaction-modal-label">Category</label>
        //                      <select className="transaction-modal-select" value={item.categoryId}
        //                              onChange={e => handleCategoryChange(index, e.target.value)}>
        //                          <option className="transaction-modal-option" value="Select a category">Select a
        //                              category
        //                          </option>
        //                          {filteredCategories.map(category => (
        //                              <option className="transaction-modal-option"
        //                                      key={category.id} value={category.id}>{category.name}</option>
        //                          ))}
        //                      </select>
        //
        //                      <label className="transaction-modal-label">Amount</label>
        //                      <input className="transaction-modal-input" type="number" value={item.amount}
        //                             onChange={e => handleAmountChange(index, e.target.value)}></input>
        //
        //                      {transactionItems.length > 1 && (
        //                          <button type="button"
        //                                  onClick={() => handleRemoveTransactionItem(index)}>Remove</button>
        //                      )}
        //                  </div>
        //              ))}
        //              {transactionType !== 'TRANSFER' && <div className="transaction-modal-input-box">
        //                  <button type="button" onClick={handleAddTransactionItem}>Add another category</button>
        //              </div>
        //              }
        //
        //              {/*{*/}
        //              {/*    transactionType !== 'TRANSFER' && (*/}
        //              {/*        <div className="transaction-modal-input-box">*/}
        //              {/*            <label className="transaction-modal-label">Category</label>*/}
        //              {/*            <select className="transaction-modal-select" value={selectedCategoryId}*/}
        //              {/*                    onChange={e => setSelectedCategoryId(e.target.value)}>*/}
        //              {/*                <option className="transaction-modal-option" value="Select a category">Select a*/}
        //              {/*                    category*/}
        //              {/*                </option>*/}
        //              {/*                {filteredCategories.map(category => (*/}
        //              {/*                    <option className="transaction-modal-option"*/}
        //              {/*                            key={category.id} value={category.id}>{category.name}</option>*/}
        //              {/*                ))}*/}
        //              {/*            </select>*/}
        //              {/*        </div>*/}
        //              {/*    )*/}
        //              {/*}*/}
        //              <div className="transaction-modal-input-box">
        //                  <label className="transaction-modal-label">Source Account</label>
        //                  <select className="transaction-modal-select" value={selectedSourceAccountId}
        //                          onChange={e => setSelectedSourceAccountId(e.target.value)}>
        //                      <option className="transaction-modal-option" value="Select an account">Select an account
        //                      </option>
        //                      {accounts.map(account => (
        //                          <option className="transaction-modal-option"
        //                                  key={account.id} value={account.id}>{account.bankName}</option>
        //                      ))}
        //                  </select>
        //              </div>
        //              {
        //                  transactionType === 'TRANSFER' && (
        //                      <div className="transaction-modal-input-box">
        //                          <label className="transaction-modal-label">Destination Account</label>
        //                          <select className="transaction-modal-select" value={selectedDestinationAccountId}
        //                                  onChange={e => setSelectedDestinationAccountId(e.target.value)}>
        //                              <option className="transaction-modal-option" value="Select an account">Select an
        //                                  account
        //                              </option>
        //                              {accounts.map(account => (
        //                                  <option className="transaction-modal-option"
        //                                          key={account.id} value={account.id}>{account.bankName}</option>
        //                              ))}
        //                          </select>
        //                      </div>
        //                  )
        //              }
        //              {
        //                  transactionType === 'TRANSFER' && (
        //                      <div className="transaction-modal-input-box">
        //                          <label className="transaction-modal-label">Amount</label>
        //                          <input className="transaction-modal-input" type="number" value={amount}
        //                                 onChange={e => setAmount(e.target.value)}/>
        //                      </div>
        //                  )
        //              }
        //              {
        //                  transactionType === 'EXPENSE' && (
        //                      <div className="transaction-modal-input-box">
        //                          <label className="transaction-modal-label">Merchant</label>
        //                          <input className="transaction-modal-input" type="text" value={merchant}
        //                                 onChange={e => setMerchant(e.target.value)}/>
        //                      </div>
        //                  )
        //              }
        //              <div className="transaction-modal-input-box">
        //                  <label className="transaction-modal-label">Details</label>
        //                  <input className="transaction-modal-input" type="text" value={details}
        //                         onChange={e => setDetails(e.target.value)}/>
        //              </div>
        //              <div className="transaction-modal-input-box">
        //                  <label className="transaction-modal-label">Date</label>
        //                  <input className="transaction-modal-input" type="datetime-local" value={date}
        //                         onChange={e => setDate(e.target.value)} required/>
        //              </div>
        //              <div className="transaction-modal-input-box">
        //                  <button className="transaction-modal-submit-button"
        //                          type="submit">{currentTransaction.id ? 'Save Changes' : 'Create Transaction'}</button>
        //              </div>
        //              {
        //                  error &&
        //                  <div className="transaction-modal-input-box">
        //                      <p className="transaction-modal-error">{error}</p>
        //                  </div>}
        //          </form>
        //      </div>
        // </div>
    )
}

export default TransactionModal;
