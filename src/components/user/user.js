import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
//import {UserMenu} from './UserMenu.js';
import $ from 'jquery';
import {Shared} from '../shared.js';
import {HomeScreen} from './homeScreen.js';
import {SettingsScreen} from './settings.js';


let shared = new Shared();

class UserScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.changeScreen = this.changeScreen.bind(this);
        //localization
        this.strings ={
            sk:{
                welcome: 'Vitaj',
                settings: 'Nastavenia'
            },
            en:{
                welcome: 'Welcome',
                settings: 'Settings'
            }
        };
        this.lang = shared.getSupportedLang();
        this.state = {
          screen: 'home'
        }
    }
    /**
     * function to swap screens
     */
    changeScreen = async function(screen, e) {
      await this.setState({
        screen: screen
      });
      console.log(this.state.screen);
      //TODO jquery switch screen based on value
    }

  
    render() {
      const screen = this.state.screen;
      return (
        <div id="user_screen" className={['container', 'py-5', styles.screen, styles.hidden].join(' ')}>
            <h3 className="text-white">{this.strings[this.lang].welcome + " " +this.props.user.name} </h3>
                           
            <HomeScreen
              sreen = {screen}
              changeScreen={this.changeScreen}
            />
            <SettingsScreen
              sreen = {screen}
              changeScreen={e => this.changeScreen(screen, e)}
            />

        </div>
      );
    }
  }

  export {UserScreen}