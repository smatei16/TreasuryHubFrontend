import React, {useEffect, useState} from "react";

function CurrencyConverter({isOpen, onClose}){

    const [currencies, setCurrencies] = useState([]);
    const [fromCurrency, setFromCurrency] = useState('');
    const [toCurrency, setToCurrency] = useState('');
    const [exchangeRate, setExchangeRate] = useState(0);
    const [amount, setAmount] = useState(1);
    const [result, setResult] = useState('');
    const switchCurrencies = ()  => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
    }

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await fetch(`https://v6.exchangerate-api.com/v6/4997e360e3c90c05c69560bc/codes`, {
                    method: 'GET',
                });
                if(!response.ok) {
                    console.error('Response error');
                }
                const data = await response.json();
                const codes = data.supported_codes.map(([code, name]) => ({currency_code: code, currency_name: name}));
                setCurrencies(codes);
            } catch (error) {
                console.error('Fetch error');
            }
        };

        fetchCurrencies();
    }, []);



    useEffect(()  => {
        const fetchExchangeRate = async() => {
            try {
                const response = await fetch(`https://v6.exchangerate-api.com/v6/4997e360e3c90c05c69560bc/pair/${fromCurrency}/${toCurrency}`, {
                    method: 'GET',
                });
                if(!response.ok) {
                    console.error('Response error');
                }
                const data = await response.json();
                const codes = data.conversion_rate;
                console.log(codes);
                setExchangeRate(parseFloat(codes));
            } catch (error) {
                console.error('Fetch error');
            }
        };
        if(fromCurrency && toCurrency) fetchExchangeRate();
    },  [fromCurrency, toCurrency]);



    useEffect(() => {
        setResult((amount * exchangeRate).toFixed(2));
    }, [amount, exchangeRate])

    return (
        <div className="mt-4 flex items-center justify-center z-20">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-color-3  rounded-lg">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                    <h1 className="text-xl font-roboto font-bold">
                        Currency Converter
                    </h1>
                    <button type="button"
                            className="text-gray-400 bg-transparent rounded-lg text-lg p-1.5 ml-auto inline-flex items-center"
                            onClick={onClose}>
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form className="space-y-4 md:space-y-6 bg-color-3">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">From
                            </label>
                            <select
                                className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                value={fromCurrency}
                                onChange={e => setFromCurrency(e.target.value)}
                            >
                                <option value="">Select a currency</option>
                                {currencies.map(x => (
                                    <option value={x.currency_code}>{x.currency_code} - {x.currency_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">To
                            </label>
                            <select
                                className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                value={toCurrency}
                                onChange={e => setToCurrency(e.target.value)}
                            >
                                <option value="">Select a currency</option>
                                {currencies.map(x => (
                                    <option value={x.currency_code}>{x.currency_code} - {x.currency_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Amount</label>
                            <input type="number"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5"
                                   placeholder="Enter amount"
                                   onChange={e => setAmount(parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-roboto text-gray-900">Result
                            </label>
                            <input type="number"
                                   className="border border-color-4 text-sm font-roboto rounded-lg block w-full p-2.5 bg-white"
                                   placeholder="Result amount"
                                   value={result}
                                   // onChange={e => setBalance(e.target.value)}
                                   disabled/>
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4 justify-center">
                        <button type="button"
                                className="w-1/2 bg-color-1 hover:bg-orange-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                onClick={switchCurrencies}>
                            Swap
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CurrencyConverter;