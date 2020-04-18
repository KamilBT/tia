import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';
import icon_back from '../../images/back.svg';

class CreatedEvent extends React.Component {

  constructor(props) {
        super(props);
        //methods
        //localization
        this.strings ={
            sk:{
                name: 'Názov',
                location: 'Lokalita',
                date: 'Dátum',
                time: 'Čas'
            },
            en:{
                name: 'Name',
                location: 'Location',
                date: 'Date',
                time: 'Time'
            }
        };

    }


    render() {
    //console.log(this.props);       
        const events = this.props.created_ev;
      return ( 
          <div id="create_events_list" className="row">
            {Object.keys(events).map((item) => {
                //console.log(events[item]);
                return (
                <div className={["my-3","p-3","col-12", styles.style_white].join(' ')} key={"evet_id-"+item}>
                    <span className={["text-white", "col-12"].join(' ')} >
                        {this.strings[this.props.lang].name}: {events[item].name}
                    </span>
                    <span className={["text-white", "col-12"].join(' ')} >
                        {this.strings[this.props.lang].location}: {events[item].location}
                    </span>
                    <span className={["text-white", "col-12"].join(' ')} >
                        {this.strings[this.props.lang].date}: {events[item].date}
                    </span>
                    <span className={["text-white", "col-12"].join(' ')} >
                        {this.strings[this.props.lang].time}: {events[item].time}
                    </span>
                    <button className={styles.menu_btn}
                        onClick={e => this.props.openDetails(item, e)}
                        
                    >
                        <img src={icon_back} className={["settings", styles.detail_icon, styles.settings_img].join(' ')} alt="settings" />
                    </button>
                </div>                
                )
            })}
          </div>
      );
    }
  }

  export {CreatedEvent}