<?php 
// 에러 출력
error_reporting(E_ALL);
ini_set("display_errors", 1);
include "desired.php";

if (isset($_GET['amount'])) {
    $client = connect_client();
    $amount = intval($_GET['amount']);

    $payload = '{"state": {"reported" : {"feed": ' . $amount . '}}}';

    $client->publish('$aws/things/webserver_thing/shadow/update', $payload);
    $client->disconnect();

    echo 'success';
    exit;
}

if ($argc == 2) {
    $amount = $argv[1];
    $client = connect_client();

    $payload = '{"state": {"reported" : {"feed": ' . $amount . '}}}';

    $client->publish('$aws/things/webserver_thing/shadow/update', $payload);
    $client->disconnect();
    file_put_contents("error_log.txt", $payload);
}
?>

