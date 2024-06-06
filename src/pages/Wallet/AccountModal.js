import React, {useEffect, useState} from 'react';
import "./AccountModal.css";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import Navbar from "../Navbar/Navbar";

function AccountModal({ account, isOpen, onClose, onSave, onDelete }) {

    const [bankName, setBankName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [balance, setBalance] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && account) {
            setBankName(account.bankName);
            setAccountType(account.accountType);
            setAccountNumber(account.accountNumber);
            setBalance(account.balance);
            setError('');
        }
    }, [isOpen, account]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await onSave(account.id, { bankName, accountType, accountNumber, balance });
            onClose();
        } catch (error) {
            setError("Error");
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            await onDelete(account.id);
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
                    <h1 className="text-xl font-roboto font-bold">
                        {account.id ? 'Edit account' : 'Create an account'}
                    </h1>
                    <button type="button"
                            className="text-gray-400 bg-transparent rounded-lg text-lg p-1.5 ml-auto inline-flex items-center"
                            onClick={onClose}>
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Account
                                Name</label>
                            <input type="text"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter account name" value={bankName}
                                   onChange={e => setBankName(e.target.value)}
                                   required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Account
                                Type</label>
                            <input type="text"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter account type" value={accountType}
                                   onChange={e => setAccountType(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Account
                                Number</label>
                            <input type="text"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter account type" value={accountNumber}
                                   onChange={e => setAccountNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Balance
                            </label>
                            <input type="number"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter account balance" value={balance}
                                   onChange={e => setBalance(e.target.value)}
                                   required/>
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
                            {account.id ? 'Save Changes' : 'Create Account'}
                        </button>
                        {account.id &&
                            <button type="button"
                                className="w-1/2 bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                onClick={handleDelete}>
                            Delete Account
                        </button>}
                    </div>
                </form>
            </div>
        </div>
        // <div className="wallet-modal">
        //     <div className="wallet-modal-content">
        //         <span className="wallet-modal-close" onClick={onClose}>&times;</span>
        //         <h2>{account.id ? 'Edit Account' : 'Add New Account'}</h2>
        //         <form onSubmit={handleSubmit}>
        //             <div className="wallet-modal-input-box">
        //                 <label className="wallet-modal-label">Account name</label>
        //                 <input className="wallet-modal-input" type="text" value={bankName}
        //                        onChange={e => setBankName(e.target.value)} required></input>
        //             </div>
        //             <div className="wallet-modal-input-box">
        //                 <label className="wallet-modal-label">Account type</label>
        //                 <input className="wallet-modal-input" type="text" value={accountType}
        //                        onChange={e => setAccountType(e.target.value)}></input>
        //             </div>
        //             <div className="wallet-modal-input-box">
        //                 <label className="wallet-modal-label">Account number</label>
        //                 <input className="wallet-modal-input" type="text" value={accountNumber}
        //                        onChange={e => setAccountNumber(e.target.value)}></input>
        //             </div>
        //             <div className="wallet-modal-input-box">
        //                 <label className="wallet-modal-label">Balance</label>
        //                 <input className="wallet-modal-input" type="text" value={balance}
        //                        onChange={e => setBalance(e.target.value)} required></input>
        //             </div>
        //             <div className="wallet-modal-input-box">
        //                 <button className="wallet-modal-submit-button" type="submit" >{account.id ? 'Save Changes' : 'Create Account'}</button>
        //             </div>
        //             {error &&
        //                 <div className="wallet-modal-input-box">
        //                     <p className="wallet-modal-error">{error}</p>
        //                 </div>}
        //         </form>
        //     </div>
        // </div>
    );
}

export default AccountModal;


// import React, {useEffect, useState} from 'react';
// import "./AccountModal.css";
//
// function AccountModal({ account, isOpen, onClose, onSave }) {
//
//     const [bankName, setBankName] = useState('');
//     const [accountType, setAccountType] = useState('');
//     const [accountNumber, setAccountNumber] = useState('');
//     const [balance, setBalance] = useState('');
//
//     useEffect(() => {
//         if (isOpen && account) {
//             setBankName(account.bankName);
//             setAccountType(account.accountType);
//             setAccountNumber(account.accountNumber);
//             setBalance(account.balance);
//         }
//     }, [isOpen, account]);
//
//     const handleSave = () => {
//         onSave(account.id, { bankName, accountType, accountNumber, balance });
//         onClose();
//     };
//
//     if(!isOpen) return null;
//
//     return (
//         <div className="wallet-modal">
//             <div className="wallet-modal-content">
//                 <span className="wallet-modal-close" onClick={onClose}>&times;</span>
//                 <h2>{account.id ? 'Edit Account' : 'Add New Account'}</h2>
//                 <div className="wallet-modal-info">
//                     <div className="wallet-modal-column">
//                         <span className="wallet-modal-label">Account name</span>
//                         <span className="wallet-modal-label">Account type</span>
//                         <span className="wallet-modal-label">Account number</span>
//                         <span className="wallet-modal-label">Balance</span>
//                     </div>
//                     <div className="wallet-modal-column">
//                         <input className="wallet-modal-input" type="text" value={bankName} onChange={e => setBankName(e.target.value)} required/>
//                         <input className="wallet-modal-input" type="text" value={accountType} onChange={e => setAccountType(e.target.value)}/>
//                         <input className="wallet-modal-input" type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)}/>
//                         <input className="wallet-modal-input" type="text" value={balance} onChange={e => setBalance(e.target.value)} required/>
//                     </div>
//                 </div>
//                 <button onClick={handleSave}>{account.id ? 'Save Changes' : 'Create Account'}</button>
//             </div>
//         </div>
//     );
// }
//
// export default AccountModal;