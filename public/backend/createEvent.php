<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

if(isset($_POST['name']) && isset($_POST['action']) && $_POST['action'] == 'defaultEv'){
    //echo "TODO - DELETE";
    require('db.php'); 
    $db = new db();
    $db->connect();
    //(sender, ev_name, ev_location, ev_date, ev_time, ev_send_to)
    $db->createBaseEvent($_POST['name'], $_POST['id_sender'], $_POST['ev_name'], $_POST['ev_location'], $_POST['ev_date'], $_POST['ev_time'], $_POST['send_to']);
}

?>