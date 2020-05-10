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
import {AdminScreen} from './admin.js';


class UserScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.changeScreen = this.changeScreen.bind(this);
        this.updateNewEventsCount = this.updateNewEventsCount.bind(this);
        this.getCreatedEvents = this.getCreatedEvents.bind(this);
        this.getRecievedEvents = this.getRecievedEvents.bind(this);
        this.updateResponse = this.updateResponse.bind(this);
        this.setPaid = this.setPaid.bind(this);
        this.setAnswer = this.setAnswer.bind(this);
        this.checkUser = this.checkUser.bind(this);
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
        case 'manage_users':
            //this.checkUser(this.props.user.id);
            $("#homeMenu").fadeOut();
            $("#user_management").fadeIn();
            break;
        case 'home_admin':
          //change to home from settings
          $("#user_management").fadeOut();
          $("#homeMenu").fadeIn();
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
                          //if object has no data for event, add shared data and 1st reciever and questions
                          events[el.id_event] = {
                            sender: el.id_sender,
                            name: el.name,
                            location: el.location,
                            date: el.date,
                            time: el.time,
                            iban: el?.iban,
                            price: el?.price,
                            price_pp: el?.price_pp,
                            send_to: {
                              [el.id_user]: {
                                response: el.response,
                                dismiss: el.dismiss,
                                name: el.user_name,
                                questions :{
                                  [el.fk_question]:{
                                    text: el.text,
                                    answer: el.answer
                                  }
                                }      
                              }
                            },
                            //questions: el.
                          }
                        }
                        else{
                          //set response and dissmiss for another users, that event was sent to + Questions
                          events[el.id_event].send_to[el.id_user] = {
                            response: el.response,
                            dismiss: el.dismiss,
                            name: el.user_name,
                            questions :{
                              ...events[el.id_event].send_to[el.id_user]?.questions,                                               
                              [el.fk_question]:{
                                text: el.text,
                                answer: el.answer
                              }
                            } 
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
                            paid: el.paid,
                            //booking: el?.booking,
                            iban: el?.iban,
                            price: el?.price,
                            price_pp: el?.price_pp,
                            questions :{
                              ...events[el.id_event]?.questions,                                               
                              [el.fk_question]:{
                                text: el.text,
                                answer: el.answer
                              }
                            }
                          }
                        }
                        else{
                          events[el.id_event].questions = {
                            ...events[el.id_event]?.questions,                                               
                            [el.fk_question]:{
                              text: el.text,
                              answer: el.answer
                            }
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

  async updateResponse(user_id, ev_id, resp, e){
    //console.log(this.state.recieved_ev);
    //console.log(event.response);
    await this.setState(prevState => ({
      recieved_ev: {                   
          ...prevState.recieved_ev,    
          [ev_id]: {
            ...prevState.recieved_ev[ev_id],
            response: resp
          } 
      }
    }));
    console.log(this.state.recieved_ev);
    $.ajax({
      type: 'post',
      url: this.props.baseUrl+'/backend/eventAction.php',
      data: "id_user="+user_id+"&id_event="+ev_id+"&action=response&response="+resp+"",
      success: function (response) {
          let r = JSON.parse(response);                   
          switch(r?.check){
              case 'success':                                                                                               
                  //console.log(r);                                 
                  break;
              default:
                  break;
          }             
      }
  });
  }
  /**
   * Update paid info about booking event
   */
  async setPaid(e, user_id, ev_id, bool){
    //console.log(ev_id, user_id, bool);

    await this.setState(prevState => ({
      recieved_ev: {                   
          ...prevState.recieved_ev,    
          [ev_id]: {
            ...prevState.recieved_ev[ev_id],
            paid: bool
          } 
      }
    }));

    console.log(this.state.recieved_ev)

    $.ajax({
        type: 'post',
        url: this.props.baseUrl+'/backend/eventAction.php',
        data: "id_user="+user_id+"&id_event="+ev_id+"&action=setPaid&paid="+bool+"",
        success: function (response) {
            let resp = JSON.parse(response);                   
            switch(resp?.check){
                case 'success':                                                                                
                    break;
                default:
                    break;
            }             
        }
        });
    
}

  /**
  * Set answer to Question in event.
  */
  async setAnswer(e, ev_id, user_id, q_id){
    //console.log(ev_id, user_id, q_id);
    console.log(e.target.value + " __ "+ this.state.recieved_ev[ev_id].questions[q_id].answer);
    if(this.state.recieved_ev[ev_id].questions[q_id].answer === null || this.state.recieved_ev[ev_id].questions[q_id].answer === "0"){
      await this.setState(prevState => ({
        recieved_ev: {                   
            ...prevState.recieved_ev,    
            [ev_id]: {
              ...prevState.recieved_ev[ev_id],
              questions: {
                ...prevState.recieved_ev[ev_id].questions,
                [q_id]:{
                  ...prevState.recieved_ev[ev_id].questions[q_id],
                  answer: "1"
                }
              } 
            } 
        }
      }));
    }
    else{
      await this.setState(prevState => ({
        recieved_ev: {                   
            ...prevState.recieved_ev,    
            [ev_id]: {
              ...prevState.recieved_ev[ev_id],
              questions: {
                ...prevState.recieved_ev[ev_id].questions,
                [q_id]:{
                  ...prevState.recieved_ev[ev_id].questions[q_id],
                  answer: "0"
                }
              } 
            } 
        }
      }));
    }
    $.ajax({
        type: 'post',
        url: this.props.baseUrl+'/backend/eventAction.php',
        data: "id_user="+user_id+"&id_event="+ev_id+"&q_id="+q_id+"&action=setQA&answer="+this.state.recieved_ev[ev_id].questions[q_id].answer+"",
        success: function (response) {
            let resp = JSON.parse(response);                   
            switch(resp?.check){
                case 'success':                                                                        
                    console.log(resp?.data);                        
                    break;
                default:
                    break;
            }             
        }
    });   
  }

  checkUser(user_id){
    console.log(user_id);
    $.ajax({
      type: 'post',
      url: this.props.baseUrl+'/backend/eventAction.php',
      data: "id_user="+user_id+"&action=checkUser",
      success: function (response) {
        console.log(response);
          /*let resp = JSON.parse(response);                   
          switch(resp?.check){
              case 'success':                                                                        
                  console.log(resp?.data);                        
                  break;
              default:
                  break;
          }*/             
      }
  });  
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
              setPaid = {this.setPaid}
              setAnswer = {this.setAnswer}
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

            <AdminScreen
              user={user}
              sreen = {screen}
              lang = {lang}
              baseUrl={baseUrl}
              changeScreen={this.changeScreen}
              updateName={this.props.updateName}
              updateUserList={this.props.updateUserList} 
            />

        </div>
      );
    }
  }

  export {UserScreen}