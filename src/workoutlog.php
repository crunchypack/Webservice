<?php
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'), true);

if($request[0] != "logs"){
    http_response_code(404);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

$connection = mysqli_connect("localhost", "root", "", "workout") or die ("Error");

switch($method){
    case "GET":
        $sql = "SELECT id, day, exercise, duration, distance, notes FROM log";
        if (isset($request[1])) $sql = $sql . " WHERE id = ". $request[1]. ";";
        break;
    case "PUT":
        $st = $connection->prepare('UPDATE log SET day = ?, exercise = ?, duration = ?, distance = ?, notes = ? WHERE id = ?');
        $st->bind_param('sssdsi',$input['day'],$input['exercise'],$input['duration'],$input['distance'],$input['notes'], $request[1]);
        $st->execute();
        break;
    case "POST":
        $st = $connection->prepare('INSERT INTO log(day,exercise,duration,distance,notes) VALUES(?,?,?,?,?)');
        $st->bind_param('sssds', $input['day'],$input['exercise'],$input['duration'],$input['distance'],$input['notes']);
        $st->execute();
        break;
    case "DELETE":
        $st = $connection->prepare('DELETE FROM log WHERE id = ?');
        $st->bind_param('i', $request[1]);
        $st->execute();
        break;

}


$arr = [];

if($method != "GET") $sql = "SELECT id, day, exercise, duration, distance, notes FROM log";
$res = mysqli_query($connection, $sql) or die (mysqli_error($connection));

while($row = mysqli_fetch_assoc($res)){
    $row_arr['id'] = $row['id'];
    $row_arr['day'] = $row['day'];
    $row_arr['exercise'] = $row['exercise'];
    $row_arr['duration'] = $row['duration'];
    $row_arr['distance'] = $row['distance'];
    $row_arr['notes'] = $row['notes'];
    array_push($arr, $row_arr);
}

mysqli_close($connection);

echo json_encode($arr);