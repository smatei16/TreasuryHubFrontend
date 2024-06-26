import Navbar from "../Navbar/Navbar";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import React from "react";
import {useNavigate} from "react-router-dom";

function FeedbackSuccess() {
    const navigate = useNavigate();
    return(
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground />
            <Navbar/>
            <div className="flex-1 w-full grid place-content-center text-color-4 text-6xl font-roboto font-bold">
                <p>Thank you for your feedback!</p>
                <div className="flex gap-4 m-6 justify-center">
                    <button type="button"
                            className="w-1/2 bg-white hover:bg-orange-200 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-lg font-bold font-roboto px-5 py-2.5 text-center"
                            onClick={e => navigate("/dashboard")}>
                        Return to dashboard
                    </button>
                </div>
            </div>
        </div>

    )
}

export default FeedbackSuccess;