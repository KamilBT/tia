<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

if(isset($_POST['name']) && isset($_POST['action']) && isset($_POST['check'])){
    //echo "TODO - DELETE";
    require('db.php'); 
    $db = new db();
    $db->connect();
    switch($_POST['action']){
        case 'deleteUsr':
            $db->deleteUser($_POST['name']);
            break;
        case 'deleteUsrId':
            $db->deleteUserId($_POST['name']);
            break;
        default:
            break;
    }
}

?>