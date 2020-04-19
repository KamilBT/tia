<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

if(isset($_POST['id_event']) && isset($_POST['action'])){
    //echo "TODO - DELETE";
    require('db.php'); 
    $db = new db();
    $db->connect();
    switch($_POST['action']){
        case 'hide':
            $db->hideEvent($_POST['id_event'], $_POST['id_user'], true);
            break;
        case 'response':
            $db->responseToEv($_POST['id_event'], $_POST['id_user'], $_POST['response']);
            break;
        default:
            break;
    }
}

?>