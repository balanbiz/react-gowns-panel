<?php

include 'db_connect.php';
if ($conn) {
    $_POST = json_decode(file_get_contents("php://input"), true);

    $id = $_POST['id'];
    $name = $_POST['name'];
    $images = json_encode($_POST['images'], JSON_UNESCAPED_UNICODE);
    $price = $_POST['price'];
    $related = json_encode($_POST['related'], JSON_UNESCAPED_UNICODE);

    $sql = "UPDATE products
    SET name = '$name', images = '$images', price = '$price' , related = '$related'
    WHERE id='$id'";

    if (mysqli_query($conn, $sql)) {
        // success
        echo json_encode($_POST);
    } else {
        // error
        echo json_encode('Data wasnt changed in DB', mysqli_error($conn));
    }
   
} else {
    echo json_encode('DB connection error');
}