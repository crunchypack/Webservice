<?php
/**
 * WEB SERVICE Workout
 * By Simon Lobo
 */

 // get the Method, request and input
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'), true);
// Check for correct request
if($request[0] != "logs"){
    http_response_code(404);
    exit();
}
// set headertype
header("Content-Type: application/json; charset=UTF-8");
// establich database connection
$connection = mysqli_connect("localhost", "simon", "GrandApple", "workout") or die ("Error");
// Depending on method prepare sql statement
switch($method){
    //In case of GET
    case "GET":
        // If no other request select all from table
        $sql = "SELECT * FROM log ORDER BY day DESC";
        // If second request exist
        if (isset($request[1])) {
            if(is_numeric($request[1])){
                $sql = "SELECT * FROM log WHERE id = ". $request[1]. ";";
            }
            else{
                $sql = "SELECT * FROM log WHERE exercise = '". $request[1]."' ORDER BY day;";
            }
            // If third and fourth request exists
            if (isset($request[2]) && isset($request[3]) && !is_numeric($request[1])){
                $d1 = $request[2];
                $d2 = $request[3];
                $ex = $request[1];
                if($request[1] == "all"){
                    $sql = "SELECT * FROM log WHERE day BETWEEN '" . $d1 . "' AND '" . $d2 . "' ORDER BY day;";
                }else{
                    $sql = "SELECT * FROM log WHERE day BETWEEN '".$d1."' AND '".$d2."' AND exercise = '".$ex."' ORDER BY day;";
                }
                
            }
        }
        
        break;
    // In case of PUT. Prepare and execute UPDATE sql statement
    case "PUT":
        $st = $connection->prepare('UPDATE log SET day = ?, exercise = ?, duration = ?, distance = ?, notes = ? WHERE id = ?');
        $st->bind_param('sssdsi',$input['day'],$input['exercise'],$input['duration'],$input['distance'],$input['notes'], $request[1]);
        $st->execute();
        break;
    // In case of POST. Prepare and execute INSERT sql statement
    case "POST":
        $st = $connection->prepare('INSERT INTO log(day,exercise,duration,distance,notes) VALUES(?,?,?,?,?)');
        $st->bind_param('sssds', $input['day'],$input['exercise'],$input['duration'],$input['distance'],$input['notes']);
        $st->execute();
        break;
    // In case of DELETE. Prepare and execute DELETE sql statement
    case "DELETE":
        $st = $connection->prepare('DELETE FROM log WHERE id = ?');
        $st->bind_param('i', $request[1]);
        $st->execute();
        break;

}


$arr = [];
// If no method is given. SELECT all from table 
if($method != "GET") $sql = "SELECT * FROM log ORDER BY day DESC";
// execute query
$res = mysqli_query($connection, $sql) or die (mysqli_error($connection));
// fetch result
while($row = mysqli_fetch_assoc($res)){
    $row_arr['id'] = $row['id'];
    $row_arr['day'] = $row['day'];
    $row_arr['exercise'] = $row['exercise'];
    $row_arr['duration'] = $row['duration'];
    $row_arr['distance'] = $row['distance'];
    $row_arr['notes'] = $row['notes'];
    // Store in array
    array_push($arr, $row_arr);
}
// Close connection
mysqli_close($connection);
// Echo out array in JSON
echo json_encode($arr);