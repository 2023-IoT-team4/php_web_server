<?php
use PhpMqtt\Client\ConnectionSettings;

require 'vendor/autoload.php';
include 'desired.php';

use PhpMqtt\Client\Exceptions\MqttClientException;
use PhpMqtt\Client\MqttClient;

// 에러 출력
error_reporting(E_ALL);
ini_set("display_errors", 1);

$topic_msg = "";
$bpublished = 0;

header("Content-Type:application/json");

try {

    $client = connect_client();

    $client->subscribe('$aws/things/webserver_thing/shadow/get/accepted', function ($topic, $message) use ($client, &$topic_msg) {
        $topic_msg = $message;
        $client->interrupt();
    });

    // $client->registerPublishEventHandler()

    $published_time = 0;
    $bresend = 0;
    $client->registerLoopEventHandler(function (MqttClient $client, float $elapsedTime) use ($published_time, &$bpublished, &$bresend) {
        if ($bpublished == 0) {
            // 처음 publish할 때
            $published_time = $elapsedTime;
            $bpublished = 1;
            // $client->publish('$aws/things/webserver_thing/shadow/get', '{"msg" : "get from php"}', MqttClient::QOS_AT_MOST_ONCE);
            $client->publish('$aws/things/webserver_thing/shadow/get', '{"msg" : "get from php"}', MqttClient::QOS_AT_MOST_ONCE);
        }
        if ($elapsedTime - $published_time >= 0.1 && !$bresend) {
            // resend
            $bresend = 1;
            $client->publish('$aws/things/webserver_thing/shadow/get', '{"msg" : "get from php"}', MqttClient::QOS_AT_MOST_ONCE);
        }
        if ($elapsedTime > 10) {
            // timeout
            $client->interrupt();
        }
    });


    $client->loop(true);
    $client->disconnect();
    echo $topic_msg;
} catch (MqttClientException $e) {
    echo '{"msg" : "error"}';
}
?>
