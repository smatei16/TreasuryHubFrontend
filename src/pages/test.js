import React, { useState, useEffect } from 'react';

const SearchBar = () => {
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
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <input
                type="search"
                value={query}
                onChange={handleSearch}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
            />
            {isLoading && <p className="mt-2 text-blue-500">Loading...</p>}
            <ul className="mt-4">
                {results.map((item) => (
                    <li key={item.id} className="p-2 border-b border-gray-300">
                        {item.symbol} - {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
