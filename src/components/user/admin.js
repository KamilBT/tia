import React from 'react';
//vlastne ccs/scss musi mat v nazve .module, inak nacitanie failne ...
import styles from '../shared.module.scss';
import $ from 'jquery';
import icon_back from '../../images/back.svg';
import { UserList } from './userList.js';

class AdminScreen extends React.Component {

  constructor(props) {
        super(props);
        //methods
        this.deleteUser = this.deleteUser.bind(this);
        this.updateSelected = this.updateSelected.bind(this);
        this.state ={
          selected: ""
        }
        //localization
        this.strings ={
            sk:{
                title: 'Admin panel',
                back: 'Naspäť',
                change: 'Zmena hesla',
                delete: 'Zmaž účet',
                sure: 'Naozaj chete vymazať konto?',
                no: 'Nie',
                yes: 'Áno'
            },
            en:{
                title: 'Admin panel',
                back: 'Return',
                change: 'Change password',
                delete: 'Delete account',
                sure: 'Are you sure?',
                no: 'No',
                yes: 'Yes'
            }
        };
    }

    /**
     * Open window to change password
     */
    openPassWindow(){
      $("#changePass").fadeIn();
    }

    /**
     * Ajax for deleting account
     */
    deleteCheck(id_user){
      $("#delete_check_user").fadeIn();
      console.log(this);
      this.updateSelected(id_user);
    }

    /**
     * Just fade out for check window
     */
    hideCheck(){
      $("#delete_check_user").fadeOut();
    }

    /**
     *  updates state selected id of user to delete
     */
    async updateSelected(id_user){
      await this.setState(prevState => ({
        selected: id_user
      }));
    }

    /**
     * Ajax for deleteing account
     */
    deleteUser(id_user){
      console.log("deleting account_id: " + id_user);
      let check = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      let ulist = [...this.props.user.userList];
      for(let i=0; i< ulist.length; i++){                      
        if(ulist[i].user_id === id_user) {
          ulist.splice(i,1);
          i--;
        }
      }
      //console.log(ulist);
      this.props.updateUserList(ulist);
      $.ajax({
        type: 'post',
        url: this.props.baseUrl+'/backend/deleteAcc.php',
        data: {name:id_user, action:'deleteUsrId', check:check},
        props: this.props,
        success: function (response) {
            console.log(JSON.parse(response));
            $("#delete_check_user").fadeOut();                                               
        }
      });

    }

    render() {
      //console.log(this.props);
      return (
        
        <div id="user_management" className={[styles.screen, styles.hidden].join(' ')}>
            <h2 className="text-white">{this.strings[this.props.lang].title}</h2>

            <div 
              id="delete_check_user" 
              className={['position-absolute', 'p-3', 'bg-dark', styles.content_center, styles.style_white, styles.hidden].join(' ')} 
              style={{zIndex:'5'}}
              >
              <h3>{this.strings[this.props.lang].sure}</h3>
              <div className="d-flex">
                  <div className="col-6 form-group">					
                      <button type="submit" className={"btn align-self-end px-5 submit " +styles.log_screen}
                          onClick={ this.hideCheck}
                      >{this.strings[this.props.lang].no}</button>
                  </div>
                  <div className="col-6 form-group">					
                      <button className={"btn align-self-end px-5 " +styles.log_screen}
                          onClick={e => this.deleteUser(this.state.selected, e)}
                      >{this.strings[this.props.lang].yes}</button>
                  </div>
              </div>
            </div>                            

            <div className="container">
                  <div className="row w-100">
                    <div className="d-flex col-12 py-2 bg-red">
                    <button 
                        onClick={(e) => this.props.changeScreen('home_admin', e)} 
                        className={styles.menu_btn}
                        >
                        <div className={["d-flex","mx-auto","text-white"].join(' ')}>
                        <img src={icon_back} className={["settings", styles.user_icon, styles.settings_img].join(' ')} alt="settings" />       
                        <h3 className="pl-3 align-self-center">{this.strings[this.props.lang].back}</h3>
                        </div>
                    </button>
                    </div>

                    <UserList
                      user={this.props.user} 
                      lang={this.props.lang}
                      baseUrl={this.props.baseUrl}
                      deleteCheck = {this.deleteCheck}
                      updateSelected = {this.updateSelected}
                    />
                </div>
            </div>
        </div>

      );
    }
  }

  export {AdminScreen}