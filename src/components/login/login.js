import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import {LoginForm} from './loginForm.js';

/**
 *  Componet that contains all componets of login screen.
 *  Right now quite useless when screen needs just one form borh for login/register, 
 *  but can be kept for possible future modification
 */
class LoginScreen extends React.Component {

    render() {
      //sharing user name across components
      return (
        <div id="login_screen" className={"container "+ styles.content_center}>
            <h2 className="text-white">Event planner</h2>       
            <LoginForm 
              user={this.props.user} 
              lang={this.props.lang}
              baseUrl={this.props.baseUrl}
              onLoginScreenInput={this.props.onLoginScreenInput}
              setUserList = {this.props.setUserList}
              setUserID = {this.props.setUserID}
              setLevel = {this.props.setLevel}
            />

        </div>
      );
    }
  }

  export {LoginScreen}