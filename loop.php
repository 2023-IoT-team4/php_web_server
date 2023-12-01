<?php

include "desired.php";
use PhpMqtt\Client\Exceptions\MqttClientException;

// 1초마다 DB에서 time을 가져와서 현재 time과 비교 후 , 시간이 지났으면 feed publish

function publish_feed($client, $amount)
{
    exec("php ./publish_feed.php " . $amount);
}

function trigger_alarm($con)
{
    $query = 'select * from alarms';
    $result = mysqli_query($con, $query);

    $payload = '';
    while ($row = mysqli_fetch_assoc($result)) {
        $alarm = substr($row['time'], 11, 5);
        $payload .= $alarm . "\n";
        if (strtotime(date('H:i', time())) == strtotime($alarm) && $row['is_given'] == 0) {
            $amount = $row['amount'];
            // is_given 1으로 
            $query = 'update alarms set is_given = 1 where time = "' . $row['time'] . '"';
            mysqli_query($con, $query);
            file_put_contents("error_log.txt", $alarm);
            return $amount;
        }
    }
    return 0;
}

$client = connect_client();
$con = mysqli_connect("127.0.0.1", "root", "142857", "iot") or die("Can't access DB");
$prevDate = strtotime(date("Y-m-d"));

while (true) {
    $curDate = strtotime(date("Y-m-d", time()));
    if ($curDate > $prevDate) {
        $prevDate = $curDate;
        $query = 'update alarms set is_given = 0;';
        mysqli_query($con, $query);
    }
    $amount = trigger_alarm($con);
    // timer 가 울릴 때가 되면 publish
    if ($amount > 0) {
        publish_feed($client, $amount);
    }
    sleep(5);
}

?>
