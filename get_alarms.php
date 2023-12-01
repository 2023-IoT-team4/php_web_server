<?php
// 에러 출력
error_reporting(E_ALL);
ini_set("display_errors", 1);

$con = mysqli_connect("127.0.0.1", "root", "142857", "iot") or die("Can't access DB");
$query = 'select * from alarms;';

$result = mysqli_query($con, $query);
$json = array();


$count = 0;
while ($row = mysqli_fetch_assoc($result)) {
    $hour = substr($row['time'], 11, 2);
    $minute = substr($row['time'], 14, 2);
    $second = substr($row['time'], 17, 2);

    $amount = $row['amount'];
    $is_given = $row['is_given'];

    $json[$count]['hour'] = $hour;
    $json[$count]['minute'] = $minute;
    $json[$count]['second'] = $second;
    $json[$count]['amount'] = $amount;
    $json[$count]['is_given'] = $is_given;

    $count++;
}

echo json_encode($json);
?>
