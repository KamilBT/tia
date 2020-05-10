import React from 'react';
import styles from '../shared.module.scss';

class UserList extends React.Component {

  constructor(props) {
        super(props);
        //localization
        this.strings ={
            sk:{
                answered: 'Zatiaľ bez odpovede.',
                yes: 'Áno',
                no: 'Nie',
                delete: 'Zmaž účet'
            },
            en:{
                answered: 'Not answered yet.',
                yes: 'Yes',
                no: 'No',
                delete: 'Delete account'
            }
        };

    }


    render() {    
    
    const userList = this.props.user.userList;
    //console.log(questions);
        
      return ( 
          <div className="container">
            { userList != null && userList.map((item) => {
                //console.log(item);
                return (
                <div className={["row"].join(' ')} key={"user-"+item.user_id}>                       
                    <span className={["text-white", "text-center", "col-9"].join(' ')} >
                        {item.label}                       
                    </span>
                    <div className="d-flex col-3 px-0 alegin-self-center">
                        <button className={[styles.menu, styles.eventAction, "float-right"].join(' ')}
                            onClick={e => this.props.deleteCheck(item.user_id,e)}                        
                        >
                            {this.strings[this.props.lang].delete}                        
                        </button>
                    </div>
                    
                   <div className={["col-12", "mx-auto", "my-2", styles.style_white].join(' ')} >                        
                    </div>                 
                </div>                
                )
            })}
          </div>
      );
    }
  }

  export {UserList}