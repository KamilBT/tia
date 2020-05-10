import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';
import icon_back from '../../images/back.svg';

class EventQuestion extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.closeDetail = this.closeDetail.bind(this);
        //localization
        this.strings ={
            sk:{
                question: "Znenie otázky. (Typ áno/nie)",
                removeQuestion: "Odsráň",
            },
            en:{
                question: "Type your quetion. (Possible answers are Yes/No)",
                removeQuestion: "Delete",
            }
        };

    }

    closeDetail(){
        $("#event_details").fadeOut();
    }


    render() {
    //console.log(this.props);
         
        const questions = this.props.questions;
        
      return ( 
          <div className="container p-0">
            
            { questions.length !== 0 && questions.map((item, index) => {
                //console.log(item);
                return (
                <div className={["row"].join(' ')} key={"detail_of-"+item.id}>

                    
                    <div className="col-12 form-group my-4 px-0">                			
                        <input type="text" id={item.id} name="q" className="form-control"
                        onChange={e=> this.props.updateQuestion(e, index)} 
                        placeholder={this.strings[this.props.lang].question} />					
                    </div>               
            
                    <button className={["btn", "ml-auto", "px-4", styles.log_screen].join(' ')}
                        onClick={e => this.props.removeQuestion(e, index)}
                    >
                       {this.strings[this.props.lang].removeQuestion}
                    </button>
                    <div className={["col-12", styles.style_white].join(' ')} >                        
                    </div>                     
                </div>                
                )
            })}
          </div>
      );
    }
  }

  export {EventQuestion}