import React, {useState} from "react";
import "./SignUp.css";
import {useNavigate} from "react-router-dom";
import ParticlesBackground from "../Homepage/ParticlesBackground";

export default function SignUp() {

    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    async function handleSubmit(e){
        e.preventDefault();
        const userData = {firstName: firstName, lastName: lastName, email: email, password: password, role: "USER"};
        const requestBody = JSON.stringify(userData);
        console.log(userData);
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/register`, {
                // credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: requestBody
            });
            if(response.ok) {
                console.log("User registered.");
                navigate("/login");
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
            <nav className="bg-color-3 w-full z-20">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                    <a href="/"
                       className="text-lg font-roboto font-bold hover:font-extrabold text-color-4 whitespace-nowrap w-full">
                        {/*<span className="self-center text-2xl font-bebas-neue font-normal hover:font-bold whitespace-nowrap text-color-4">TREASURY HUB</span>*/}
                        TREASURY HUB
                    </a>
                </div>
            </nav>
            {/*flex-grow pune formularul pe mijlocul paginii*/}
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-8 mx-auto max-h-screen-xl w-full bg-color-1">
                <div className="w-full rounded-lg shadow max-w-md bg-color-3 z-10">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold font-roboto leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Create an account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="firstName"
                                       className="block mb-2 text-sm font-medium text-gray-900">First name
                                </label>
                                <input type="text" name="firstName" id="firstName"
                                       className="border border-color-4 text-sm rounded-lg block w-full p-2.5"
                                       placeholder="Enter your first name" required onChange={handleFirstName}/>
                            </div>
                            <div>
                                <label htmlFor="lastName"
                                       className="block mb-2 text-sm font-medium text-gray-900">Last name
                                </label>
                                <input type="text" name="lastName" id="lastName"
                                       className="border border-color-4 text-sm rounded-lg block w-full p-2.5"
                                       placeholder="Enter your last name" required onChange={handleLastName}/>
                            </div>
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900">Your
                                    email</label>
                                <input type="email" name="email" id="email"
                                       className="border border-color-4 text-sm rounded-lg block w-full p-2.5"
                                       placeholder="Enter your email" required onChange={handleEmail}/>
                            </div>
                            <div>
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                       className="border border-color-4 text-sm rounded-lg block w-full p-2.5"
                                       required="" onChange={handlePassword}/>
                            </div>
                            <div className="flex justify-center">
                                <div className="text-sm">
                                    <label
                                        className="font-bold">{error ? error : ""}</label>
                                </div>
                            </div>
                            <button type="submit"
                                    className="w-full text-primary-6 bg-white hover:bg-color-1 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create
                                an account
                            </button>
                            <p className="text-sm text-gray-500">
                                Already have an account? <a href="/login"
                                                            className="font-medium text-primary-600 hover:underline">Login
                                here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}