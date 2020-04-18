import React from 'react';
//own ccs/scss must have .module in filename ...
import $ from 'jquery';
import styles from '../shared.module.scss';

class ChangePass extends React.Component {
    constructor(props) {
        super(props);
        //methods
        this.user_action = this.user_action.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        //localization
        this.strings ={
            sk:{
                old_pass: 'Pôvodné heslo',
                new_pass: 'Nové heslo',
                update: 'Vykonaj',
                close: 'Zavri',
                wrong: 'Zadané pôvodné heslo je nesprávne'
            },                               
            en:{
                old_pass: 'Old password',
                new_pass: 'New password',
                update: 'Update',
                close: 'Close',
                wrong: 'Your old password does not match'
            }
        };
        this.state = { 
            old_pass: '',
            new_pass: ''
        };
    }

    //update state of pass on input change
    updateInputValue = async function (evt) {
        //console.log(this);
        $('#input_'+evt.target.name+'').removeClass('is-invalid');
        $("#new_pass_err").html('').fadeOut();
        switch(evt.target.name){
            case 'old_pass':
                //manage pass only in this component
                await this.setState({
                    old_pass: evt.target.value
                });
                break;
            case 'new_pass':
                // get name across app
                await this.setState({
                    new_pass: evt.target.value
                });
                break;
            default:
                break;
        } 
    }

    //register or login based on act
    user_action(event, act) {
        event.preventDefault();
        console.log(act);
        switch(act){
            case 'close_change_pass':
                $("#changePass").fadeOut();
                break;
            case 'change_pass':
                if(this.state.new_pass.length > 0 && this.state.new_pass.length  > 0){
                    let wrong = this.strings[this.props.lang].wrong;
                    $.ajax({
                        type: 'post',
                        url: this.props.baseUrl+'/backend/login_screen.php',
                        data: $("#changePass").serialize() + "&action="+act+"&name="+this.props.user.name,
                        success: function (response) {
                            let resp = JSON.parse(response);                   
                            switch(resp?.check){
                                case 'wrong':
                                    $("#new_pass_err").html(wrong).fadeIn();
                                    break;
                                case 'success':                                
                                    //$("#user_screen").fadeIn(); //maybe some info about success smt
                                    $("#changePass").fadeOut();
                                    break;
                                default:
                                    break;
                            }             
                        }
                      });
                }
                else{
                    if(this.state.old_pass.length === 0 ) $("#input_old_pass").addClass('is-invalid');
                    else  $("#input_old_pass").removeClass('is-invalid');
                    if(this.state.new_pass.length === 0) $("#input_new_pass").addClass('is-invalid');
                    else $("#input_new_pass").removeClass('is-invalid');
                }

                break;
            default:
                break;
        }
    }
  
    render() {
        const name = this.props.name;
      return (      
        <form id="changePass" className={['position-absolute', 'p-3', 'bg-dark', styles.content_center, styles.style_white, styles.hidden].join(' ')} 
        style={{zIndex:'5'}}>
            <div className="col-12 form-group">                			
                <input type="password" id="input_old_pass" name="old_pass" className="form-control" maxLength="40"
                value={name} 
                onChange={this.updateInputValue} 
                placeholder={this.strings[this.props.lang].old_pass} />					
            </div>
            <div className="col-12 form-group">					
                <input type="password" id="input_new_pass" name="new_pass" className="form-control" maxLength="40" 
                onChange={this.updateInputValue} placeholder={this.strings[this.props.lang].new_pass} />
            </div>
            <div className="d-flex">
                <div className="col-6 form-group">					
                    <button type="submit" className={"btn align-self-end px-5 submit " +styles.log_screen}
                        onClick={ event => this.user_action(event, 'change_pass')}
                    >{this.strings[this.props.lang].update}</button>
                </div>          
                <div className="col-6 form-group">					
                    <button type="submit" className={"btn align-self-end px-5 submit " +styles.log_screen}
                        onClick={ event => this.user_action(event, 'close_change_pass')}
                    >{this.strings[this.props.lang].close}</button>
                </div>
            </div>
            <div className="d-flex">
                <div id="new_pass_err" className="col-12 text-danger"></div>
            </div>        
        </form>
      );
    }
  }

  export {ChangePass}