import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./SignIn.css";
import ParticlesBackground from "../Homepage/ParticlesBackground";

export default function SignUp() {

    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const userData = {email: email, password: password};
        const requestBody = JSON.stringify(userData);
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/login`, {
                // credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: requestBody
            });
            if(response.ok) {
                const data = await response.json();
                const token = data.token;
                console.log(token);
                localStorage.setItem('token', token);
                navigate("/dashboard");
            } else if(response.status === 403) {
                setError("Incorrect email/password");
            } else {
                const errorData = await response.text();
                console.log(errorData);
            }
        } catch (errorMessage) {
            console.error(errorMessage);
        }

        //TODO - update backend to send error message instead of just 403 forbidden
        //TODO - update backend to send loginresponsedto as response
    }

    return (
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground/>
            <nav className="bg-color-3 border-gray-200 w-full z-20">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                    <a href="/"
                       className="text-xl font-roboto font-bold hover:font-extrabold text-color-4 whitespace-nowrap w-full">
                        {/*<span className="self-center text-2xl font-bebas-neue font-normal hover:font-bold whitespace-nowrap text-color-4">TREASURY HUB</span>*/}
                        TREASURY HUB
                    </a>
                </div>
            </nav>
            {/*flex-grow pune formularul pe mijlocul paginii*/}
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-8 mx-auto max-h-screen-xl w-full bg-color-1">
                <div className="w-full rounded-lg shadow max-w-md bg-color-3 z-10">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-lg font-bold font-roboto leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Sign in
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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
                                <div className="ml-3 text-sm">
                                    <label
                                        className="font-bold">{error ? error : ""}</label>
                                </div>
                            </div>
                            <button type="submit"
                                    className="w-full text-primary-6 bg-white hover:bg-color-1 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Sign in to your account
                            </button>
                            <p className="text-sm text-gray-500">
                                Don't have an account? <a href="/register"
                                                            className="font-medium text-primary-600 hover:underline">Register here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}