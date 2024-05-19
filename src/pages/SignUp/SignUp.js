import React, {useState} from "react";
import "./SignUp.css";
import {useNavigate} from "react-router-dom";

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
        <div className="register-div">
            <div className="register-text">Sign Up</div>
            <div className="register-text-underline"></div>
            <div className="register-inputs">
                <div className="register-input">
                    <span className="register-input-name">First Name</span>
                    <input className="register-input-input" type="text" placeholder="Enter your first name" required
                           onChange={handleFirstName}></input>
                </div>
                <div className="register-input">
                    <span className="register-input-name">Last Name</span>
                    <input className="register-input-input" type="text" placeholder="Enter your last name" required
                           onChange={handleLastName}></input>
                </div>
                <div className="register-input">
                    <span className="register-input-name">Email</span>
                    <input className="register-input-input" type="email" placeholder="Enter your email" required
                           onChange={handleEmail}></input>
                </div>
                <div className="register-input">
                    <span className="register-input-name">Password</span>
                    <input className="register-input-input" type="password" placeholder="Enter your password" required
                           onChange={handlePassword}></input>
                </div>
                <div className="register-input">
                    <input className="register-input-submit" type="submit" value="Sign Up"
                           onClick={handleSubmit}></input>
                </div>
                {error &&
                    <div className="register-input-error">
                        <p className="register-input-error-message">{error}</p>
                    </div>}
            </div>
        </div>
    );
}