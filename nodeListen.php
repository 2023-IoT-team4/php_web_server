<?php

include "desired.php";
use PhpMqtt\Client\Exceptions\MqttClientException;

error_reporting(E_ALL);
ini_set("display_errors", 1);

// 컨텐츠 타입이 JSON 인지 확인한다
// if (!in_array('application/json', explode(';', $_SERVER['CONTENT_TYPE']))) {
//     echo json_encode(array('result_code' => '400'));
//     exit;
// }

$rawBody = file_get_contents("php://input"); // 본문을 불러옴
$rawBody = json_decode($rawBody);

$img = $rawBody->{"img"};
$detected = $rawBody->{"detected"};

if($detected != true) {
    echo '{"result" : false}';
    exit;
}

if($img != null) {
    // save img to database;
    $con = mysqli_connect("127.0.0.1", "root", "142857", "iot") or die("Can't access DB");
    $query = 'insert into galary(url, date) values ("'.$img.'", "'.date('Y-m-d H-i-s', time()).'");';
    mysqli_query($con, $query);
    mysqli_close($con);
}

$cur = intval(date(time()));
$prev = intval(file_get_contents("recent_published.txt"));

if($cur - $prev >=  10 * 60) {
    // publish data
    file_put_contents("recent_published.txt", $cur);
    exec("php ./publish_detected.php");
}


echo '{"result" : true}';
?>
