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
        case 'setPaid':
            $db->setPaid($_POST['id_user'], $_POST['id_event'], $_POST['paid']);
            break;
        case 'setQA':
            $db->setQA($_POST['id_user'], $_POST['id_event'], $_POST['q_id'], $_POST['answer']);
            break;
        default:
            break;
    }
}
elseif(isset($_POST['action']) && $_POST['action'] == "checkUser") {
    require('db.php'); 
    $db = new db();
    $db->connect();
    $db->checkUser($_POST['id_user']);
}

?>