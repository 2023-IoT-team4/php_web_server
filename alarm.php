<?php

$con = mysqli_connect("127.0.0.1", "root", "142857", "iot") or die("Can't access DB");

// 컨텐츠 타입이 JSON 인지 확인한다
if (!in_array('application/json', explode(';', $_SERVER['CONTENT_TYPE']))) {
    echo json_encode(array('result_code' => '400'));
    exit;
}

$rawBody = file_get_contents("php://input"); // 본문을 불러옴
$rawBody = json_decode($rawBody);


$hour = $rawBody->{"alarmHour"};
$minute = $rawBody->{"alarmMinute"};
$amount = (int) $rawBody->{"alarmAmount"};

// erase 명령인지 확인
$bErase = $rawBody->{"bErase"};

if ($bErase == true) {
    $query = 'delete from alarms where time like "%' . $hour . ':' . $minute . ':00' . '";';
    $result = mysqli_query($con, $query);
} else {


    // 이미 알람이 있는지 확인
    $query = 'select * from alarms;';
    $result = mysqli_query($con, $query);


    $alarms = [];

    $log = '';

    while ($row = mysqli_fetch_assoc($result)) {
        array_push($alarms, $row['time']);
    }

    $bNewAlarm = 1;

    for ($i = 0; $i < count($alarms); $i++) {
        $temp_hour = $alarms[$i][11] . $alarms[$i][12];
        $temp_minute = $alarms[$i][14] . $alarms[$i][15];

        // 이미 알람이 존재하면 flag값 false
        if ($hour == $temp_hour && $minute == $temp_minute) {
            $bNewAlarm = 0;
            break;
        }
    }

    // 새로운 알람이면 DB에 insert
    if ($bNewAlarm) {
        $query = 'insert into alarms values("' . date("Y-m-d") . ' ' . $hour . ':' . $minute . ':00", ' . $amount . ', 0);';
        $result = mysqli_query($con, $query);
    }
}

echo '{"시" : "' . $hour . '", "분" : "' . $minute . '"}';

?>