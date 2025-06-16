import React from "react";
import ParticlesBackground from "../Homepage/ParticlesBackground";
import Footer from "../../components/Footer";

const termsSections = [
    {
        title: "1. Acceptance of Terms",
        content: "By accessing or using TreasuryHub, you agree to comply with and be legally bound by these Terms & Conditions. If you do not agree to these terms, you must not use our services. TreasuryHub reserves the right to update or modify these terms at any time, and continued use of the platform constitutes acceptance of any changes."
    },
    {
        title: "2. Description of Service",
        content: "TreasuryHub is a financial management platform offering tools for analytics, reporting, and treasury operations. The platform is intended for business and personal use, providing features such as account management, transaction tracking, and financial insights. TreasuryHub may update, enhance, or discontinue features at its discretion."
    },
    {
        title: "3. Data Collection and User Responsibilities",
        content: "When you register or use TreasuryHub, we collect personal information including your first name, last name, email address, password, and role. We may also collect usage data, device information, IP address and financial data you provide (such as transaction details, account balances, and uploaded documents). You are responsible for providing accurate and up-to-date information, maintaining the confidentiality of your account credentials, and for all activities that occur under your account."
    },
    {
        title: "4. Use of Collected Data & Privacy Policy",
        content: (
            <>
                Collected data is used to provide, maintain, and improve TreasuryHub services, personalize your experience, and ensure platform security. We may use your email to send notifications, updates, or support communications. Data may be aggregated and anonymized for analytics purposes. Please review our&nbsp;
                <a href="/privacy" className="underline text-color-4 hover:text-color-2">Privacy Policy</a>
                &nbsp;for detailed information on how your data is stored, processed, and protected.
            </>
        )
    },
    {
        title: "5. Intellectual Property",
        content: "All content, trademarks, software, and data on TreasuryHub are the property of TreasuryHub or its licensors. You may not copy, modify, distribute, or create derivative works from any part of the platform without explicit written permission. User-generated content remains your property, but by submitting it to TreasuryHub, you grant us a license to use, display, and process it as necessary to provide our services."
    },
    {
        title: "6. Limitation of Liability",
        content: "TreasuryHub is provided 'as is' and without warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, or reliability of any information or service provided. TreasuryHub is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform, including but not limited to data loss or unauthorized access."
    },
    {
        title: "7. Changes to Terms",
        content: "We may revise these Terms & Conditions at any time. Changes will be posted on this page, and your continued use of TreasuryHub after such changes constitutes acceptance of the new terms. It is your responsibility to review the terms periodically."
    },
    {
        title: "8. Contact",
        content: "If you have questions or concerns about these Terms & Conditions or our data practices, please contact us at support@treasuryhub.com. We are committed to addressing your inquiries promptly and transparently."
    }
];

export default function TC() {
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
                            Terms & Conditions
                        </h1>
                        {termsSections.map((section, idx) => (
                            <div key={idx} className="mb-4">
                                <h2 className="text-lg font-semibold text-color-4 mb-1">{section.title}</h2>
                                <p className="text-sm text-gray-700">{section.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}