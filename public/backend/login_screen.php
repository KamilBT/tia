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
            $db->registerUser($_POST['name'], $_POST['pass']);
            break;
        case 'login':
            $db->loginUser($_POST['name'], $_POST['pass']);
            break;
    }
}

else if(isset($_POST['name']) && isset($_POST['old_pass']) && isset($_POST['new_pass'])){
    //echo "TODO - register";
    require('db.php');  //prihlasovanie udaje na DB
    $db = new db();
    $db->connect();
    switch($_POST['action']){
        case 'change_pass':
            $db->changePass($_POST['name'], $_POST['old_pass'], $_POST['new_pass']);
            break;
    }
}

?>