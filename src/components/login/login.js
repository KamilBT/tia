import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import {LoginForm} from './loginForm.js';

class LoginScreen extends React.Component {

    render() {
      return (
        <div className={"container "+ styles.content_center}>
            <h2 className="text-white">Event planner</h2>       
            <LoginForm/>

        </div>
      );
    }
  }

  export {LoginScreen}