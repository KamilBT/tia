import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';
import icon_back from '../../images/back.svg';
import icon_temp from '../../images/icon.svg';

import {CreatedEvent} from './createdEvent.js'
import { CreatedEventDetails } from './createdEventDetails.js';


class ManageCreatedScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.openDetails = this.openDetails.bind(this);     
        //localization
        this.strings ={
            sk:{
                title: 'Manažment vytvorených eventov',
                back: 'Naspäť',
                total: 'Všetko: ',
                close: 'Zavrieť'
               
            },
            en:{
                title: 'Management of created events',
                back: 'Return',
                total: 'All: ',
                close: 'Close'
               
            }
        };
        this.state = {
            total: null,
            detail_id: null
        };
        this.event_types = {
            sk:[
            { value: 'default', label: 'Základný typ' },
            { value: 'booking', label: 'Rezervácia' }
            ],
            en:[
            { value: 'default', label: 'Default' },
            { value: 'booking', label: 'Booking' }]
        };
        this.selectStyles = {
            container: base => ({
                ...base,
                flex: 1
            }),
        };
        //list of users, who can recieve notification (data for multiselect)
    }

    async openDetails(id_event){
        await this.setState({
            detail_id: id_event
        });
        $("#event_details").fadeIn();
        console.log(this.state);
    }



    render() {
    //console.log(this.props);
      return ( 
        <div id="manageCreatedScreen" className={[styles.screen, styles.hidden].join(' ')}> 
            <h2 className="text-white">{this.strings[this.props.lang].title}</h2>             
            <div className="container">
                <div className="row w-100 m-0">
                    <div className="d-flex col-12 py-2 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('mng_created_back', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","mx-auto","text-white"].join(' ')}>
                        <img src={icon_back} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].back}</h3>
                        </div>
                    </button>
                    </div>

                    <div className="d-flex col-6 py-2 bg-red">
                   
                        <div className={["d-flex","mx-auto","text-white"].join(' ')}>
                        <img src={icon_temp} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].total}</h3>
                        </div>
                
                    </div>
        
                    <div id="created_list" className={["container",styles.hidden].join(' ')}>                        
                        <CreatedEvent 
                            created_ev = {this.props.created_ev}
                            lang = {this.props.lang}

                            openDetails = {this.openDetails}
                        />                                            
                    </div>  

                    <div id="event_details" className={["container", "bg-dark",styles.style_white, styles.content_center, styles.hidden].join(' ')}>
                        <CreatedEventDetails
                            created_ev = {this.props.created_ev}
                            lang = {this.props.lang}
                            detail_id = {this.state.detail_id}                            
                        />
                        
                    </div>                 

                </div>
            </div>
        </div>
      );
    }
  }

  export {ManageCreatedScreen}