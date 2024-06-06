import "./BudgetModal.css";
import React, {useEffect, useState} from "react";

function BudgetModal({currentBudget, isOpen, onClose, onSave, onDelete}) {

    const [name, setName] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [budget, setBudget] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if(isOpen && currentBudget) {
            setName(currentBudget.name);
            setTransactionType(currentBudget.transactionType);
            setBudget(currentBudget.budget);
            setError('');
        }
    }, [isOpen, currentBudget]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!name || !transactionType || transactionType === "Select a category") setError("You must select a category type");
        else {
            try {
                await onSave(currentBudget.id, {name, transactionType, budget});
                onClose();
            } catch (error) {
                setError("Error");
            }
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            await onDelete(currentBudget.id);
            onClose();
        } catch (error) {
            setError("Error");
        }
    }

    if(!isOpen) return null;

    return (
        <div className="w-full rounded-lg shadow max-w-sm bg-color-3 z-10">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                    <h1 className="text-xl font-roboto font-bold">
                        {currentBudget.id ? 'Edit category' : 'Create a category'}
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
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Account
                                Name</label>
                            <input type="text"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter account name" value={name}
                                   onChange={e => setName(e.target.value)}
                                   required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Category
                                Name</label>
                            <select id="category"
                                    className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                    value={transactionType} onChange={e => setTransactionType(e.target.value)}>
                                <option selected="">Select category</option>
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Balance
                            </label>
                            <input type="number"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter account balance" value={budget}
                                   onChange={e => setBudget(e.target.value)}
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
                            {currentBudget.id ? 'Save Changes' : 'Create Category'}
                        </button>
                        {currentBudget.id &&
                            <button type="button"
                                    className="w-1/2 bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    onClick={handleDelete}>
                                Delete Category
                            </button>}
                    </div>
                </form>
            </div>
        </div>
        // <div className="budget-modal">
        //     <div className="budget-modal-content">
        //         <span className="budget-modal-close" onClick={onClose}>&times;</span>
        //         <h2>{currentBudget.id ? 'Edit Category' : 'Add New Category'}</h2>
        //         <form onSubmit={handleSubmit}>
        //             <div className="budget-modal-input-box">
        //                 <label className="budget-modal-label">Name</label>
        //                 <input className="budget-modal-input" type="text" value={name}
        //                        onChange={e => setName(e.target.value)} required></input>
        //             </div>
        //             <div className="budget-modal-input-box">
        //                 <label className="budget-modal-label">Transaction type</label>
        //                 <select className="budget-modal-select" value={transactionType}
        //                         onChange={e => setTransactionType(e.target.value)}>
        //                     <option className="budget-modal-option" value="Select a category">Select a category</option>
        //                     <option className="budget-modal-option" value="INCOME">Income</option>
        //                     <option className="budget-modal-option" value="EXPENSE">Expense</option>
        //                 </select>
        //             </div>
        //             <div className="budget-modal-input-box">
        //                 <label className="budget-modal-label">Budget</label>
        //                 <input className="budget-modal-input" type="text" value={budget}
        //                        onChange={e => setBudget(e.target.value)}></input>
        //             </div>
        //             <div className="budget-modal-input-box">
        //                 <button className="budget-modal-submit-button" type="submit" >{currentBudget.id ? 'Save Changes' : 'Create Category'}</button>
        //             </div>
        //             {error &&
        //                 <div className="budget-modal-input-box">
        //                     <p className="budget-modal-error">{error}</p>
        //                 </div>}
        //         </form>
        //     </div>
        // </div>
    )
}

export default BudgetModal;


// import "./BudgetModal.css";
// import React, {useEffect, useState} from "react";
//
// function BudgetModal({currentBudget, isOpen, onClose, onSave}) {
//
//     const [name, setName] = useState('');
//     const [transactionType, setTransactionType] = useState('');
//     const [budget, setBudget] = useState('');
//     const [error, setError] = useState('');
//
//     useEffect(() => {
//         if(isOpen && currentBudget) {
//             setName(currentBudget.name);
//             setTransactionType(currentBudget.transactionType);
//             setBudget(currentBudget.budget);
//         }
//     }, [isOpen, currentBudget]);
//
//     const handleSave = () => {
//         if(!name || !transactionType || transactionType === "Select a category") setError()
//         onSave(currentBudget.id, {name, transactionType, budget});
//         onClose();
//     };
//
//     if(!isOpen) return null;
//
//     return (
//         <div className="budget-modal">
//             <div className="budget-modal-content">
//                 <span className="budget-modal-close" onClick={onClose}>&times;</span>
//                 <h2>{currentBudget.id ? 'Edit Category' : 'Add New Category'}</h2>
//                 <div className="budget-modal-info">
//                     <div className="budget-modal-column">
//                         <span className="budget-modal-label">Name</span>
//                         <span className="budget-modal-label">Transaction type</span>
//                         <span className="budget-modal-label">Budget</span>
//                     </div>
//                     <div className="budget-modal-column">
//                         <input className="budget-modal-input" type="text" value={name}
//                                onChange={e => setName(e.target.value)} required/>
//                         <select className="budget-modal-select" value={transactionType} onChange={e => setTransactionType(e.target.value)}>
//                             <option className="budget-modal-option" value="Select a category">Select a category</option>
//                             <option className="budget-modal-option" value="INCOME">INCOME</option>
//                             <option className="budget-modal-option" value="EXPENSE">EXPENSE</option>
//                         </select>
//                         <input className="budget-modal-input" type="text" value={budget}
//                                onChange={e => setBudget(e.target.value)} required/>
//                     </div>
//                     {error &&  <p className="budget-modal-error">{error}</p>}
//                 </div>
//                 <button onClick={handleSave}>{currentBudget.id ? 'Save Changes' : 'Create Category'}</button>
//             </div>
//         </div>
//     )
// }
//
// export default BudgetModal;