import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
//import {UserMenu} from './UserMenu.js';
import $ from 'jquery';
import {HomeScreen} from './homeScreen.js';
import {CreateEventScreen} from './createEventScreen.js';
import {ManageRecievedScreen} from './manageRecievedScreen.js';
import {ManageCreatedScreen} from './manageCreatedScreen.js';
import {SettingsScreen} from './settings.js';


class UserScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.changeScreen = this.changeScreen.bind(this);
        this.updateNewEventsCount = this.updateNewEventsCount.bind(this);
        this.getCreatedEvents = this.getCreatedEvents.bind(this);
        this.getRecievedEvents = this.getRecievedEvents.bind(this);
        this.updateResponse = this.updateResponse.bind(this);
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
        this.state = {
          screen: 'home',
          new_events: 0,
          created_ev: {},
          recieved_ev: {}
        }
    }
    /**
     * function to swap screens
     */
    changeScreen = async(screen, e) => {
      await this.setState({
        screen: screen
      });
      console.log("switch to "+this.state.screen);
      //TODO jquery switch screen based on value
      switch(screen){
        case 'settings':
          $("#homeMenu").fadeOut();
          $("#settings_screen").fadeIn();
          break;
        case 'home_sett':
          //change to home from settings
          $("#settings_screen").fadeOut();
          $("#homeMenu").fadeIn();
          break;
        case 'create_ev':
          $("#homeMenu").fadeOut();
          $("#createEventScreen").fadeIn();
          break;
        case 'home_ce':
          //change to home from create events
          $("#createEventScreen").fadeOut();
          $("#homeMenu").fadeIn();
          break;
        case 'manage_recieved':
          this.getRecievedEvents();
          $("#homeMenu").fadeOut();
          $("#manageRecievedScreen").fadeIn();
          break;
        case 'mng_recieved_back':
          $("#manageRecievedScreen").fadeOut();
          $("#homeMenu").fadeIn();
          break;
        case 'manage_created':
          this.getCreatedEvents();
          $("#homeMenu").fadeOut();
          $("#manageCreatedScreen").fadeIn();
          break;
        case 'mng_created_back':
          $("#manageCreatedScreen").fadeOut();
          $("#event_details").fadeOut();
          $("#homeMenu").fadeIn();
          break;
        case 'detailEv_close':
          $("#event_details").fadeOut();
          break;
        default:
          break;
      }
    }

    /**
     *  updates count of new events
     */
    updateNewEventsCount = async(count) => {
      await this.setState({
        new_events: count
      });

    }

    /**
     *  getCreatedEvents from database
     */
    getCreatedEvents(){
      
      $.ajax({
          type: 'post',
          url: this.props.baseUrl+'/backend/getCreated.php',
          data: "name="+this.props.user.name+"&id_sender="+this.props.user.id+"&action=getAll",
          user: this,
          success: function (response) {
              let resp = JSON.parse(response);                   
              switch(resp?.check){
                  case 'success':
                      //TODO LOAD USER CREATED EVENT DATA                                                     
                      //hide show them after load with ajax, hide on back to menu
                      console.log(resp?.data);
                      const ev_array = resp?.data.events;
                      //convert array to nice object on client side instead of server
                      let events = {};
                      ev_array.forEach(el => {
                        //console.log(el);
                        if(!events.hasOwnProperty(el.id_event)){
                          //if object has no data for event, add shared data and 1st reciever
                          events[el.id_event] = {
                            sender: el.id_sender,
                            name: el.name,
                            location: el.location,
                            date: el.date,
                            time: el.time,
                            send_to: {
                              [el.id_user]: {
                                response: el.response,
                                dismiss: el.dismiss,
                                name: el.user_name
                              }
                            }
                          }
                        }
                        else{
                          //set response and dissmiss for another users, that event was sent to
                          events[el.id_event].send_to[el.id_user] = {
                            response: el.response,
                            dismiss: el.dismiss,
                            name: el.user_name
                          }
                        }                      
                      });                      
                      this.user.setState({
                        created_ev: events
                      });
                      console.log(this.user.state);
                      //render list
                      
                      $("#created_list").fadeIn();
                      break;
                  default:
                      break;
              }             
          }
      });    
    }

    /**
     *  updates count of new events
     */
    updateNewEventsCount = async(count) => {
      await this.setState({
        new_events: count
      });

    }

    /**
     *  getRecievedEvents from database
     */
    getRecievedEvents(){
      
      $.ajax({
          type: 'post',
          url: this.props.baseUrl+'/backend/getRecieved.php',
          data: "name="+this.props.user.name+"&id_sender="+this.props.user.id+"&action=getAll",
          user: this,
          success: function (response) {
              let resp = JSON.parse(response);                   
              switch(resp?.check){
                  case 'success':                                                                        
                      //hide show them after load with ajax, hide on back to menu
                      console.log(resp?.data);
                      const ev_array = resp?.data.events;
                      //convert array to nice object on client side instead of server
                      let events = {};
                      ev_array.forEach(el => {
                        //console.log(el);
                        if(!events.hasOwnProperty(el.id_event)){
                          //if object has no data for event, add shared data and 1st reciever
                          events[el.id_event] = {
                            sender: el.sender,
                            id_sender: el.sender_id,
                            name: el.name,
                            location: el.location,
                            date: el.date,
                            time: el.time,                            
                            response: el.response,
                            dismiss: el.dismiss,
                            booking: el?.booking                                                             
                          }
                        }                                    
                      });                      
                      this.user.setState({
                        recieved_ev: events
                      });
                      console.log(this.user.state);
                      //render list
                      
                      $("#recieved_list").fadeIn();
                      break;
                  default:
                      break;
              }             
          }
      });    
  }

  async updateResponse(ev_id, event){
    await this.setState(prevState => ({
      recieved_ev: {                   
          ...prevState.recieved_ev,    
          [ev_id]: event 
      }
    }));
  }
    
  
    render() {
      const screen = this.state.screen;
      const user = this.props.user;
      const lang = this.props.lang;
      const baseUrl = this.props.baseUrl;
      const new_events = this.state.new_events;
      
      return (
        <div id="user_screen" className={['container', 'py-5', styles.screen, styles.hidden].join(' ')}>
            <h3 className="text-white">{this.strings[this.props.lang].welcome + " " +this.props.user.name} </h3>
                           
            <HomeScreen
              user={user}
              sreen = {screen}
              lang = {lang}
              baseUrl={baseUrl}
              changeScreen={this.changeScreen}
              
              new_events={new_events}
              updateNewEventsCount = {this.updateNewEventsCount}
            />

            <CreateEventScreen
              user={user}
              sreen = {screen}
              lang = {lang}
              baseUrl={baseUrl}
              changeScreen={this.changeScreen}
            />

            <ManageRecievedScreen
              user={user}
              sreen = {screen}
              lang = {lang}
              baseUrl={baseUrl}
              changeScreen={this.changeScreen}

              recieved_ev = {this.state.recieved_ev}
              user_id = {this.props.user.id}
              updateResponse = {this.updateResponse}
            />

            <ManageCreatedScreen
              user={user}
              sreen = {screen}
              lang = {lang}
              baseUrl={baseUrl}
              changeScreen={this.changeScreen}

              created_ev = {this.state.created_ev}
            />

            <SettingsScreen
              user={user}
              sreen = {screen}
              lang = {lang}
              baseUrl={baseUrl}
              changeScreen={this.changeScreen}
              updateName={this.props.updateName} 
            />

        </div>
      );
    }
  }

  export {UserScreen}