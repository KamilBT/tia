<?php

class db{
    //pripojenie na dbs
    function connect(){
      //local server
        $this->con = @mysqli_connect('localhost','root','','event_planner');
        if (!$this->con) {
        //or deployment server 
            $this->con = @mysqli_connect('localhost','root','','event_planner');
       
            if (!$this->con) {
                die('Could not connect to MySQL: ' . mysqli_error()); 
            }
            else {
                $this->con->set_charset("utf8");
            }
        }
        else {
            $this->con->set_charset("utf8");
        }
    }

    function createBaseEvent($sender, $sender_id, $ev_name, $ev_location, $ev_date, $ev_time, $send_to){
        // 1.) insert to event table
        $q= 'INSERT INTO `event`(`name`, `location`, `date`, `time`, `id_sender`) 
        VALUES ("'.$ev_name.'","'.$ev_location.'","'.$ev_date.'","'.$ev_time.'", '.$sender_id.')';
        $this->con->query($q) or die($this->con->error);
        $id_event = $this->con->insert_id;
        // 2.) insert to user_event table based on sent_to
        $send_data = json_decode($send_to);
        //var_dump($send_data);
        foreach($send_data as $item){
            $q= 'INSERT INTO `user_event`(`id_user`, `id_event`, `response`, `dismiss`) 
            VALUES ('.$item->id.','. $id_event.', null, false);';
            $this->con->query($q) or die($this->con->error);
        }
        $resp = new \stdClass();
        $resp->check = 'success';
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);

    }

    /**
     * Register user function, using sha512 hash + salt.
     */
    function registerUser($name, $pass){
        $q= 'SELECT COUNT(name) as "in_data" from user WHERE name="'.$name.'"';
        $result = $this->con->query($q) or die($this->con->error);
        $data=[];
        while($row = $result->fetch_assoc()){
            array_push($data, $row);
        }
        //print("<pre>".print_r($data,true)."</pre>");
        if($data[0]['in_data'] != 0){
            //already in database
            $resp = new \stdClass();
            $resp->check = 'taken';
            $resp->data= '{}';
            echo json_encode($resp,JSON_UNESCAPED_UNICODE);
        }
        else{
            //put to db
            $salt = $this->getSalt();
            $hash = $pass.$salt;
            $hash = hash('sha512', $hash);
            $q= 'INSERT INTO `user`(`name`, `pass`, `role`, `salt`) VALUES ("'.$name.'","'.$hash.'",1, "'.$salt.'")';
            $this->con->query($q) or die($this->con->error);
            $resp = new \stdClass();
            $resp->check = 'success';
            
            //get user list
            $q= 'SELECT name, id from user';
            $result = $this->con->query($q) or die($this->con->error);                
            $resp->data = new \stdClass();
            $resp->data->userList = [];
            $resp->data->userListId = [];
            while($row = $result->fetch_assoc()){
                if($row['name'] === $name) $resp->data->user_id = $row['id'];
                else{
                    array_push($resp->data->userList, $row['name']);
                    array_push($resp->data->userListId, $row['id']);
                }
            }               
                
            echo json_encode($resp,JSON_UNESCAPED_UNICODE);
        }        
    }

    /**
     * Register user function, using sha512 hash + salt.
     */
    function changePass($name, $old_pass, $new_pass){
        //spracovanie hesla
        $q= 'SELECT pass, salt from user WHERE name="'.$name.'"';
        $result = $this->con->query($q) or die($this->con->error);
        $data=[];
        while($row = $result->fetch_assoc()){
            array_push($data, $row);
        }      
        //print("<pre>".print_r($data,true)."</pre>");
        if(sizeof($data) == 0){            
            $resp = new \stdClass();
            $resp->check = 'wrong';
            $resp->data= '{}';
            echo json_encode($resp,JSON_UNESCAPED_UNICODE);
        }
        else{
            $check = hash('sha512', $old_pass.$data[0]['salt']);
            if($check === $data[0]['pass']){
                // new password
                $salt = $this->getSalt();
                $hash = $new_pass.$salt;
                $hash = hash('sha512', $hash);
                $q= 'UPDATE `user` SET `pass`="'.$hash.'",`salt`="'.$salt.'" WHERE user.name="'.$name.'"';
                $this->con->query($q) or die($this->con->error);
                $resp = new \stdClass();
                $resp->check = 'success';
                $resp->data= '{}';
               

                echo json_encode($resp,JSON_UNESCAPED_UNICODE);
            }
            else{
                //fail password
                $resp = new \stdClass();
                $resp->check = 'wrong';
                $resp->data= '{}';
                echo json_encode($resp,JSON_UNESCAPED_UNICODE);

            }  
        }        
    }

    /**
     * Login function, using sha512 hash + salt
     */
    function loginUser($name, $pass){
        //spracovanie hesla
        $q= 'SELECT pass, salt from user WHERE name="'.$name.'"';
        $result = $this->con->query($q) or die($this->con->error);
        $data=[];
        while($row = $result->fetch_assoc()){
            array_push($data, $row);
        }      
        //print("<pre>".print_r($data,true)."</pre>");
        if(sizeof($data) == 0){            
            $resp = new \stdClass();
            $resp->check = 'wrong';
            $resp->data= '{}';
            echo json_encode($resp,JSON_UNESCAPED_UNICODE);
        }
        else{
            $check = hash('sha512', $pass.$data[0]['salt']);
            if($check === $data[0]['pass']){
                $resp = new \stdClass();
                $resp->check = 'success';
                
                // retrieve user data
                //DONE-CREATE EVENTS, TODO - EVENTS
                $q= 'SELECT name, id from user';
                $result = $this->con->query($q) or die($this->con->error);                
                $resp->data = new \stdClass();
                $resp->data->userList = [];
                $resp->data->userListId = [];
                while($row = $result->fetch_assoc()){
                    if($row['name'] === $name) $resp->data->user_id = $row['id'];
                    else{
                        array_push($resp->data->userList, $row['name']);
                        array_push($resp->data->userListId, $row['id']);
                    }
                }  
            
                echo json_encode($resp,JSON_UNESCAPED_UNICODE);
            }
            else{
                //fail password
                $resp = new \stdClass();
                $resp->check = 'wrong';
                $resp->data= new \stdClass();
                echo json_encode($resp,JSON_UNESCAPED_UNICODE);

            }        
        }        
    }

    /**
     * Detete user from database
     */
    function deleteUser($name){
        $q= 'DELETE FROM `user` WHERE user.name="'.$name.'"';
        $this->con->query($q) or die($this->con->error);
        $resp = new \stdClass();
        $resp->check = 'success';
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
    }

    function getCreated($name, $id){
        $q = 'SELECT event.id, event.name, event.location, event.date, event.time, event.id_sender,
        user_event.id_user, user_event.id_event, user_event.response, user_event.dismiss, user.name as "user_name" 
        FROM `event` JOIN user_event on event.id = user_event.id_event 
        JOIN user on user_event.id_user=user.id 
        WHERE event.id_sender="'.$id.'"';
        $result = $this->con->query($q) or die($this->con->error);   
        
        $resp = new \stdClass();
        $resp->check = 'success';

        $resp->data = new \stdClass();
        $resp->data->events = [];
        while($row = $result->fetch_assoc()){
            /*if(!property_exists($resp->data, $row['id_event'])){
                //create new if object with event data is not present
            }*/
            array_push($resp->data->events, $row);
        }
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
    }


    function getRecieved($name, $id){
        $q = 'SELECT user_event.id_event, user_event.response, user_event.dismiss, 
        event.name, event.location, event.date, event.time, user.name as "sender", user.id as "sender_id" FROM user_event 
        JOIN event on user_event.id_event = event.id 
        JOIN user ON event.id_sender = user.id 
        WHERE user_event.id_user="'.$id.'"';   
        $result = $this->con->query($q) or die($this->con->error);   
        
        $resp = new \stdClass();
        $resp->check = 'success';

        $resp->data = new \stdClass();
        $resp->data->events = [];
        while($row = $result->fetch_assoc()){
            array_push($resp->data->events, $row);
        }
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
    }

    /**
     *  basic generator for salt
     */
    function getSalt() {
        $charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789][{}:?.>,<!@#$%^&*()-_=+|';
        $randStringLen = 64;
   
        $randString = "";
        for ($i = 0; $i < $randStringLen; $i++) {
            $randString .= $charset[mt_rand(0, strlen($charset) - 1)];
        }
   
        return $randString;
   }

   function hideEvent($id_event, $id_user, $bool){
        $q= 'UPDATE `user_event` SET `dismiss`="'.$bool.'" WHERE id_user="'.$id_user.'" AND id_event="'.$id_event.'"';
        $this->con->query($q) or die($this->con->error);
        $resp = new \stdClass();
        $resp->check = 'success';
        $resp->data = new \stdClass();
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
   }
   
   function responseToEv($id_event, $id_user, $resp){
        $q= 'UPDATE `user_event` SET `response`="'.$resp.'" WHERE id_user="'.$id_user.'" AND id_event="'.$id_event.'"';
        $this->con->query($q) or die($this->con->error);
        $resp = new \stdClass();
        $resp->check = 'success';
        $resp->data = new \stdClass();
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
    }
   
}

?>