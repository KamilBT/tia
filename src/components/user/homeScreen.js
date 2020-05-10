import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import icon_settings from '../../images/settings.svg';
import icon_create from '../../images/create_new.svg';
import icon_manage_created from '../../images/created.svg';
import icon_manage_recieved from '../../images/message.svg';

class HomeScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        //localization
        this.strings ={
            sk:{
                title: 'Domov',
                settings: 'Nastavenia',
                events: 'Eventy',
                create_events: 'Vytvor event',
                created_events: 'Manažment vytvorených eventov',
                recieved_events: 'Prijaté eventy',
                admin: 'Spravovanie používateľov'
            },
            en:{
                title: 'Home',
                settings: 'Settings',
                events: 'Events',
                create_events: 'Create Events',
                created_events: 'Manage created events',
                recieved_events: 'Recieved Events',
                admin: 'Manage users'
            }
        };
    }


    render() {
      //console.log(this.props);
      return (
 
        <div id="homeMenu" className={styles.screen} style={{display:'block'}}> 
            <h2 className="text-white">{this.strings[this.props.lang].title}</h2>             
            <div className="container">
                <div className="row w-100">
                    <div className="d-flex col-12 col-md-6 py-5 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('create_ev', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","p-4","mx-auto",styles.menu_item].join(' ')}>
                        <img src={icon_create} className={["settings", styles.user_icon, styles.pulse].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].create_events}</h3>
                       
                        </div>
                    </button>
                    </div>

                    <div className="d-flex col-12 col-md-6 py-5 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('manage_recieved', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","p-4","mx-auto",styles.menu_item].join(' ')}>
                        <img src={icon_manage_recieved} className={["settings", styles.user_icon, styles.pulse].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].recieved_events}</h3>
                        {this.props.new_events > 0 && this.props.new_events}
                        </div>
                    </button>
                    </div>

                    <div className="d-flex col-12 col-md-6 py-5 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('manage_created', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","p-4","mx-auto",styles.menu_item].join(' ')}>
                        <img src={icon_manage_created} className={["settings", styles.user_icon, styles.pulse].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].created_events}</h3>
                        {this.props.new_events > 0 && this.props.new_events}
                        </div>
                    </button>
                    </div>

                    <div className="d-flex col-12 col-md-6 py-5 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('settings', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","p-4","mx-auto",styles.menu_item].join(' ')}>
                        <img src={icon_settings} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].settings}</h3>
                        </div>
                    </button>
                    </div>
                    
                    {this.props.user.level === "0" &&
                    <div className="d-flex col-12 col-md-6 py-5 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('manage_users', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","p-4","mx-auto",styles.menu_item].join(' ')}>
                        <img src={icon_settings} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].admin}</h3>
                        </div>
                    </button>
                    </div> 
                    } 
                                   
                    
                </div>
            </div>
        </div>
      );
    }
  }

  export {HomeScreen}