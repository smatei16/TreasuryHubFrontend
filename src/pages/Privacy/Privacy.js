import React from "react";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import Footer from "../../components/Footer";

const privacySections = [
    {
        title: "1. Introduction",
        content: "This Privacy Policy explains how TreasuryHub collects, uses, discloses, and protects your information when you use our platform. By accessing TreasuryHub, you consent to the practices described in this policy."
    },
    {
        title: "2. Information We Collect",
        content: (
            <ul className="list-disc ml-5">
                <li><b>Personal Information:</b> Name, email address, password, and role when you register.</li>
                <li><b>Financial Data:</b> Transaction details, account balances, and documents you upload.</li>
                <li><b>Usage Data:</b> Pages visited, features used, and actions taken on the platform.</li>
                <li><b>Device & Technical Data:</b> IP address, browser type, device information, and cookies.</li>
            </ul>
        )
    },
    {
        title: "3. How We Use Your Information",
        content: (
            <ul className="list-disc ml-5">
                <li>To provide and maintain TreasuryHub services.</li>
                <li>To personalize your experience and improve our platform.</li>
                <li>To communicate with you about updates, security, and support.</li>
                <li>To analyze usage and trends for platform improvement.</li>
                <li>To comply with legal obligations and protect against fraud.</li>
            </ul>
        )
    },
    {
        title: "4. Data Sharing and Disclosure",
        content: "We do not sell your personal information. We may share data with trusted service providers who assist in operating TreasuryHub, subject to confidentiality agreements. Data may be disclosed if required by law or to protect the rights and safety of TreasuryHub and its users."
    },
    {
        title: "5. Data Security",
        content: "We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure."
    },
    {
        title: "6. Data Retention",
        content: "We retain your information as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements."
    },
    {
        title: "7. Your Rights",
        content: (
            <ul className="list-disc ml-5">
                <li>Access, update, or delete your personal information.</li>
                <li>Object to or restrict certain processing of your data.</li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>Contact us at support@treasuryhub.com for any privacy-related requests.</li>
            </ul>
        )
    },
    {
        title: "8. Changes to This Policy",
        content: "We may update this Privacy Policy from time to time. Changes will be posted on this page, and your continued use of TreasuryHub constitutes acceptance of the updated policy."
    }
];

export default function Privacy() {
    return (
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground/>
            <nav className="bg-color-3 w-full z-20">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                    <a href="/"
                       className="text-lg font-roboto font-bold hover:font-extrabold text-color-4 whitespace-nowrap w-full">
                        TREASURY HUB
                    </a>
                </div>
            </nav>
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-8 mx-auto max-h-screen-xl w-full bg-color-1">
                <div className="w-full rounded-lg shadow max-w-md bg-color-3 z-10">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 max-h-[70vh] overflow-y-auto">
                        <h1 className="text-xl font-bold font-roboto leading-tight tracking-tight text-gray-900 md:text-2xl mb-4">
                            Privacy Policy
                        </h1>
                        {privacySections.map((section, idx) => (
                            <div key={idx} className="mb-4">
                                <h2 className="text-lg font-semibold text-color-4 mb-1">{section.title}</h2>
                                <div className="text-sm text-gray-700">{section.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
