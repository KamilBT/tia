import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss'; 

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.formSwap = this.formSwap.bind(this);
        this.state = { 
            name: null, 
            form: 'login' //defaultne, kedze pri otovreni stranky bude mat tuto hodnotu
        };
    }

    formSwap(e) {
        e.preventDefault();
        switch(this.state.form){
            case 'login':
                this.setState({
                    form: 'register'
                });
                break;
            case 'register':
                this.setState({
                    form: 'login'
                });
                break;
            default:
                break;
        }
        console.log(this.state.form);
    }
  
    render() {
      return (
        <div className={"container "+ styles.content_center}>
        <h2 className="text-white">Event planner</h2>
       
        <form className="mx-auto">
            <div className="col-12 form-group">					
                <input type="text" id="input_mail" name="name" className="form-control" placeholder="login" />					
            </div>
            <div className="col-12 form-group">					
                <input type="password" id="input_phone" name="phone" className="form-control" placeholder="password" />
            </div>
            <div className="d-flex">
                <div className="col-6 form-group">					
                    <button type="submit" className={"btn align-self-end px-5 submit " +styles.log_screen}>Login</button>
                </div>
                <div className="col-6 form-group">					
                    <button className={"btn align-self-end px-5 " +styles.log_screen}
                        onClick={this.formSwap}
                    >Register</button>
                </div>
            </div>        
        </form>
        </div>
      );
    }
  }

  export {LoginScreen}