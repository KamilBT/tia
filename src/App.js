import React from 'react';
//import logo from './logo.svg';
import './App.css';

//vytorene komponenty
import {LoginScreen} from './components/login/login.js';
import {UserScreen} from './components/user/user.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    //handle login input state
    this.onLoginScreenInput = this.onLoginScreenInput.bind(this);
    this.state = {
      user: {
        name: ''
      },
    };
  }

  onLoginScreenInput(e){
    console.log(e.name + ": "+ e.value);
    this.setState(prevState => ({
      user: {                   // object that we want to update
          ...prevState.user,    // keep all other key-value pairs
          [e.name]: e.value       // update the value of specific key
      }
    }))
  }

  render(){
    //sharing user name across components
    const user = this.state.user;
    return (
      <div className="App container-fluid bg-dark" style={{height:'100vh',overflowX:'hidden'}}>
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
        <LoginScreen 
          user={user}
          onLoginScreenInput={this.onLoginScreenInput} 
        />
        <div className="row">
          <UserScreen 
            user={user}          
          />
        </div>     
      </div>
    );
   }
}

export default App;
