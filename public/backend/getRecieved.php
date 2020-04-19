<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

if(isset($_POST['id_sender']) && isset($_POST['action'])){
    //echo "TODO - DELETE";
    require('db.php'); 
    $db = new db();
    $db->connect();
    switch($_POST['action']){
        case 'getAll':
            $db->getRecieved($_POST['name'], $_POST['id_sender']);
            break;
        default:
            break;
    }
}

?>