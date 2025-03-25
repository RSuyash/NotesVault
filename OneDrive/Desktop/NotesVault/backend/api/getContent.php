<?php

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
  echo "0 results";
}
$conn->close();

?>