import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
//import {UserMenu} from './UserMenu.js';
import {Shared} from '../shared.js';


let shared = new Shared();

class SettingsScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
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
    }

    render() {
      //console.log(this.props);
      return (
        <div id="settings_screen" className={['container', 'py-5', styles.screen, styles.hidden].join(' ')}>
            

        </div>
      );
    }
  }

  export {SettingsScreen}