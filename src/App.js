import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import Navbar from "./pages/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Wallet from "./pages/Wallet/Wallet";
import Budget from "./pages/Budget/Budget";
import Transaction from "./pages/Transaction/Transaction";
import Homepage from "./pages/Homepage/Homepage";
import AccountModal from "./pages/Wallet/AccountModal";
import Test from "./pages/test";
import SearchBar from "./pages/test";
import Investments from "./pages/Investment/Investments";

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
      <Router>
        {/*<Navbar></Navbar>*/}
        <div className="App">
          <Routes>
              <Route path="" element={<Homepage/>}/>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/register" element={<SignUp />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/wallet" element={<Wallet />}  />
              <Route path="/budgets" element={<Budget />}/>
              <Route path="/transactions" element={<Transaction />}/>
              <Route path="/investments"  element={<Investments />}/>
              <Route path="/test" element={<SearchBar />}/>
          </Routes>
        </div>
      </Router>
  );
}

export default App;
