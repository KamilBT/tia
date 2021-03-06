import React from 'react';
import './App.css';
import $ from 'jquery';

//vytorene komponenty
import {LoginScreen} from './components/login/login.js';
import {UserScreen} from './components/user/user.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    //update lang
    this.getSupportedLang = this.getSupportedLang.bind(this);
    //updateName
    this.updateName = this.updateName.bind(this);
    //setLevel
    this.setLevel = this.setLevel.bind(this);
    //set user list
    this.setUserList = this.setUserList.bind(this);
    //set user id
    this.setUserID = this.setUserID.bind(this);
    this.updateUserList = this.updateUserList.bind(this);

    //handle login input state
    this.onLoginScreenInput = this.onLoginScreenInput.bind(this);
    this.state = {
      user: {
        name: '',
        id: '',
        userList: [],
        userListID: [],
        Level: ''
      },
      lang: 'en',
      //baseUrl: 'http://localhost/fmfi/tia/event-planner/public'
      baseUrl: '.'
    };
  }


  //check for supported langs
  getSupportedLang(){
    let lang = navigator.language.substring(0, 2);
    let supported = ['sk', 'en'];
    if(!supported.includes(lang)) lang='en';
    //this.setState({ lang: lang});
    return lang;
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

  //for exmaple from deleteting action
  updateName(name){
    this.setState(prevState => ({
      user: {                   // object that we want to update
          ...prevState.user,    // keep all other key-value pairs
          name: name       // update the value of specific key
      }
    }))
  }

  //for exmaple from deleteting action
  async setLevel(level){
    await this.setState(prevState => ({
      user: {                   // object that we want to update
          ...prevState.user,    // keep all other key-value pairs
          level: level       // update the value of specific key
      }
    }))
  }

  /**
   *  update user list (for creating eevnts, when one needs to choose who will recieve)
   */
  async setUserID(id){
    this.setState(prevState => ({
      user: {                   // object that we want to update
          ...prevState.user,    // keep all other key-value pairs
          id: id       // update the value of specific key
      }
    }))
    //console.log(this.state);
  }

  /**
   *  update user list (for creating eevnts, when one needs to choose who will recieve)
   */
  async setUserList(list, list_id){
    //transform list to value label object for select
    const select_data = [];
    for(let i=0; i<list.length; i++){
      select_data.push({value: list[i], label: list[i], user_id: list_id[i]});
    }
    await this.setState(prevState => ({
      user: {                   // object that we want to update
          ...prevState.user,    // keep all other key-value pairs
          userList: select_data       // update the value of specific key
      }
    }))
    //console.log(this.state);
  }

  /**
   *  update user list (for creating eevnts, when one needs to choose who will recieve)
   */
  async updateUserList(list){
    //transform list to value label object for select
    await this.setState(prevState => ({
      user: {                   
          ...prevState.user,    
          userList: list       
      }
    }));
    $("#delete_check_user").fadeOut();
  }


  render(){
    //sharing user name across components
    const user = this.state.user;
    const lang = this.getSupportedLang();
    const baseUrl = this.state.baseUrl;
    return (
      <div className="App container-fluid bg-dark" style={{height:'100vh',overflowX:'hidden'}}>
        
        <LoginScreen 
          user={user}
          lang={lang}
          baseUrl={baseUrl}
          onLoginScreenInput={this.onLoginScreenInput} 
          setUserList = {this.setUserList}
          setUserID = {this.setUserID}
          setLevel={this.setLevel}
        />
        <div className="row">
          <UserScreen 
            user={user}
            lang={lang}
            baseUrl={baseUrl}
            updateName={this.updateName}
            updateUserList={this.updateUserList}
                  
          />
        </div>     
      </div>
    );
   }
}

export default App;
