<?php

include "desired.php";

$payload = '{"state" : {"reported" : {"detected": true}}}';

$client = connect_client();
$client->publish('$aws/things/webserver_thing/shadow/update', $payload);
$client->disconnect();

?>
