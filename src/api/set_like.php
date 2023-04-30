<?php
include 'db_connect.php';
if ($conn) {
    $_POST = json_decode(file_get_contents("php://input"), true);
    $id = $_POST['id'];
    if (isset($_POST['operator']) && $_POST['operator'] === '+') {
        $sql = "UPDATE products SET likes = likes + 1 WHERE id = $id";
        mysqli_query($conn, $sql);
    } else if (isset($_POST['operator']) && $_POST['operator'] === '-') {
        $sql2 = "UPDATE products SET likes = likes - 1 WHERE id = $id";
        mysqli_query($conn, $sql2);
    }
  
    echo json_encode($_POST);
} else {
    echo json_encode('DB connection error');
}