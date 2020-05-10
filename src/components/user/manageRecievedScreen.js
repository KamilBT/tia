import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';
import icon_back from '../../images/back.svg';
import {RecievedEvent} from './recievedEvent.js';


class ManageRecievedScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.openDetails = this.openDetails.bind(this);     
        //localization
        this.strings ={
            sk:{
                title: 'Prijaté eventy',
                back: 'Naspäť',
                total: 'Všetko: ',
                close: 'Zavrieť'
               
            },
            en:{
                title: 'Recieved Events',
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
        <div id="manageRecievedScreen" className={[styles.screen, styles.hidden].join(' ')}> 
            <h2 className="text-white">{this.strings[this.props.lang].title}</h2>             
            <div className="container">
                <div className="row w-100 m-0">
                    <div className="d-flex col-12 py-2 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('mng_recieved_back', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","mx-auto","text-white"].join(' ')}>
                        <img src={icon_back} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].back}</h3>
                        </div>
                    </button>
                    </div>
                    
        
                    <div id="recieved_list" className={["container",styles.hidden].join(' ')}>                        
                        <RecievedEvent 
                            recieved_ev = {this.props.recieved_ev}
                            lang = {this.props.lang}
                            baseUrl = {this.props.baseUrl}

                            openDetails = {this.openDetails}
                            user_id = {this.props.user.id}
                            updateResponse = {this.props.updateResponse}
                            setPaid = {this.props.setPaid}
                            setAnswer = {this.props.setAnswer}
                        />                                            
                    </div>               

                </div>
            </div>
        </div>
      );
    }
  }

  export {ManageRecievedScreen}