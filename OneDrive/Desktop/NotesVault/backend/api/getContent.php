<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config.php';

$sql = "SELECT * FROM content";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $content = array();
    while($row = $result->fetch_assoc()) {
        $content[] = $row;
    }
    echo json_encode($content);
} else {
    echo json_encode(array("message" => "No content found."));
}
$conn->close();
?>