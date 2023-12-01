<?php
use PhpMqtt\Client\ConnectionSettings;

// 에러 출력
error_reporting(E_ALL);
ini_set("display_errors", 1);

// declare(strict_types=1);

require 'vendor/autoload.php';
// require __DIR__ . 'shared/config.php';

// use PhpMqtt\Client\Examples\Shared\SimpleLogger;
use PhpMqtt\Client\Exceptions\MqttClientException;
use PhpMqtt\Client\MqttClient;

// Create an instance of a PSR-3 compliant logger. For this example, we will also use the logger to log exceptions.
// $logger = new SimpleLogger(LogLevel::INFO);

$topic_msg = 'default';

function connect_client()
{
    // Create a new instance of an MQTT client and configure it to use the shared broker host and port.
    $client = new MqttClient("<ARN 주소>", 8883, 'test-publisher', MqttClient::MQTT_3_1, null, null);

    //connection settings
    $connectionSettings = (new ConnectionSettings)
        ->setUseTls(true)
        ->setTlsSelfSignedAllowed(true)
        ->setTlsClientCertificateFile("cert file name")
        ->setTlsClientCertificateKeyFile("private key file name");


    // Connect to the broker without specific connection settings but with a clean session.
    $client->connect($connectionSettings, true);
    return $client;
}



if (isset($_POST['led'])) {
    try {
        // Create a new instance of an MQTT client and configure it to use the shared broker host and port.
        $client = connect_client();

        $client->publish('$aws/things/webserver_thing/shadow/update', '{"state" : {"desired" : {"led" : "' . $_POST['led'] . '" }}}', MqttClient::QOS_AT_MOST_ONCE);

    } catch (MqttClientException $e) {
        file_put_contents("error_log.txt", $e);
        echo $e;
    } finally {
        $client->disconnect();
        header("Location: /iot");
        exit();
    }

}

if (isset($_POST['msg'])) {
    echo "yes";

    header("Location: /iot");
    exit();
}

?>
