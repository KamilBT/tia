import React from 'react';
import styles from '../shared.module.scss';
import check from '../checkbox.module.scss';

class REDQuestions extends React.Component {

  constructor(props) {
        super(props);
        //localization
        this.strings ={
            sk:{
                answered: 'Zatiaľ bez odpovede.',
                yes: 'Áno',
                no: 'Nie'
            },
            en:{
                answered: 'Not answered yet.',
                yes: 'Yes',
                no: 'No'
            }
        };

    }


    render() {    
    
    const questions = this.props.questions;
    //console.log(questions);
        
      return ( 
          <div className="container">
            { questions != null && Object.keys(questions).map((item) => {
                return (
                <div className={["row"].join(' ')} key={"detail_of-"+item}>                       
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {questions[item].text}:                       
                    </span>
                    <div className="d-flex col-3 px-0 alegin-self-center">
                        <div className={[check.chiller_cb, "align-self-center"].join(' ')}>
                            <input id={'ev_'+this.props.event_id+'_'+item+'_yes'} type="checkbox" 
                                value={(questions[item]?.answer === null || questions[item]?.answer === "0") ? "0" : "1"} 
                                onChange={ e => this.props.setAnswer(e, this.props.event_id, this.props.user_id, item)}
                                checked={(questions[item]?.answer === null || questions[item]?.answer === "0") ? false : true} 
                            >
                            </input> 
                            <label htmlFor={'ev_'+this.props.event_id+'_'+item+'_yes'} className="text-white">
                                {this.strings[this.props.lang].yes}
                            </label> 
                            <span></span>
                        </div>
                    </div>
                    <div className="d-flex col-3 px-0 alegin-self-center">
                        <div className={[check.chiller_cb, "align-self-center"].join(' ')}>
                            <input id={'ev_'+this.props.event_id+'_'+item+'_no'} type="checkbox"
                                value={(questions[item]?.answer === "1") ? "0" : questions[item]?.answer === null ? "0" : "1"}  
                                onChange={ e => this.props.setAnswer(e, this.props.event_id, this.props.user_id, item)}
                                checked={(questions[item]?.answer === "1") ? false : questions[item]?.answer === null ? false : true} 
                            >
                            </input> 
                            <label htmlFor={'ev_'+this.props.event_id+'_'+item+'_no'} className="text-white">
                                {this.strings[this.props.lang].no}
                            </label> 
                            <span></span>
                        </div>
                    </div>
                    
                   <div className={["col-10", "mx-auto", "my-2", styles.style_white].join(' ')} >                        
                    </div>                 
                </div>                
                )
            })}
          </div>
      );
    }
  }

  export {REDQuestions}