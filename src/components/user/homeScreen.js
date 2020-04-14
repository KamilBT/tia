import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
//import {UserMenu} from './UserMenu.js';
import $ from 'jquery';
import {Shared} from '../shared.js';
import icon_settings from '../../images/settings.svg';


let shared = new Shared();

class HomeScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        //localization
        this.strings ={
            sk:{
                settings: 'Nastavenia'
            },
            en:{
                settings: 'Settings'
            }
        };
        this.lang = shared.getSupportedLang();
    }


    render() {
      console.log(this.props);
      return (

        <div id="homeMenu" className="d-flex">              
        
            <div className="d-flex col-12 col-md-6 py-5 bg-red">
            <button 
                onClick={(e) => this.props.changeScreen('settings', e)} 
                className={styles.menu_btn}
                >
                <div className={["d-flex","p-4","mx-auto",styles.menu_item].join(' ')}>
                <img src={icon_settings} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                <h3 className="pl-3 align-self-center">{this.strings[this.lang].settings}</h3>
                </div>
            </button>
            </div>
            
            

            <div className="d-flex col-12 col-md-6 py-5">
            <div className={["d-flex","p-4","mx-auto",styles.menu_item].join(' ')}>
                <img src={icon_settings} className={"settings " + styles.user_icon} alt="settings" />       
                <h3 className="pl-3 align-self-center">Events</h3>
            </div>
            </div>
        </div>
      );
    }
  }

  export {HomeScreen}