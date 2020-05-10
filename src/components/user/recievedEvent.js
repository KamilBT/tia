import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import check from '../checkbox.module.scss';
import $ from 'jquery';
import {REDQuestions} from './recievedEventDetailsQuestions.js';

class RecievedEvent extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.hideEvent = this.hideEvent.bind(this);
        //localization
        this.strings ={
            sk:{
                name: 'Názov',
                location: 'Lokalita',
                date: 'Dátum',
                time: 'Čas',
                hide: 'Skry',
                accept: 'Zúčastním sa',
                decline: 'Nezúčastním sa',
                maybe: 'Možno sa zúčastním',
                price: 'Celková cena',
                prece_pp: 'Cena na osobu',
                iban: 'Účet zberateľa financií:',
                event_price_paid: 'Zaplatené',
                questions: 'Priložené otázky'
            },
            en:{
                name: 'Name',
                location: 'Location',
                date: 'Date',
                time: 'Time',
                hide: 'Hide',
                accept: 'Accept',
                decline: 'Decline',
                maybe: 'Maybe',
                price: 'Total price',
                prece_pp: 'Price per person',
                iban: 'Collector bank account',
                event_price_paid: 'Paid',
                questions: 'Attached questions'
            }
        };

    }

    hideEvent(ev_id, user_id, bool){
        console.log(ev_id, user_id, bool);
        if(bool){
            $.ajax({
                type: 'post',
                url: this.props.baseUrl+'/backend/eventAction.php',
                data: "id_user="+user_id+"&id_event="+ev_id+"&action=hide",
                success: function (response) {
                    let resp = JSON.parse(response);                   
                    switch(resp?.check){
                        case 'success':                                                                        
                            //hide show them after load with ajax, hide on back to menu
                            console.log(resp?.data);                        
                            $("#recieved_ev_"+ev_id).fadeOut();
                            break;
                        default:
                            break;
                    }             
                }
            });
        }
    }


    render() {
    //console.log(this.props);       
        const events = this.props.recieved_ev;
        //console.log(events);
        const user_id = this.props.user_id;
      return ( 
          <div id="recieved_events_list" className="w-100">
            {Object.keys(events).map((item) => {                
                //console.log(events[item]);                            
                return (
                <div key={"evet_id-"+item} className="row">
                
                {
                events[item].dismiss === "0" && 
                                      
                <div 
                    id={"recieved_ev_"+item}
                    className={["my-3","p-3","col-12", styles.style_white].join(' ')}                    
                >
                
                    <h4 className={["text-white", "text-center", "col-12"].join(' ')} >
                        {events[item].name}
                    </h4>
                    <div className={["text-white", "col-12"].join(' ')} >
                        <div className="container p-0">
                            <div className="row">
                                <span className="col-6">{this.strings[this.props.lang].location}:</span>
                                <span className="col-6 text-left">{events[item].location}</span>
                            </div>
                        </div>  
                    </div>
                    <div className={["text-white", "col-12"].join(' ')} >
                        <div className="container p-0">
                            <div className="row">
                                <span className="col-6">{this.strings[this.props.lang].date}:</span>
                                <span className="col-6 text-left">{events[item].date}</span>
                            </div>
                        </div>  
                    </div>
                    <div className={["text-white", "col-12"].join(' ')} >
                        <div className="container p-0">
                            <div className="row">
                                <span className="col-6">{this.strings[this.props.lang].time}:</span>
                                <span className="col-6 text-left">{events[item].time}</span>
                            </div>
                        </div>  
                    </div>

                    { events[item].iban !== null && 
                    <div className="conteiner p-3">
                        <div className="row">
                    
                    <span className={["text-white","text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].iban}:
                    </span>
                    
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {events[item].iban}
                    </span>

                    <span className={["text-white","text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].prece_pp}:
                    </span>
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {events[item].price_pp} €
                    </span>
                        
                        </div>
                    </div>
                    }                

                    <button 
                        className={[styles.menu, styles.eventAction,"mr-3", "my-3", 
                        events[item].response === "1" && styles.chosen].join(' ')}
                        onClick={e => this.props.updateResponse(user_id, item, "1", e)}                        
                    >
                        {this.strings[this.props.lang].accept}                        
                    </button>
                    <button className={[styles.menu, styles.eventAction,"mr-3", "my-3",
                        events[item].response === "0" && styles.chosen].join(' ')}
                        onClick={e => this.props.updateResponse(user_id, item, "0", e)}                        
                    >
                        {this.strings[this.props.lang].decline}                        
                    </button>
                    <button className={[styles.menu, styles.eventAction, "my-3",
                        events[item].response === "2" && styles.chosen].join(' ')}
                        onClick={e => this.props.updateResponse(user_id, item, "2", e)}                        
                    >
                        {this.strings[this.props.lang].maybe}                        
                    </button>

                    <div className={["text-white", "col-12"].join(' ')} ></div>
                    { events[item].iban !== null && events[item].response === "1" &&
                    <div className="conteiner p-3">
                        <div className="row">  

                            <div className="d-flex col-4 px-0 alegin-self-center">
                                <div className={[check.chiller_cb, "align-self-center"].join(' ')}>
                                    <input id={"check_me"+item} type="checkbox" value={"check_paid"+item} 
                                     onChange={ e => this.props.setPaid(e, user_id, item, events[item].paid === "1" ? "0" : "1")}
                                     checked={ events[item].paid === "1" ? true : false}
                                    >
                                    </input> 
                                    <label htmlFor={"check_me"+item} className="text-white">
                                        {this.strings[this.props.lang].event_price_paid}
                                    </label> 
                                    <span></span>
                                </div>
                            </div>
                        
                        </div>
                    </div>
                    }

                    { events[item]?.questions.hasOwnProperty('null') === false &&
                    <div className="container">
                        <h5 className={["text-white", "text-center", "col-12", "my-3"].join(' ')} >
                            {this.strings[this.props.lang].questions}
                        </h5>

                        <REDQuestions
                            user_id= {user_id}
                            event_id = {item}
                            questions = {events[item].questions}
                            lang = {this.props.lang}   
                            setAnswer = {this.props.setAnswer}                     
                        />
                    </div>
                    }

                    <div className={["text-white", "col-12"].join(' ')} ></div>
                    <button className={[styles.menu, styles.eventAction, "float-right"].join(' ')}
                        onClick={e => this.hideEvent(item, user_id, true, e)}                        
                    >
                        {this.strings[this.props.lang].hide}                        
                    </button>
                
                </div>  
                 
                }</div>             
                )
            })}
          </div>
      );
    }
  }

  export {RecievedEvent}