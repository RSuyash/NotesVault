<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config.php';

$title = $_POST["title"];
$content = $_POST["content"];

$sql = "INSERT INTO content (title, content) VALUES ('$title', '$content')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("message" => "New record created successfully."));
} else {
    echo json_encode(array("message" => "Error: " . $sql . "<br>" . $conn->error));
}

$conn->close();

?>