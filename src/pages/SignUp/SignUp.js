import React, {useState} from "react";

export default function SignUp() {

    const URL = "https://treasury-hub-backend-162bca8c9d0c.herokuapp.com"
    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const [error, setError] = useState("");

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {firstName: firstName, lastName: lastName, email: email, password: password};
        const requestBody = JSON.stringify(userData);
        fetch(`${URL}/register`, {
            // credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: requestBody
        }).then((response) => {
            console.log(response);
        })
    };

    return (
        <div className="main">
            <form>
            <input
                type="text"
                placeholder={"Enter your first name"}
                required
                onChange={handleFirstName}
            ></input>
            <input
                type="text"
                placeholder={"Enter your last name"}
                required
                onChange={handleLastName}
            ></input>
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
                value="Register"
                onClick={handleSubmit}
            ></input>
            </form>
        </div>
    );
}