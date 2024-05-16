import React, {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import logo from "../../resources/logo.png"
import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <header className="navbar-header">
            {/*<img src={logo} className="navbar-logo" height="100" onClick={() => navigate("/")}></img>*/}
            <nav className="navbar-nav">
                <NavLink to="/" className="navbar-logo">Treasury Hub</NavLink>

                <div className="navbar-menu">
                    <ul className="navbar-list">
                        <NavbarItem to="/dashboard" text="Dashboard">Dashboard</NavbarItem>
                        <NavbarItem to="/transactions" text="Transactions">Dashboard</NavbarItem>
                        <NavbarItem to="/budgets" text="Budgets">Dashboard</NavbarItem>
                        <NavbarItem to="/wallet" text="Wallet">Dashboard</NavbarItem>
                        <NavbarItem to="/investments" text="Investments">Dashboard</NavbarItem>
                        <NavbarItem to="/profile" text="Profile">Dashboard</NavbarItem>
                    </ul>
                </div>
            </nav>

        </header>
    )
}

function NavbarItem(props){
    return (
        <li className="navbar-item">
            <NavLink to={props.to} className="navbar-link">{props.text}</NavLink>
        </li>
    );
}