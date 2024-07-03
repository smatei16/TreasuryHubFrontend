import Typewriter from 'typewriter-effect';
import ParticlesBackground from "./ParticlesBackground";
import CurrencyConverter from "../Investment/CurrencyConverter";
import React, {useState} from "react";

function Homepage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

    const openCurrencyModal = () => {
        setIsCurrencyModalOpen(true);
    };

    const closeCurrencyModal = () => {
        setIsCurrencyModalOpen(false);
    };
    return(
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground />
            {/*<nav className="bg-color-3 w-full fixed">*/}
            {/*    /!*add max-w-screen-xl and mx-auto to the div below to move logo and buttons to the margin*!/*/}
            {/*    <div className="flex flex-wrap items-center justify-between mx-4 p-2">*/}
            {/*        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse text-2xl font-roboto font-bold hover:font-extrabold text-color-4 whitespace-nowrap">*/}
            {/*            /!*<span className="self-center text-2xl font-bebas-neue font-normal hover:font-bold whitespace-nowrap text-color-4">TREASURY HUB</span>*!/*/}
            {/*            TREASURY HUB*/}
            {/*        </a>*/}
            {/*        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">*/}
            {/*            <ul className="flex flex-col font-medium space-x-8 rtl:space-x-reverse md:flex-row">*/}
            {/*                <li>*/}
            {/*                    <a href="/login" className="block text-color-4 hover:font-bold font-roboto">Login</a>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <a href="/register" className="block text-color-4 hover:font-bold font-roboto">Register</a>*/}
            {/*                </li>*/}

            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</nav>*/}
            <nav className="bg-color-3 w-full z-20">
                {/*add max-w-screen-xl and mx-auto to the div below to move logo and buttons to the margin*/}
                {/*actual p-2, initial p-4*/}
                <div className="flex flex-wrap items-center justify-between mx-4 p-2">
                    <a href="/"
                       className="flex items-center space-x-3 rtl:space-x-reverse text-2xl font-roboto font-bold hover:font-extrabold text-color-4 whitespace-nowrap">
                        {/*<span className="self-center text-2xl font-bebas-neue font-normal hover:font-bold whitespace-nowrap text-color-4">TREASURY HUB</span>*/}
                        TREASURY HUB
                    </a>
                    <button
                        data-collapse-toggle="navbar-default"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-controls="navbar-default"
                        aria-expanded={isMenuOpen ? "true" : "false"}
                        onClick={toggleMenu}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                    <div
                        className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? "block" : "hidden"}`}
                        id="navbar-user">
                        <ul className="flex flex-col font-medium md:space-x-8 rtl:space-x-reverse md:flex-row">
                            <button className="block text-color-4 hover:font-bold font-roboto"
                                    onClick={openCurrencyModal}>Currency Converter
                            </button>
                            <NavbarItem to="/login" text="Login">Login</NavbarItem>
                            <NavbarItem to="/register" text="Register">Register</NavbarItem>
                        </ul>
                    </div>
                </div>
            </nav>
            {isCurrencyModalOpen && <CurrencyConverter isOpen={isCurrencyModalOpen} onClose={closeCurrencyModal}/>}
            <div className="flex-1 w-full grid place-content-center text-color-4 text-6xl font-roboto font-bold">
                <Typewriter
                    options={{
                        strings: [
                            "Simplify your finances",
                            "Take control of your budget",
                            "Treasury Hub."
                        ],
                        autoStart: true,
                        loop: true,
                        deleteSpeed: 50
                    }}
                />
            </div>
        </div>

)
}

function NavbarItem(props) {
    return (
        // <li className="navbar-item">
        //     <NavLink to={props.to} className="navbar-link">{props.text}</NavLink>
        // </li>
        <li>
            <a href={props.to} className="block text-color-4 hover:font-bold font-roboto">{props.text}</a>
        </li>
    )
        ;
}

export default Homepage;