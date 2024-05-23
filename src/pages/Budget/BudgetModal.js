import "./BudgetModal.css";
import React, {useEffect, useState} from "react";

function BudgetModal({currentBudget, isOpen, onClose, onSave}) {

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

    if(!isOpen) return null;

    return (
        <div className="budget-modal">
            <div className="budget-modal-content">
                <span className="budget-modal-close" onClick={onClose}>&times;</span>
                <h2>{currentBudget.id ? 'Edit Category' : 'Add New Category'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="budget-modal-input-box">
                        <label className="budget-modal-label">Name</label>
                        <input className="budget-modal-input" type="text" value={name}
                               onChange={e => setName(e.target.value)} required></input>
                    </div>
                    <div className="budget-modal-input-box">
                        <label className="budget-modal-label">Transaction type</label>
                        <select className="budget-modal-select" value={transactionType}
                                onChange={e => setTransactionType(e.target.value)}>
                            <option className="budget-modal-option" value="Select a category">Select a category</option>
                            <option className="budget-modal-option" value="INCOME">Income</option>
                            <option className="budget-modal-option" value="EXPENSE">Expense</option>
                        </select>
                    </div>
                    <div className="budget-modal-input-box">
                        <label className="budget-modal-label">Budget</label>
                        <input className="budget-modal-input" type="text" value={budget}
                               onChange={e => setBudget(e.target.value)}></input>
                    </div>
                    <div className="budget-modal-input-box">
                        <button className="budget-modal-submit-button" type="submit" >{currentBudget.id ? 'Save Changes' : 'Create Category'}</button>
                    </div>
                    {error &&
                        <div className="budget-modal-input-box">
                            <p className="budget-modal-error">{error}</p>
                        </div>}
                </form>
            </div>
        </div>
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