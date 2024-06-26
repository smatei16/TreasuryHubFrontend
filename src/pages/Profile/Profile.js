import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import Navbar from "../Navbar/Navbar";
import async from "async";

export default function Profile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [firstName, setFirstName]  = useState('');
    const [lastName, setLastName]  = useState('');
    const [email, setEmail]  = useState("");
    // const [password, setPassword]  = useState("");
    const [currentTs, setCurrentTs] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async() => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.REACT_APP_PROD}/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok) {
                    console.log('Unauthorized');
                }
                const data = await response.json();
                setCurrentUser(data);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
                // setPassword(data.password);
                setCurrentTs(data.create_ts);
            } catch (error) {
                console.error('Error fetching user: ' + error);
            }
        };

        fetchCurrentUser();
    }, []);

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    // const handlePassword = (e) => {
    //     setPassword(e.target.value);
    // }

    async function handleSubmit(e){
        e.preventDefault();
        const userData = {firstName: firstName, lastName: lastName, email: email, role: "USER"};
        const requestBody = JSON.stringify(userData);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/user/${currentUser.id}`, {
                // credentials: 'same-origin',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: requestBody
            });
            if(response.ok) {
                console.log("User updated.");
                setError("User updated successfully!");
            } else {
                const errorData = await response.text();
                setError(errorData);
            }
        } catch (errorMessage) {
            console.error(errorMessage);
        }
    }

    return (
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground/>
            <Navbar/>
            {/*flex-grow pune formularul pe mijlocul paginii*/}
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-8 mx-auto max-h-screen-xl w-full bg-color-1">
                <div className="w-full rounded-lg shadow max-w-md bg-color-3 z-10">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold font-roboto leading-tight tracking-tight text-gray-900 md:text-2xl">
                            {firstName} {lastName}
                        </h1>
                        <p className="font-roboto text-color-4">Member since {currentTs}</p>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="firstName"
                                       className="block mb-2 text-sm font-medium text-gray-900">First name
                                </label>
                                <input type="text" name="firstName" id="firstName"
                                       className="border border-color-4 text-sm rounded-lg block w-full p-2.5"
                                       placeholder="Enter your first name" required value={firstName} onChange={handleFirstName}/>
                            </div>
                            <div>
                                <label htmlFor="lastName"
                                       className="block mb-2 text-sm font-medium text-gray-900">Last name
                                </label>
                                <input type="text" name="lastName" id="lastName"
                                       className="border border-color-4 text-sm rounded-lg block w-full p-2.5"
                                       placeholder="Enter your last name" required value={lastName} onChange={handleLastName}/>
                            </div>
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900">Your
                                    email</label>
                                <input type="email" name="email" id="email"
                                       className="border border-color-4 text-sm rounded-lg block w-full p-2.5"
                                       placeholder="Enter your email" required value={email} onChange={handleEmail}/>
                            </div>
                            {/*<div>*/}
                            {/*    <label htmlFor="password"*/}
                            {/*           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>*/}
                            {/*    <input type="password" name="password" id="password" placeholder="••••••••"*/}
                            {/*           className="border border-color-4 text-sm rounded-lg block w-full p-2.5"*/}
                            {/*           required="" onChange={handlePassword} disabled/>*/}
                            {/*</div>*/}
                            <div className="flex justify-center">
                                <div className="text-sm">
                                    <label
                                        className="font-bold">{error ? error : ""}</label>
                                </div>
                            </div>
                            <button type="submit"
                                    className="w-full text-primary-6 bg-white hover:bg-color-1 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Update account
                            </button>
                            <p className="text-sm text-gray-500">
                                Any thoughts you want to share? <a href="/feedback"
                                                            className="font-medium text-primary-600 hover:underline">Give us feedback!
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}