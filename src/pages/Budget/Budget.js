import React, {useEffect, useState} from "react";
import Navbar from "../Navbar/Navbar";
import "./Budget.css";
import BudgetModal from "./BudgetModal";

function BudgetCard({ budget, onEdit, onDelete }) {
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        onDelete(budget.id);
    }
    return (
        <div className="budget-card" onClick={() => onEdit(budget)}>
            <h3 className="budget-h3">{budget.name}</h3>
            <div className="budget-details">
                <div className="budget-info">
                    <div className="budget-column">
                        <span className="budget-label">Transaction type</span>
                        <span className="budget-label">Budget</span>
                    </div>
                    <div className="budget-column">
                        <span className="budget-value">{budget.transactionType}</span>
                        <span className="budget-value">{budget.budget ? budget.budget : 'Not set'}</span>
                    </div>
                    <div className="budget-column">
                        <button className="budget-delete-button" onClick={handleDeleteClick}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
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
                setBudgets(data);
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
        <div className="budget-container">
            <Navbar/>
            <div className="budget-div">
                {budgets.map(budget => (
                    <BudgetCard key={budget.id} budget={budget} onEdit={setCurrentBudget} onDelete={handleBudgetDelete}/>
                ))}
                <div className="budget-add-button-div">
                    <button className="budget-add-button" onClick={openNewBudgetModal}></button>
                </div>
                <BudgetModal
                    currentBudget={currentBudget}
                    isOpen={!!currentBudget}
                    onClose={() => setCurrentBudget(null)}
                    onSave={handleCategoryUpdate}
                />
            </div>
        </div>
    )
}

export default Budget;