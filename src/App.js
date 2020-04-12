import React from 'react';
//import logo from './logo.svg';
import './App.css';

//vytorene komponenty
import {LoginScreen} from './components/login/login.js';

function App() {
  return (
    <div className="App container-fluid bg-dark" style={{height:'100vh'}}>
      {/*<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        </header>*/}
      <LoginScreen />
    </div>
  );
}

export default App;
