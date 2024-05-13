import React, {useState} from "react";

export default function SignUp() {

    const URL = "https://treasury-hub-backend-162bca8c9d0c.herokuapp.com";
    // const URL = "http://localhost:8080";
    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const [error, setError] = useState("");

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {email: email, password: password};
        const requestBody = JSON.stringify(userData);
        fetch(`${URL}/login`, {
            // credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: requestBody
        })
            .then((response) => response.text())
            .then((result) => {
            console.log(result);
        })
    };

    return (
        <div className="main">
            <form>
                <input
                    type="email"
                    placeholder={"Enter your email"}
                    required
                    onChange={handleEmail}
                ></input>
                <input
                    type="password"
                    placeholder={"Enter your password"}
                    required
                    onChange={handlePassword}
                ></input>
                <input
                    type="submit"
                    value="Login"
                    onClick={handleSubmit}
                ></input>
            </form>
        </div>
    );
}