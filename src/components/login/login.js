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
      const user = this.props.user;
      return (
        <div id="login_screen" className={"container "+ styles.content_center}>
            <h2 className="text-white">Event planner</h2>       
            <LoginForm 
              user={user} 
              onLoginScreenInput={this.props.onLoginScreenInput}
            />

        </div>
      );
    }
  }

  export {LoginScreen}