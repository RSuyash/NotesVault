<?php

include_once '../config.php';

$title = $_POST["title"];
$content = $_POST["content"];

$sql = "INSERT INTO content (title, content) VALUES ('$title', '$content')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>