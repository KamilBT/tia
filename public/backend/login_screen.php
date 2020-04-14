<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

if(isset($_POST['name']) && isset($_POST['pass'])){
    //echo "TODO - register";
    require('db.php');  //prihlasovanie udaje na DB
    $db = new db();
    $db->connect();
    switch($_POST['action']){
        case 'register':
            $db->registerUser();
            break;
        case 'login':
            $db->loginUser();
    }
}

?>