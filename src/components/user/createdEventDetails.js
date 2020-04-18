import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';
import icon_back from '../../images/back.svg';

class CreatedEventDetails extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.closeDetail = this.closeDetail.bind(this);
        //localization
        this.strings ={
            sk:{
                name: 'Názov',
                user: 'Používateľ',
                confirmation: 'Stav potvrdenia',
                dismiss: 'Zatvoril',
                none_yet: 'Nevyjadril sa'
            },
            en:{
                name: 'Name',
                user: 'User',
                confirmation: 'Confirmation status',
                dismiss: 'Dissmissed',
                none_yet: 'No comment yet '
            }
        };

    }

    closeDetail(){
        $("#event_details").fadeOut();
    }


    render() {
    //console.log(this.props);
        const ev_id  = this.props.detail_id;       
        const recievers = this.props.created_ev[ev_id]?.send_to;
        
      return ( 
          <div className="container">
            { recievers != null && <h3 className="text-white w-100 text-center p-3">
                Event: {this.props.created_ev[ev_id].name}</h3>
            }
            { recievers != null && Object.keys(recievers).map((item) => {
                console.log(item);
                return (
                <div className={["row"].join(' ')} key={"detail_of-"+item}>
                    <h4 className="text-white w-100 text-left p-3">
                    {this.strings[this.props.lang].user}: {recievers[item].name}</h4>                    
                  
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].confirmation}:                       
                    </span>
                    <span className={["text-white", "text-right", "col-6"].join(' ')} >                      
                        {recievers[item].response == null && this.strings[this.props.lang].none_yet}
                    </span>
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].dismiss}: 
                    </span>
                    <span className={["text-white", "text-rigt", "col-6"].join(' ')} >
                        {recievers[item].dismiss == 0 && "No"}
                    </span>
                    <div className={["col-12", styles.style_white].join(' ')} >                        
                    </div>                     
                </div>                
                )
            })}
            <button className={["col-12",styles.menu_btn].join(' ')}
                onClick={e => this.closeDetail(e)}
            >
                <img src={icon_back} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />
            </button>
          </div>
      );
    }
  }

  export {CreatedEventDetails}