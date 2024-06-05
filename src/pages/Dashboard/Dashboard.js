import React, {useState} from "react";
import Navbar from "../Navbar/Navbar";
import ParticlesBackground from "../Homepage/ParticlesBackground";

export default function Dashboard() {

    return(
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground />
            <Navbar />
        </div>
    )
}