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

    /**
     * Register user function, using sha512 hash + salt.
     */
    function registerUser(){
        $q= 'SELECT COUNT(name) as "in_data" from user WHERE name="'.$_POST['name'].'"';
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
            $hash = $_POST['pass'].$salt;
            $hash = hash('sha512', $hash);
            $q= 'INSERT INTO `user`(`name`, `pass`, `role`, `salt`) VALUES ("'.$_POST['name'].'","'.$hash.'",1, "'.$salt.'")';
            $this->con->query($q) or die($this->con->error);
            $resp = new \stdClass();
            $resp->check = 'success';
            $resp->data= '{}';
            echo json_encode($resp,JSON_UNESCAPED_UNICODE);
        }        
    }

    /**
     * Login function, using sha512 hash + salt
     */
    function loginUser(){
        //spracovanie hesla
        $q= 'SELECT pass, salt from user WHERE name="'.$_POST['name'].'"';
        $result = $this->con->query($q) or die($this->con->error);
        $data=[];
        while($row = $result->fetch_assoc()){
            array_push($data, $row);
        }      
        //print("<pre>".print_r($data,true)."</pre>");
        if(sizeof($data) == 0){
            //already in database
            $resp = new \stdClass();
            $resp->check = 'wrong';
            $resp->data= '{}';
            echo json_encode($resp,JSON_UNESCAPED_UNICODE);
        }
        else{
            $check = hash('sha512', $_POST['pass'].$data[0]['salt']);
            if($check === $data[0]['pass']){
                $resp = new \stdClass();
                $resp->check = 'success';
                $resp->data= '{}';
                // retrieve user data
                /*$q= 'INSERT INTO `user`(`name`, `pass`, `role`) VALUES ("'.$_POST['name'].'","'.$_POST['pass'].'",1)';
                $this->con->query($q) or die($this->con->error);*/
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
}

?>