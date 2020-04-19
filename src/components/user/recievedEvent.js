import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';

class RecievedEvent extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.hideEvent = this.hideEvent.bind(this);
        this.evResponse = this.evResponse.bind(this);
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
                maybe: 'Možno sa zúčastním'
            },
            en:{
                name: 'Name',
                location: 'Location',
                date: 'Date',
                time: 'Time',
                hide: 'Hide',
                accept: 'Accept',
                decline: 'Decline',
                maybe: 'Maybe'
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

    evResponse(user_id, ev_id, event, resp){
        console.log(event);
        $.ajax({
            type: 'post',
            url: this.props.baseUrl+'/backend/eventAction.php',
            data: "id_user="+user_id+"&id_event="+ev_id+"&action=response&response="+resp+"",
            event: event,
            ev_id: ev_id,
            updateResponse: this.props.updateResponse,
            success: function (response) {
                let resp = JSON.parse(response);                   
                switch(resp?.check){
                    case 'success':                                                                                               
                        //update state
                        this.event.response = resp;
                        this.updateResponse(ev_id, this.event);                                  
                        break;
                    default:
                        break;
                }             
            }
        });
        
    }


    render() {
    //console.log(this.props);       
        const events = this.props.recieved_ev;
        console.log(events);
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

                    <button 
                        className={[styles.menu, styles.eventAction,"mr-3", "my-3", 
                        events[item].response === "1" && styles.chosen].join(' ')}
                        onClick={e => this.evResponse(user_id, item, events[item], 1, e)}                        
                    >
                        {this.strings[this.props.lang].accept}                        
                    </button>
                    <button className={[styles.menu, styles.eventAction,"mr-3", "my-3",
                        events[item].response === "0" && styles.chosen].join(' ')}
                        onClick={e => this.evResponse(user_id, item, events[item], 0, e)}                        
                    >
                        {this.strings[this.props.lang].decline}                        
                    </button>
                    <button className={[styles.menu, styles.eventAction, "my-3",
                        events[item].response === "2" && styles.chosen].join(' ')}
                        onClick={e => this.evResponse(user_id, item, events[item], 2, e)}                        
                    >
                        {this.strings[this.props.lang].maybe}                        
                    </button>
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