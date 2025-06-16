import React from "react";

export default function Footer() {
    return (
        <footer className="bg-color-3 w-full py-2 flex justify-center items-center z-20">
            <span className="text-xs text-color-4">
                2025 Treasury Hub. All rights reserved. &nbsp;
                <a href="/tc" className="underline hover:text-white">Terms & Conditions</a>
                {" | "}
                <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>
            </span>
        </footer>
    );
}
