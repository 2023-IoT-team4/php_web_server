<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);


$con = mysqli_connect("127.0.0.1", "root", "142857", "iot") or die("Can't access DB");
$query = 'select * from galary;';
$result = mysqli_query($con, $query);
$json = array();

$count = 0;
while ($row = mysqli_fetch_assoc($result)) {
    $url = $row['url'];
    $date = $row['date'];

    $json[$count]['url'] = $url;
    $json[$count]['date'] = $date;
    $count++;
}

echo json_encode($json);

?>
