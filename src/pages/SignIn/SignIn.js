import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./SignIn.css";

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
        <div className="login-div">
            <div className="login-text">Sign In</div>
            <div className="login-text-underline"></div>
            <div className="login-inputs">
                <div className="login-input">
                    <span className="login-input-name">Email</span>
                    <input className="login-input-input" type="email" placeholder="Enter your email" required
                           onChange={handleEmail}></input>
                </div>
                <div className="login-input">
                    <span className="login-input-name">Password</span>
                    <input className="login-input-input" type="password" placeholder="Enter your password" required
                           onChange={handlePassword}></input>
                </div>
                <div className="login-input">
                    <input className="login-input-submit" type="submit" value="Sign In"
                           onClick={handleSubmit}></input>
                </div>
                {error &&
                    <div className="login-input-error">
                        <p className="login-input-error-message">{error}</p>
                    </div>}
            </div>
        </div>
    );
}