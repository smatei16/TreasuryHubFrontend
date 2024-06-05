import React, {useEffect, useState} from "react";
import Navbar from "../Navbar/Navbar";
import "./Budget.css";
import BudgetModal from "./BudgetModal";
import {MdAccountBalance} from "react-icons/md";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import {TbCategory, TbCategoryMinus, TbCategoryPlus} from "react-icons/tb";

function BudgetCard({ currentBudget, onEdit, onDelete }) {
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        onDelete(currentBudget.id);
    }
    return (
        // <div className="budget-card" onClick={() => onEdit(budget)}>
        //     <h3 className="budget-h3">{budget.name}</h3>
        //     <div className="budget-details">
        //         <div className="budget-info">
        //             <div className="budget-column">
        //                 <span className="budget-label">Transaction type</span>
        //                 <span className="budget-label">Budget</span>
        //             </div>
        //             <div className="budget-column">
        //                 <span className="budget-value">{budget.transactionType}</span>
        //                 <span className="budget-value">{budget.budget ? budget.budget : 'Not set'}</span>
        //             </div>
        //             <div className="budget-column">
        //                 <button className="budget-delete-button" onClick={handleDeleteClick}>Delete</button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <li className="py-3 sm:py-4 rounded-lg hover:bg-color-1" onClick={() => onEdit(currentBudget)}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {currentBudget.transactionType === 'INCOME' ? <TbCategoryPlus className="w-8 h-8 rounded-full"/> : <TbCategoryMinus className="w-8 h-8 rounded-full"/>}

                </div>
                <div className="flex-1 min-w-0 ms-4">
                    <p className="font-semibold text-gray-900 truncate">
                        {currentBudget.name}
                    </p>
                    {/*<p className="text-sm text-gray-500 truncate">*/}
                    {/*    {budget.transactionType}*/}
                    {/*</p>*/}
                </div>
                <div className="flex-1 min-w-0 ms-4">
                    <p className="text-md font-medium truncate">
                        {currentBudget.budget ? currentBudget.budget : 'Not set'}
                    </p>
                </div>
            </div>
        </li>
    )
}

async function fetchCategoryUpdate(id, updatedCategory) {
    const token = localStorage.getItem('token');
    const data = {
        name: updatedCategory.name,
        transactionType: updatedCategory.transactionType,
        budget: updatedCategory.budget
    };
    const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/category/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error('Failed to update the category');
    }

    return await response.json();
}

async function fetchCategoryCreate(newCategory) {
    const token = localStorage.getItem('token');
    console.log(newCategory);
    const data = {name: newCategory.name, transactionType: newCategory.transactionType, budget: newCategory.budget};
    const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/category/save`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error('Failed to update the category');
    }

    return await response.json();
}
function Budget() {
    const [budgets, setBudgets] = useState([]);
    const [currentBudget, setCurrentBudget] = useState(null);

    useEffect(() => {

        const fetchBudgets = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/category/user`, {
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
                const sortedData = data.sort((budget1, budget2) => budget1.transactionType > budget2.transactionType ? -1 : 1)
                setBudgets(sortedData);
            } catch (error) {
                console.error('Fetch error');
            }
        };

        fetchBudgets();
    }, []);

    const handleCategoryUpdate = async (id, updatedCategory) => {
        try {
            if (id) {
                const updated = await fetchCategoryUpdate(id, updatedCategory);
                setBudgets(budgets.map(budget => budget.id === id ? { ...budget, ...updated } : budget));
            } else {
                const newBudget = await fetchCategoryCreate(updatedCategory);
                setBudgets([...budgets, newBudget]);
            }
        } catch (error) {
            console.error('Error processing account update:', error);
        }
    };

    const handleBudgetDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/transaction/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(!response.ok) {
                console.error('Failed to delete the budget');
            }

            setBudgets(budgets.filter(budget => budget.id !== id));
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const openNewBudgetModal = () => {
        setCurrentBudget({name: '', transactionType: '', budget: ''});
    }

    return (
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground/>
            <Navbar/>
            <div
                className="flex-grow flex flex-col items-center justify-center px-6 py-8 mx-auto max-h-screen-xl w-full bg-color-1">
                {!currentBudget &&
                    <div className="w-full max-w-screen-sm p-4 bg-white border rounded-lg shadow z-10">
                        <div className="flex items-center justify-between">
                            <h5 className="text-xl font-bold font-roboto leading-none text-gray-900">Categories</h5>
                            {/*<a href="#" className="text-sm font-medium text-blue-600 hover:underline">*/}
                            {/*    View all*/}
                            {/*</a>*/}
                            <button className="font-roboto hover:font-bold" onClick={openNewBudgetModal}>+ Add
                                category
                            </button>
                        </div>
                        <div className="flow-root">
                            <ul role="list" className="divide-y">

                                <li className="py-3 sm:py-4 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <TbCategory className="w-8 h-8 rounded-full"/>
                                        </div>
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="font-bold font-roboto text-xl truncate">
                                                Category
                                            </p>
                                        </div>
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="font-bold font-roboto text-xl truncate">
                                                Budget
                                            </p>
                                        </div>
                                    </div>
                                </li>

                                {budgets.map(selectedBudget => (
                                    <BudgetCard key={selectedBudget.id} currentBudget={selectedBudget} onEdit={setCurrentBudget}
                                                onDelete={handleBudgetDelete}/>
                                ))}
                                {budgets.length === 0 &&
                                    <p className="truncate font-roboto">No categories added</p>}
                            </ul>
                        </div>
                    </div>
                }
                <BudgetModal
                    currentBudget={currentBudget}
                    isOpen={!!currentBudget}
                    onClose={() => setCurrentBudget(null)}
                    onSave={handleCategoryUpdate}
                    onDelete={handleBudgetDelete}
                />
            </div>
        </div>

        // <div className="budget-container">
        //     <Navbar/>
        //     <div className="budget-div">
        //         {budgets.map(budget => (
        //             <BudgetCard key={budget.id} budget={budget} onEdit={setCurrentBudget} onDelete={handleBudgetDelete}/>
        //         ))}
        //         <div className="budget-add-button-div">
        //             <button className="budget-add-button" onClick={openNewBudgetModal}></button>
        //         </div>
        //         <BudgetModal
        //             currentBudget={currentBudget}
        //             isOpen={!!currentBudget}
        //             onClose={() => setCurrentBudget(null)}
        //             onSave={handleCategoryUpdate}
        //         />
        //     </div>
        // </div>
    )
}

export default Budget;