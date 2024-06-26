import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import Navbar from "../Navbar/Navbar";
import async from "async";

export default function Feedback() {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [rating, setRating] = useState(null);
    const [frequency, setFrequency] = useState('');
    const [comment, setComment] =  useState('');

    async function handleSubmit(e){
        e.preventDefault();
        const userData = {rating: rating, frequency: frequency, comment: comment};
        const requestBody = JSON.stringify(userData);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/feedback/save`, {
                // credentials: 'same-origin',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: requestBody
            });
            if(response.ok) {
                console.log("Feedback added.");
                // setError("User updated successfully!");
                navigate("/feedback-success");
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
                            Provide us feedback
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">How would you
                                rate us so far?</label>
                                <select
                                    className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                    value={rating} onChange={e => setRating(parseInt(e.target.value))}>
                                    <option selected=''>Select rating</option>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">How often do you use our platform?
                                </label>
                                <select
                                    className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                    value={rating} onChange={e => setFrequency(e.target.value)}>
                                    <option selected=''>Select frequency</option>
                                    <option value='Daily'>Daily</option>
                                    <option value='Several times a week'>Several times a week</option>
                                    <option value='Once a week'>Once a week</option>
                                    <option value='A few times a month'>A few times a month</option>
                                    <option value='Once a month'>Once a month</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900">What improvements would you
                                like to see on the platform?</label>
                                <textarea rows="4"
                                          className="block p-2.5 w-full text-sm rounded-lg border border-color-4"
                                          placeholder="Write your thoughts here..."
                                          value={comment}
                                          onChange={e => setComment(e.target.value)}></textarea>
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
                                Register your feedback
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}