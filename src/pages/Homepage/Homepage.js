import Typewriter from 'typewriter-effect';
import ParticlesBackground from "./ParticlesBackground";

function Homepage() {
    return(
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground />
            <nav className="bg-color-3 w-full fixed">
                {/*add max-w-screen-xl and mx-auto to the div below to move logo and buttons to the margin*/}
                <div className="flex flex-wrap items-center justify-between mx-4 p-2">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse text-2xl font-roboto font-bold hover:font-extrabold text-color-4 whitespace-nowrap">
                        {/*<span className="self-center text-2xl font-bebas-neue font-normal hover:font-bold whitespace-nowrap text-color-4">TREASURY HUB</span>*/}
                        TREASURY HUB
                    </a>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <ul className="flex flex-col font-medium space-x-8 rtl:space-x-reverse md:flex-row">
                            <li>
                                <a href="/login" className="block text-color-4 hover:font-bold font-roboto">Login</a>
                            </li>
                            <li>
                                <a href="/register" className="block text-color-4 hover:font-bold font-roboto">Register</a>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
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

export default Homepage;