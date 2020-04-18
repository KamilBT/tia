import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';
import icon_back from '../../images/back.svg';

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
                send: "Poslať",
                sendTo: "Vyberte, kto dostane pozvánku"
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
                send: "Send",
                sendTo: "Choose, who will recive invite"
            }
        };
        this.state = {
            event_type: '',
            event_name: '',
            event_location: '',
            event_date: '',
            event_time: '',
            add_form: false,
            send_to: null, //[]
            send_to_id: null, //[]
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
        await this.setState({ [e.target.name]: e.target.value});
        console.log(this.state);
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
        console.log(this.state);
    }

    /**
     *  Create event with current state stored values
     */
    createEvent(e){
        e.preventDefault();
        if(this.state.event_name.length > 0 && this.state.event_location.length > 0
            && this.state.event_date.length > 0 && this.state.event_time.length && this.state.send_to){

            $.ajax({
                type: 'post',
                url: this.props.baseUrl+'/backend/createEvent.php',
                data: "name="+this.props.user.name+"&id_sender="+this.props.user.id+"&action=defaultEv&ev_name="+this.state.event_name+
                      "&ev_location="+this.state.event_location+"&ev_date="+this.state.event_date+
                      "&ev_time="+this.state.event_time+"&send_to="+JSON.stringify(this.state.send_to),
                success: function (response) {
                    let resp = JSON.parse(response);                   
                    switch(resp?.check){
                        case 'success':
                            //TODO LOAD USER DATA                                                     
                            //hide LoginScreen and open UserScreen
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
                            <div className="col-12 form-group">                			
                                <input type="text" id="event_name" name="event_name" className="form-control" maxLength="40"
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_name} />					
                            </div>
                            <h4 className="text-white">{this.strings[this.props.lang].event_location}</h4>
                            <div className="col-12 form-group">					
                                <input type="text" id="event_location" name="event_location" className="form-control" maxLength="40" 
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_location} />
                            </div>
                            <h4 className="text-white">{this.strings[this.props.lang].event_date}</h4>                            
                            <div className="col-12 form-group">					
                                <input type="date" id="event_date" name="event_date" className="form-control" maxLength="40" 
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_date} />
                            </div>
                            <h4 className="text-white">{this.strings[this.props.lang].event_time}</h4> 
                            <div className="col-12 form-group">					
                                <input type="time" id="event_time" name="event_time" className="form-control" maxLength="40" 
                                onChange={this.updateInputValue} 
                                placeholder={this.strings[this.props.lang].event_time} />
                            </div>
                        </div>

                        <div id="extension_booking" className={["mx-auto",styles.hidden].join(' ')}>
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
                            <div className="col-6 pt-4 form-group">					
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