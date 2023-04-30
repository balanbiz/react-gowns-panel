<?php
    
    include 'db_connect.php';
    $products_to_send = array();

    if ($conn) {
        $_POST = json_decode(file_get_contents("php://input"), true);
        if (isset($_POST)) {

            $interval = $_POST['interval'];
            $prevIntervals = $_POST['prevIntervals'];

            $last_id_query = mysqli_query($conn, "SELECT max(id) FROM products");
            $last_id = mysqli_fetch_all($last_id_query, MYSQLI_ASSOC);
            $last_id = $last_id[0]['max(id)'];

            $id_interval_ends = $last_id - $prevIntervals;
            $id_interval_starts = $id_interval_ends - $interval + 1;

            $sql = "SELECT * FROM products where id Between $id_interval_starts and $id_interval_ends";
            $result = mysqli_query($conn, $sql);
            $products = mysqli_fetch_all($result, MYSQLI_ASSOC);

            if (count($products) !== 0) {
                for ($i=0; $i < count($products); $i++) {
                    $products[$i]['images'] = json_decode($products[$i]['images']);
                    $products[$i]['related'] = json_decode($products[$i]['related']);
                    array_push($products_to_send, $products[$i]);
                }
            }
        }
    } else {
        echo json_encode("DB connection error");
    }

    echo json_encode($products_to_send);

    /////////////////// Variant with JSON
    /* $_POST = json_decode(file_get_contents("php://input"), true);

    $page = $_POST['page'];
    echo json_encode($page);
    $arr_to_send = [];

    if ($stream = fopen("http://localhost:3001/products/", 'r')) {
       $products = json_decode(stream_get_contents($stream));
        if (count($products) != 0) {
            $products_reversed = array_reverse($products);
            $chunked_array = array_chunk($products_reversed, 12);
            echo json_encode($chunked_array[$page]);
        } else {
            echo json_encode([]);
        }
        fclose($stream);
    } */

?>