import React from 'react';
import styles from '../shared.module.scss';

class CEDQuestions extends React.Component {

  constructor(props) {
        super(props);
        //localization
        this.strings ={
            sk:{
                answered: 'Zatiaľ bez odpovede.',
            },
            en:{
                answered: 'Not answered yet.',
            }
        };

    }


    render() {    
    
    const questions = this.props.questions;
    console.log(questions);
        
      return ( 
          <div className="container">
            { questions != null && Object.keys(questions).map((item) => {
                return (
                <div className={["row"].join(' ')} key={"detail_of-"+item}>                       
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {questions[item].text}:                       
                    </span>
                    <span className={["text-white", "text-left", "col-6"].join(' ')} >
                        {questions[item]?.answer === null ? this.strings[this.props.lang].answered : questions[item].answer} 
                   </span>
                   <div className={["col-10", "mx-auto", "my-2", styles.style_white].join(' ')} >                        
                    </div>                 
                </div>                
                )
            })}
          </div>
      );
    }
  }

  export {CEDQuestions}