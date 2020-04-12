import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.new_user = this.new_user.bind(this);
        //zamyslal som sa aj nad lokalizaciou, a tento model je celkom fajn
        this.strings ={
            sk:{
                name: 'meno',
                pass: 'heslo',
                login: 'prihlásiť',
                register: 'registrácia'
            },
            en:{
                name: 'name',
                pass: 'password',
                login: 'login',
                register: 'register'
            }
        };
        this.lang = this.setSupportedLang();
        this.state = { 
            name: null
        };
    }
    //osetrenie lang pre podporovane jazyky
    setSupportedLang(){
        let lang = navigator.language.substring(0, 2);
        let supported = ['sk', 'en'];
        if(!supported.includes(lang)) lang='en';
        return lang
    }

    new_user(e) {
        e.preventDefault();
        console.log();
        $.ajax({
            type: 'post',
            url: 'backend/register.php',
            data: $("#loginForm").serialize(),
            success: function (response) {    
                console.log(response);             
            }
          });
       // $("#loginForm").fadeOut();
    }
  
    render() {
      return (      
        <form id="loginForm" className="mx-auto">
            <div className="col-12 form-group">                			
                <input type="text" id="input_mail" name="name" className="form-control" placeholder={this.strings[this.lang].name} />					
            </div>
            <div className="col-12 form-group">					
                <input type="password" id="input_phone" name="pass" className="form-control" placeholder={this.strings[this.lang].pass} />
            </div>
            <div className="d-flex">
                <div className="col-6 form-group">					
                    <button type="submit" className={"btn align-self-end px-5 submit " +styles.log_screen}>{this.strings[this.lang].login}</button>
                </div>
                <div className="col-6 form-group">					
                    <button className={"btn align-self-end px-5 " +styles.log_screen}
                        onClick={this.new_user}
                    >{this.strings[this.lang].register}</button>
                </div>
            </div>        
        </form>
      );
    }
  }

  export {LoginForm}