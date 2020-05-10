import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import check from '../checkbox.module.scss';
import $ from 'jquery';
import icon_back from '../../images/back.svg';
import {EventQuestion} from './eventQuestion.js'

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

class CreateEventScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.switchEventType = this.switchEventType.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.updateToSend = this.updateToSend.bind(this);
        this.setIncludeMe = this.setIncludeMe.bind(this);
        this.pricePerPerson = this.pricePerPerson.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        //localization
        this.strings ={
            sk:{
                title: 'Tvorenie eventu',
                back: 'Naspäť',
                settings: 'Nastavenia',
                events: 'Eventy',
                create_events: 'Vytvor event',
                event_type: 'Zvoľ type eventu',
                event_name: 'Názov eventu',
                event_location: 'Lokalita eventu',
                event_date: 'Dátum konania/začiatku eventu',
                event_time: 'Čas začatia eventu',
                event_iban: /*html*/`Číslo účtu <span style="font-size:12px">(kde sa zbierajú financie pre event)</span>`,
                event_price: "Celková cena bookingu (€)",
                event_price_person: "Cena na osobu (€)",
                event_price_person_desc: "Bude prepočítaná pri pridávaní osôb, ktorým bude poslaný event.",
                event_price_includeMe: "Vrátane mňa",
                send: "Poslať",
                sendTo: "Vyberte, kto dostane pozvánku",
                addQuestion: "Pridaj otázku"
            },
            en:{
                title: 'Event creation',
                back: 'Return',
                settings: 'Settings',
                events: 'Events',
                create_events: 'Create Events',
                event_type: 'Choose event type',
                event_name: 'Set event name',
                event_location: 'Set event location',
                event_date: 'Set date for event',
                event_time: 'Set starting time for event',
                event_iban: /*html*/`Account number <span style="font-size:12px">(where is all event financing collected)</span>`,
                event_price: "Total price for booking (€)",
                event_price_person: "Price per person (€)",
                event_price_person_desc: "Recalculated evertime a list of senders is changed.",
                event_price_includeMe: "Including me",
                send: "Send",
                sendTo: "Choose, who will recive invite",
                addQuestion: "Add question"
            }
        };
        this.state = {
            event_type: '',
            event_name: '',
            event_location: '',
            event_date: '',
            event_time: '',
            event_iban: '',
            event_price: '',
            event_pricePer: '',
            event_priceMe: true,
            add_form: false,
            send_to: null, //[]
            send_to_id: null, //[]
            questions: [] 
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

    /**
     * choose between events, default option then stays visible and extenion can be hidden
     */
    async switchEventType (ev){
        await this.setState({ event_type: ev.value});
        switch(ev.value){
            case 'default':
                $("#event_default").fadeIn();
                $("#event_default2").fadeIn();
                $("#extension_booking").fadeOut();
                break;
            case 'booking':
                $("#event_default").fadeIn();
                $("#event_default2").fadeIn();
                $("#extension_booking").fadeIn();
                break;
            default:
                break;
        }
        console.log(this.state);
    }
    /**
     * Update state parameters with input
     * @param {*} e 
     */
    async updateInputValue (e){
        $('#'+e.target.name+'').removeClass('is-invalid');
        let name = e.target.name;
        await this.setState({ [e.target.name]: e.target.value});
        if (name === 'event_price'){
            //update price per person on price change
            this.pricePerPerson();
        }    
    }

    /**
     *  
     */
    async updateToSend(e){
        console.log(this.props.user.userList);
        const sent_to = [];
        if(e) e.forEach(el => {
            sent_to.push({ name:el.value, id:el.user_id});           
        });
        await this.setState({ send_to: sent_to});
        //update price per person based on number of recievers
        this.pricePerPerson();
        //console.log(this.state);
    }

    /**
     *  Update boolen includeMe for recalc. price on booking event
     *  Deafult - true
     */
    async setIncludeMe(e){
        //console.log(e.target);
        if(this.state.event_priceMe){
            await this.setState({ event_priceMe: false});
        }
        else{
            await this.setState({ event_priceMe: true});
        }
        //update price per person
        this.pricePerPerson();
    }

    /**
     * Set price in state and html
     */
     async pricePerPerson(){
         if (this.state.event_price.length > 0 && this.state.send_to !== null && this.state.send_to.length !== 0){
            let price = (parseFloat(this.state.event_price) / 
            (this.state.event_priceMe === true ? parseInt(this.state.send_to.length)+1 : parseInt(this.state.send_to.length))).toFixed(2);
            await this.setState({ event_pricePer: price});
            console.log(this.state);
        }
    }

    /**
     *  Create event with current state stored values
     */
    createEvent(e){
        e.preventDefault();
        switch(this.state.event_type){
            case "default":
                if(this.state.event_name.length > 0 && this.state.event_location.length > 0
                    && this.state.event_date.length > 0 && this.state.event_time.length && this.state.send_to){

                    $.ajax({
                        type: 'post',
                        url: this.props.baseUrl+'/backend/createEvent.php',
                        data: "name="+this.props.user.name+"&id_sender="+this.props.user.id+"&action=defaultEv&ev_name="+this.state.event_name+
                            "&ev_location="+this.state.event_location+"&ev_date="+this.state.event_date+
                            "&ev_time="+this.state.event_time+"&send_to="+JSON.stringify(this.state.send_to)+"&quetions="+JSON.stringify(this.state.questions),
                        success: function (response) {
                            let resp = JSON.parse(response);                   
                            switch(resp?.check){
                                case 'success':
                                    
                                    $("#createEventScreen").fadeOut();
                                    //$("#user_screen").fadeIn();
                                    $("#homeMenu").fadeIn();
                                    break;
                                default:
                                    break;
                            }             
                        }
                    });
                }
                else{
                    if(this.state.event_name.length === 0) $("#event_name").addClass('is-invalid');
                    else  $("#event_name").removeClass('is-invalid');
                    if(this.state.event_location.length === 0) $("#event_location").addClass('is-invalid');
                    else $("#event_location").removeClass('is-invalid');
                    if(this.state.event_date.length === 0) $("#event_date").addClass('is-invalid');
                    else $("#event_date").removeClass('is-invalid');
                    if(this.state.event_time.length === 0) $("#event_time").addClass('is-invalid');
                    else $("#event_time").removeClass('is-invalid');
                }
                break;

            case "booking":
                if(this.state.event_name.length > 0 && this.state.event_location.length > 0
                    && this.state.event_date.length > 0 && this.state.event_time.length > 0
                    && this.state.event_iban.length > 0 && this.state.event_price.length > 0 && this.state.send_to){

                    $.ajax({
                        type: 'post',
                        url: this.props.baseUrl+'/backend/createEvent.php',
                        data: "name="+this.props.user.name+"&id_sender="+this.props.user.id+"&action=bookingEv&ev_name="+this.state.event_name+
                            "&ev_location="+this.state.event_location+"&ev_date="+this.state.event_date+                           
                            "&ev_time="+this.state.event_time+"&send_to="+JSON.stringify(this.state.send_to)+
                            "&ev_iban="+this.state.event_iban+"&ev_price="+this.state.event_price+'&ev_pricePer='+this.state.event_pricePer+
                            "&quetions="+JSON.stringify(this.state.questions),
                        success: function (response) {
                            let resp = JSON.parse(response);                   
                            switch(resp?.check){
                                case 'success':
                                    
                                    $("#createEventScreen").fadeOut();
                                    //$("#user_screen").fadeIn();
                                    $("#homeMenu").fadeIn();
                                    break;
                                default:
                                    break;
                            }             
                        }
                    });
                }
                else{
                    if(this.state.event_name.length === 0) $("#event_name").addClass('is-invalid');
                    else  $("#event_name").removeClass('is-invalid');
                    if(this.state.event_location.length === 0) $("#event_location").addClass('is-invalid');
                    else $("#event_location").removeClass('is-invalid');
                    if(this.state.event_date.length === 0) $("#event_date").addClass('is-invalid');
                    else $("#event_date").removeClass('is-invalid');
                    if(this.state.event_time.length === 0) $("#event_time").addClass('is-invalid');
                    else $("#event_time").removeClass('is-invalid');
                    if(this.state.event_price.length === 0) $("#event_price").addClass('is-invalid');
                    else $("#event_price").removeClass('is-invalid');
                    if(this.state.event_iban.length === 0) $("#event_iban").addClass('is-invalid');
                    else $("#event_iban").removeClass('is-invalid');
                }
                break;

            default:
                break;
        }
    }


   /**
     * Add question to event.
     */
    async addQuestion(e){
        e.preventDefault();
        let q =  {};
        q.text = "";
        q.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await this.setState((prevState) => ({
            ...prevState,
            questions: [...prevState.questions, q],
        }));
        console.log(this.state);
    }

    /**
     * Remove quetion.
     */
    async removeQuestion(e, index){
        e.preventDefault();
        let q = [...this.state.questions];
        console.log(q);
        q.splice(index, 1);
        console.log(q);
        await this.setState((prevState) => ({
            ...prevState,
            questions: q,
        }));
        console.log(this.state);
    }

    /**
     * Update qustion
     */
    async updateQuestion(e, index){
        //console.log(e.target.value);
        let q = [...this.state.questions];
        q[index].text = e.target.value;
        console.log(q, index);

        await this.setState((prevState) => ({
            ...prevState,
            questions: q,
        }));
        console.log(this.state);
    }

    render() {
    //console.log(this.props);
      return ( 
        <div id="createEventScreen" className={[styles.screen, styles.hidden].join(' ')}> 
            <h2 className="text-white">{this.strings[this.props.lang].title}</h2>             
            <div className="container">
                <div className="row w-100 m-0">
                    <div className="d-flex col-12 py-2 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('home_ce', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","mx-auto","text-white"].join(' ')}>
                        <img src={icon_back} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].back}</h3>
                        </div>
                    </button>
                    </div>

                    <Select                
                        name="colors"                        
                        components={animatedComponents}
                        options={this.event_types[this.props.lang]}
                        className="basic-single"
                        classNamePrefix="select"
                        styles={this.selectStyles}
                        placeholder={<div>{this.strings[this.props.lang].event_type}</div>}
                        onChange={this.switchEventType} 
                    />

                    <form id="create_event" className="container pt-4 px-0">
                        <div id="event_default" className={["row","mx-auto",styles.hidden].join(' ')}>
                            <h4 className="text-white">{this.strings[this.props.lang].event_name}</h4>
                            <div className="col-12 form-group mb-4">                			
                                <input type="text" id="event_name" name="event_name" className="form-control" maxLength="40"
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_name} />					
                            </div>
                            <h4 className="text-white">{this.strings[this.props.lang].event_location}</h4>
                            <div className="col-12 form-group mb-4">					
                                <input type="text" id="event_location" name="event_location" className="form-control" maxLength="40" 
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_location} />
                            </div>
                            <h4 className="text-white">{this.strings[this.props.lang].event_date}</h4>                            
                            <div className="col-12 form-group mb-4">					
                                <input type="date" id="event_date" name="event_date" className="form-control" maxLength="40" 
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_date} />
                            </div>
                            <h4 className="text-white">{this.strings[this.props.lang].event_time}</h4> 
                            <div className="col-12 form-group mb-4">					
                                <input type="time" id="event_time" name="event_time" className="form-control" maxLength="40" 
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_time} />
                            </div>
                        </div>

                        <div id="extension_booking" className={["row", "mx-auto",styles.hidden].join(' ')}>
                            
                            <h4 className="text-white" dangerouslySetInnerHTML={{__html: this.strings[this.props.lang].event_iban}}></h4>
                            <div className="col-12 form-group mb-4">                			
                                <input type="text" id="event_iban" name="event_iban" className="form-control"
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_iban_placehocer} 
                                maxLength="24" />					
                            </div>

                            <h4 className="text-white">{this.strings[this.props.lang].event_price}</h4>
                            <div className="col-12 form-group mb-4">                			
                                <input type="number" id="event_price" name="event_price" className="form-control"
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_price} />					
                            </div>

                            <h4 className="text-white">{this.strings[this.props.lang].event_price_person}</h4>
                            <div className="d-flex col-4 px-0 alegin-self-center">
                                <div className={[check.chiller_cb, "align-self-center"].join(' ')}>
                                    <input id="check_me" type="checkbox" value="include_me" 
                                     onChange={ e => this.setIncludeMe(e)}
                                     checked={this.state.event_priceMe}
                                    >
                                    </input> 
                                    <label htmlFor="check_me" className="text-white">
                                        {this.strings[this.props.lang].event_price_includeMe}
                                    </label> 
                                    <span></span>
                                </div>
                            </div>
                            <p className="text-white col-8 mx-auto">
                                { (this.state.event_price.length === 0 || this.state.send_to?.length === 0 ) &&
                                this.strings[this.props.lang].event_price_person_desc}
                                { (this.state.event_price.length > 0 && this.state.send_to !== null && this.state.send_to.length !== 0) &&
                                (parseFloat(this.state.event_price) / 
                                (this.state.event_priceMe === true ? parseInt(this.state.send_to.length)+1 : parseInt(this.state.send_to.length))).toFixed(2)                               
                                }
                            </p>
                        </div>   

                        <div id="event_default2" className={["row","mx-auto", "pt-4",styles.hidden].join(' ')}>
                            <Select 
                                isMulti              
                                name="sendTo"                        
                                components={animatedComponents}
                                options={this.props.user.userList}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={this.selectStyles}
                                placeholder={<div>{this.strings[this.props.lang].sendTo}</div>}
                                onChange={e => this.updateToSend(e)} 
                            />

                            <div id="created_list" className={["container"].join(' ')}>                        
                                <EventQuestion
                                    questions = {this.state.questions}
                                    lang = {this.props.lang}

                                    updateQuestion = {this.updateQuestion}
                                    removeQuestion = {this.removeQuestion}
                                />                                            
                            </div> 

                            <div className="col-6 pt-4 mb-4 form-group">					
                                <button className={"btn align-self-end px-4 " +styles.log_screen}
                                    onClick={this.addQuestion}
                                >{this.strings[this.props.lang].addQuestion}</button>
                            </div>                                                
                            <div className="col-6 pt-4 form-group mb-5">					
                                <button className={"btn align-self-end px-5 " +styles.log_screen}
                                    onClick={this.createEvent}
                                >{this.strings[this.props.lang].send}</button>
                            </div>                            
                        </div>
                        <div className="d-flex">
                            <div id="create_event_err" className="col-12 text-danger"></div>
                        </div>   
                    </form>

                </div>
            </div>
        </div>
      );
    }
  }

  export {CreateEventScreen}