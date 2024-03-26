import logo from './logo.svg';
import './App.css';
import {useEffect} from "react";

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );

    useEffect(() => {
        fetch("https://treasury-hub-backend-162bca8c9d0c.herokuapp.com/test/getAll", {method: "GET"})
            .then((body) => body.json())
            .then((json) => console.log(json))
    }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src="https://media1.tenor.com/m/HpbQmYr2CpwAAAAC/salty-salt-bae.gif" className="App-logo" alt="logo" />
        <p>
          Tocmai ai loat țeapă
        </p>
      </header>
    </div>
  );
}

export default App;
