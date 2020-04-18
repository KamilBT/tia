import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';
import icon_settings from '../../images/settings.svg';
import icon_back from '../../images/back.svg';
import { ChangePass } from './changePass';

class SettingsScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.openPassWindow = this.openPassWindow.bind(this);
        this.deleteCheck = this.deleteCheck.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.hideCheck = this.hideCheck.bind(this);
        //localization
        this.strings ={
            sk:{
                title: 'Nastavenia',
                back: 'Naspäť',
                change: 'Zmena hesla',
                delete: 'Zmaž účet',
                sure: 'Naozaj chete vymazať konto?',
                no: 'Nie',
                yes: 'Áno'
            },
            en:{
                title: 'Settings',
                back: 'Return',
                change: 'Change password',
                delete: 'Delete account',
                sure: 'Are you sure?',
                no: 'No',
                yes: 'Yes'
            }
        };
    }

    /**
     * Open window to change password
     */
    openPassWindow(){
      $("#changePass").fadeIn();
    }

    /**
     * Ajax for deleting account
     */
    deleteCheck(){
      $("#delete_check").fadeIn();
    }

    /**
     * Just fade out for check window
     */
    hideCheck(){
      $("#delete_check").fadeOut();
    }

    /**
     * Ajax for deleteing account
     */
    deleteAccount(){
      console.log("deleting account: " + this.props.user.name);
      let check = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      $.ajax({
        type: 'post',
        url: this.props.baseUrl+'/backend/deleteAcc.php',
        data: {name:this.props.user.name, action:'deleteUsr', check:check},
        props: this.props,
        success: function (response) {
            console.log(JSON.parse(response));
            $("#delete_check").fadeOut();
            $("#settings_screen").fadeOut();
            $("#user_screen").fadeOut();
            $("#login_screen").fadeIn().animate({left: '0', opacity: '1'}, 500);
            this.props.updateName("");                                                
        }
      });

    }

    render() {
      //console.log(this.props);
      return (
        
        <div id="settings_screen" className={[styles.screen, styles.hidden].join(' ')}>
            <h2 className="text-white">{this.strings[this.props.lang].title}</h2>
                  
            <div 
              id="delete_check" 
              className={['position-absolute', 'p-3', 'bg-dark', styles.content_center, styles.style_white, styles.hidden].join(' ')} 
              style={{zIndex:'5'}}
              >
              <h3>{this.strings[this.props.lang].sure}</h3>
              <div className="d-flex">
                  <div className="col-6 form-group">					
                      <button type="submit" className={"btn align-self-end px-5 submit " +styles.log_screen}
                          onClick={ this.hideCheck}
                      >{this.strings[this.props.lang].no}</button>
                  </div>
                  <div className="col-6 form-group">					
                      <button className={"btn align-self-end px-5 " +styles.log_screen}
                          onClick={ this.deleteAccount}
                      >{this.strings[this.props.lang].yes}</button>
                  </div>
              </div>
            </div>
            
            <ChangePass
              user={this.props.user} 
              lang={this.props.lang}
              baseUrl={this.props.baseUrl}
            />

            <div className="container">
                    <div className="row w-100">
                    <div className="d-flex col-12 py-2 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('home_sett', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","mx-auto","text-white"].join(' ')}>
                        <img src={icon_back} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].back}</h3>
                        </div>
                    </button>
                    </div>
                  
                    <div className="d-flex col-12 py-2 bg-red">
                    <button 
                        onClick={this.openPassWindow} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","p-4","mx-auto",styles.menu_item].join(' ')}>
                        <img src={icon_settings} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].change}</h3>
                        </div>
                    </button>
                    </div>

                    <div className="d-flex col-12 py-2 bg-red">
                    <button 
                        //onClick={(e) => this.openPassWindow()} 
                        onClick={this.deleteCheck} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","p-4","mx-auto",styles.menu_item].join(' ')}>
                        <img src={icon_settings} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].delete}</h3>
                        </div>
                    </button>
                    </div>
                </div>
            </div>
        </div>

      );
    }
  }

  export {SettingsScreen}