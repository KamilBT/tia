import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
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
                time: 'Čas',
                price: 'Celková cena',
                prece_pp: 'Cena na osobu',
                iban: 'Účet zberateľa financií:'
            },
            en:{
                name: 'Name',
                location: 'Location',
                date: 'Date',
                time: 'Time',
                price: 'Total price',
                prece_pp: 'Price per person',
                iban: 'Collector bank account'
            }
        };

    }


    render() {
    //console.log(this.props);       
        const events = this.props.created_ev;
      return ( 
          <div id="create_events_list" className="container">
            {Object.keys(events).map((item) => {
                //console.log(events[item]);
                return (
                <div className={["my-3", "row", "p-3", styles.style_white].join(' ')} key={"evet_id-"+item}>
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].name}:
                    </span>
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {events[item].name}
                    </span>
                    
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].location}:
                    </span>
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {events[item].location}
                    </span>

                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].date}:
                    </span>
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {events[item].date}
                    </span>

                    <span className={["text-white","text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].time}:
                    </span>
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {events[item].time}
                    </span>

                    { events[item].iban !== null && 
                    <div className="conteiner p-3 w-100">
                        <div className="row">
                    
                    <span className={["text-white","text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].iban}:
                    </span>
                    
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {events[item].iban}
                    </span>

                    <span className={["text-white","text-left", "col-6"].join(' ')} >
                        {this.strings[this.props.lang].price}:
                    </span>
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {events[item].price} €
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