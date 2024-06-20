import React, { useState, useEffect } from 'react';
import ParticlesBackground from "../Homepage/ParticlesBackground";
import Navbar from "../Navbar/Navbar";

const Investments = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm.length < 3) {
            setResults([]);
            return;
        }

        setIsLoading(true);

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_PROD}/stock/${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.error('Error fetching data');
                setIsLoading(false);
                return;
            }
            const data = await response.json();
            setResults(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-screen bg-color-1 flex flex-col">
            <ParticlesBackground/>
            <Navbar/>
            <div className="flex-grow items-center justify-center mt-6 mx-auto max-w-screen-md w-full bg-color-1 z-10">
                <input
                    type="search"
                    value={query}
                    onChange={handleSearch}
                    className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-color-3"
                    placeholder="Search on the market..."
                />
                {isLoading && <p className="mt-2 text-blue-500">Loading...</p>}
                <ul className="mt-4">
                    {results.map((item) => (
                        <li key={item.id} className="p-2 border-b rounded-lg border-color-4 bg-white hover:bg-color-1">
                            <div className="flex flex-row justify-between">
                                <p className="content-center">{item.symbol} - {item.name}</p>
                                <p className="rounded-full bg-color-4 text-white p-1">{item.exchangeShortName}</p>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>


    );
};

export default Investments;
