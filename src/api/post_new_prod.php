<?php
include 'db_connect.php';
if ($conn) {
    $_POST = json_decode(file_get_contents("php://input"), true);

    $name = '';
    $likes = $price = 0;
    $images = []; $related = ["default"=>[]];

    if (isset($_POST['imageFolder'])) {
        $imageFolder = filter_var($_POST['imageFolder'], FILTER_SANITIZE_NUMBER_INT);
    }
    if (isset($_POST['name'])) {
        $name = filter_var($_POST['name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    }
    if (isset($_POST['images'])) {
        $images = json_encode($_POST['images'], JSON_UNESCAPED_UNICODE);
    } 
    if (isset($_POST['price'])) {
        $price = filter_var($_POST['price'], FILTER_SANITIZE_NUMBER_FLOAT);
    }
    if (isset($_POST['related'])) {
        $related = json_encode($_POST['related'], JSON_UNESCAPED_UNICODE);
    }
    if (isset($_POST['likes'])) {
        $likes = filter_var($_POST['likes'], FILTER_SANITIZE_NUMBER_INT);
    }
    
    $sql = "INSERT INTO products (imageFolder, name, likes, price, images, related) VALUES ('$imageFolder', '$name', '$likes', '$price', '$images', '$related')";
    if (mysqli_query($conn, $sql)) {
        // success
        echo json_encode($_POST);
    } else {
        // error
        echo json_encode('Data wasnt sent to DB', mysqli_error($conn));
    }
      

} else {
    echo json_encode('DB connection error');
}