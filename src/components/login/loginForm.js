import React from 'react';
//own ccs/scss must have .module in filename ...
import $ from 'jquery';
import styles from '../shared.module.scss';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        //methods
        this.user_action = this.user_action.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        //localization
        this.strings ={
            sk:{
                name: 'meno',
                pass: 'heslo',
                login: 'prihlásiť',
                register: 'registrácia',
                taken: 'Zvolené meno je už zabraté, je potrebné zvoliť nové',
                wrong: 'Zadané meno alebo heslo nie je správne'
            },
            en:{
                name: 'name',
                pass: 'password',
                login: 'login',
                register: 'register',
                taken: 'username is already taken, please choose another',
                wrong: 'Username or password is invalid'
            }
        };
        this.state = { 
            pass: ''
        };
    }

    //update state of pass on input change
    updateInputValue = async function (evt) {
        //console.log(this);
        $('#input_'+evt.target.name+'').removeClass('is-invalid');
        $("#err_message").html('').fadeOut();
        switch(evt.target.name){
            case 'pass':
                //manage pass only in this component
                await this.setState({
                    [evt.target.name]: evt.target.value
                });
                break;
            case 'name':
                // get name across app
                await this.props.onLoginScreenInput(evt.target);
                break;
            default:
                break;
        } 
    }

    //register or login based on act
    user_action(event, act) {
        event.preventDefault();
        if(this.props.user.name.length > 0 && this.state.pass.length > 0){
            let taken = this.strings[this.props.lang].taken;
            let wrong = this.strings[this.props.lang].wrong;
            $.ajax({
                type: 'post',
                url: this.props.baseUrl+'/public/backend/login_screen.php',
                data: $("#loginForm").serialize() + "&action="+act,
                setUserList: this.props.setUserList,
                setUserListID: this.props.setUserListID,
                setUserID: this.props.setUserID,
                success: function (response) {
                    let resp = JSON.parse(response);                   
                    switch(resp?.check){
                        case 'taken':                            
                            $("#err_message").html(taken).fadeIn();
                            break;
                        case 'wrong':
                            $("#err_message").html(wrong).fadeIn();
                            break;
                        case 'success':
                            //TODO LOAD USER DATA                                                     
                            this.setUserList(resp.data.userList, resp.data.userListId);
                            this.setUserID(resp.data.user_id);
                            //hide LoginScreen and open UserScreen
                            $("#login_screen").animate({left: '500px', opacity: '0'}, 500).fadeOut();
                            $("#user_screen").fadeIn();
                            $("#homeMenu").fadeIn();
                            break;
                        default:
                            break;
                    }             
                }
              });
        }
        else{
            if(this.props.user.name.length === 0) $("#input_name").addClass('is-invalid');
            else  $("#input_name").removeClass('is-invalid');
            if(this.state.pass.length === 0) $("#input_pass").addClass('is-invalid');
            else $("#input_pass").removeClass('is-invalid');
        }
    }
  
    render() {
        const name = this.props.name;
      return (      
        <form id="loginForm" className="mx-auto">
            <div className="col-12 form-group">                			
                <input type="text" id="input_name" name="name" className="form-control" maxLength="40"
                value={name} 
                onChange={this.updateInputValue} 
                placeholder={this.strings[this.props.lang].name} />					
            </div>
            <div className="col-12 form-group">					
                <input type="password" id="input_pass" name="pass" className="form-control" maxLength="40" 
                onChange={this.updateInputValue} placeholder={this.strings[this.props.lang].pass} />
            </div>
            <div className="d-flex">
                <div className="col-6 form-group">					
                    <button type="submit" className={"btn align-self-end px-5 submit " +styles.log_screen}
                        onClick={ event => this.user_action(event, 'login')}
                    >{this.strings[this.props.lang].login}</button>
                </div>
                <div className="col-6 form-group">					
                    <button className={"btn align-self-end px-5 " +styles.log_screen}
                        onClick={ event => this.user_action(event, 'register')}
                    >{this.strings[this.props.lang].register}</button>
                </div>
            </div>
            <div className="d-flex">
                <div id="err_message" className="col-12 text-danger"></div>
            </div>        
        </form>
      );
    }
  }

  export {LoginForm}