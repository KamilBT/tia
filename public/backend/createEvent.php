<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

if(isset($_POST['name']) && isset($_POST['action']) && isset($_POST['action'])){
    //echo "TODO - DELETE";
    require('db.php'); 
    $db = new db();
    $db->connect();

    switch($_POST['action']){
        case 'defaultEv':
            //(sender, ev_name, ev_location, ev_date, ev_time, ev_send_to)
             $db->createBaseEvent($_POST['name'], $_POST['id_sender'], $_POST['ev_name'], $_POST['ev_location'], $_POST['ev_date'], $_POST['ev_time'], $_POST['send_to'], $_POST['quetions']);
        break;
        case 'bookingEv':
            //(sender, ev_name, ev_location, ev_date, ev_time, ev_send_to)
            $db->createBookingEvent($_POST['name'], $_POST['id_sender'], $_POST['ev_name'], $_POST['ev_location'], $_POST['ev_date'], $_POST['ev_time'], $_POST['send_to'], $_POST['ev_iban'], $_POST['ev_price'], $_POST['ev_pricePer'], $_POST['quetions']); 
    }
    
}

?>