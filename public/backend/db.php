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

    function createBaseEvent($sender, $sender_id, $ev_name, $ev_location, $ev_date, $ev_time, $send_to, $qs){
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
        // 3.) insert data about questions attached to event
        $q_data = json_decode($qs);
        if(sizeof($q_data) > 0){
            foreach($q_data as $item){
                $q= 'INSERT INTO `question`(`id`, `text`) 
                VALUES ("'.$item->id.'","'.$item->text.'");';
                $this->con->query($q) or die($this->con->error);

                foreach($send_data as $sender){
                    $q= 'INSERT INTO `user_event_question`(`fk_user`, `fk_event`, `fk_question`) 
                    VALUES ('.$sender->id.','. $id_event.',"'.$item->id.'");';
                    $this->con->query($q) or die($this->con->error);
                }
            }
        }
        $resp = new \stdClass();
        $resp->check = 'success';
        $resp->qcount = sizeof($q_data);
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);

    }

    function createBookingEvent($sender, $sender_id, $ev_name, $ev_location, $ev_date, $ev_time, $send_to, $iban, $price, $pricePP, $qs){
        // 1.) insert to event table
        $q= 'INSERT INTO `event`(`name`, `location`, `date`, `time`, `id_sender`) 
        VALUES ("'.$ev_name.'","'.$ev_location.'","'.$ev_date.'","'.$ev_time.'", '.$sender_id.')';
        $this->con->query($q) or die($this->con->error);
        $id_event = $this->con->insert_id;

        // 2.) insert to booking table
        $q= 'INSERT INTO `booking`(`id_event`, `iban`, `price`, `price_pp`) 
        VALUES ("'.$id_event.'","'.$iban.'",'.$price.','.$pricePP.')';
        $this->con->query($q) or die($this->con->error);
    

        // 3.) insert to user_event table based on sent_to
        $send_data = json_decode($send_to);
        //var_dump($send_data);
        foreach($send_data as $item){
            $q= 'INSERT INTO `user_event`(`id_user`, `id_event`, `response`, `dismiss`) 
            VALUES ('.$item->id.','. $id_event.', null, false);';
            $this->con->query($q) or die($this->con->error);
        }

        // 4.) insert data about questions attached to event
        $q_data = json_decode($qs);
        if(sizeof($q_data) > 0){
            foreach($q_data as $item){
                $q= 'INSERT INTO `question`(`id`, `text`) 
                VALUES ("'.$item->id.'","'.$item->text.'");';
                $this->con->query($q) or die($this->con->error);

                foreach($send_data as $sender){
                    $q= 'INSERT INTO `user_event_question`(`fk_user`, `fk_event`, `fk_question`) 
                    VALUES ('.$sender->id.','. $id_event.',"'.$item->id.'");';
                    $this->con->query($q) or die($this->con->error);
                }
            }
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
            $q= 'SELECT name, id, role as "level" from user';
            $result = $this->con->query($q) or die($this->con->error);                
            $resp->data = new \stdClass();
            $resp->data->userList = [];
            $resp->data->userListId = [];
            while($row = $result->fetch_assoc()){
                if($row['name'] === $name) {
                    $resp->data->user_id = $row['id'];
                    $resp->data->level = $row['level'];
                }
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
                $q= 'SELECT name, id, role as "level" from user';
                $result = $this->con->query($q) or die($this->con->error);                
                $resp->data = new \stdClass();
                $resp->data->userList = [];
                $resp->data->userListId = [];
                while($row = $result->fetch_assoc()){
                    if($row['name'] === $name) {
                        $resp->data->user_id = $row['id'];
                        $resp->data->level = $row['level'];
                    }
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
     * Detete user from database by name (all are unique)
     */
    function deleteUser($name){
        $q= 'DELETE FROM `user` WHERE user.name="'.$name.'"';
        $this->con->query($q) or die($this->con->error);
        $resp = new \stdClass();
        $resp->check = 'success';
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
    }

    /**
     * Detete user from database by id
     */
    function deleteUserId($id){
        $q= 'DELETE FROM `user` WHERE user.id="'.$id.'"';
        $this->con->query($q) or die($this->con->error);
        $resp = new \stdClass();
        $resp->check = 'success';
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
    }

    function getCreated($name, $id){
        $q = 'SELECT E.id, E.name, E.location, E.date, E.time, E.id_sender,
        UE.id_user, UE.id_event, UE.response, UE.dismiss, U.name as "user_name",
        B.iban, B.price, B.price_pp,
        UEQ.fk_question, UEQ.answer,
        Q.text
        FROM `event` E 
        JOIN user_event UE on E.id = UE.id_event 
        JOIN user U on UE.id_user=U.id 
        LEFT JOIN user_event_question UEQ on U.id = UEQ.fk_user AND E.id = UEQ.fk_event
        LEFT JOIN booking B on E.id = B.id_event
        LEFT JOIN question Q on UEQ.fk_question = Q.id        
        WHERE E.id_sender="'.$id.'"';
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
        /*$q = 'SELECT UE.id_event, UE.response, UE.dismiss, UE.paid, 
        E.name, E.location, E.date, E.time, 
        U.name as "sender", U.id as "sender_id",
        B.iban, B.price, B.price_pp,
        UEQ.fk_question, UEQ.answer,
        Q.text 
        FROM user_event UE 
        JOIN event E on UE.id_event = E.id 
        JOIN user U ON E.id_sender = U.id
        LEFT JOIN booking B on E.id = B.id_event
        LEFT JOIN user_event_question UEQ on U.id = UEQ.fk_user AND E.id = UEQ.fk_event
        LEFT JOIN question Q on UEQ.fk_question = Q.id    
        WHERE UE.id_user="'.$id.'"';*/
        
        $q= 'SELECT UE.id_event, UE.response, UE.dismiss, UE.paid, 
        E.name, E.location, E.date, E.time, 
        U.name as "sender", U.id as "sender_id",
        B.iban, B.price, B.price_pp,
        UEQ.fk_question, UEQ.answer,
        Q.text 
        FROM user_event UE 
        JOIN event E on UE.id_event = E.id 
        JOIN user U ON E.id_sender = U.id
        LEFT JOIN booking B on E.id = B.id_event
        LEFT JOIN user_event_question UEQ on UE.id_user = UEQ.fk_user AND UE.id_event = UEQ.fk_event
        LEFT JOIN question Q on UEQ.fk_question = Q.id    
        WHERE UE.id_user="'.$id.'"';
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

    function setPaid($id_event, $id_user, $paid){
        $q= 'UPDATE `user_event` SET `paid`="'.$paid.'" WHERE id_user="'.$id_user.'" AND id_event="'.$id_event.'"';
        $this->con->query($q) or die($this->con->error);
        //echo $q;
        $resp = new \stdClass();
        $resp->check = 'success';
        $resp->data = new \stdClass();        
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
    }

    function setQA($id_user, $id_event, $id_q, $answer){
        $q= 'UPDATE `user_event_question` SET `answer`='.$answer.' WHERE fk_user="'.$id_user.'" AND fk_event="'.$id_event.'" AND fk_question="'.$id_q.'"';
        $this->con->query($q) or die($this->con->error);
        //echo $q;
        $resp = new \stdClass();
        $resp->check = 'success';
        $resp->data = new \stdClass();        
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
    }

    function checkUser($id_user){
        $q= 'SELECT user.role FROM `user` WHERE user.id = "'.$id_user.'"';
        $result=$this->con->query($q) or die($this->con->error);
        //echo $q;
        $resp = new \stdClass();
        $resp->check = 'success';
        $resp->data = new \stdClass();
        $resp->data->user = [];
        while($row = $result->fetch_assoc()){
            array_push($resp->data->user, $row);
        }       
        echo json_encode($resp,JSON_UNESCAPED_UNICODE);
    }
   
}

?>