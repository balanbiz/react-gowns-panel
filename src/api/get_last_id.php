<?php

include 'db_connect.php';
if ($conn) {
    
    $random_value;
    $cycle_stop = 0;

    $last_id_query = mysqli_query($conn, "SELECT max(id) FROM products");
    $last_id = mysqli_fetch_all($last_id_query, MYSQLI_ASSOC);
    $last_id = $last_id[0]['max(id)'];

    $image_folders_query = mysqli_query($conn, "SELECT imageFolder FROM products");
    $image_folders = mysqli_fetch_all($image_folders_query, MYSQLI_ASSOC);

    function add_folders_uniqueId($image_folders, $cycle_stop) {

        if (count($image_folders) !== 0) {
            
            $random_value = rand(100000, 999999);
            $checkedAll = FALSE;

            for ($i=0; $i < count($image_folders); $i++) { 
                if ($random_value === (int)$image_folders[$i]['imageFolder']) {
                    if ($cycle_stop === 10) {
                        echo "Something wrong with setting unique folder id";
                    } else {
                        $cycle_stop += 1;
                        add_folders_uniqueId($image_folders, $cycle_stop);
                    }
                } elseif ($i === count($image_folders) -1 ) {
                    $checkedAll = TRUE;
                }
            }

            if ($checkedAll) {
                return $random_value;
            }
        } else {
            return 000001;
        }
    }

    $obj_to_send = [
        'id' => (int)$last_id,
        'imageFolder' => add_folders_uniqueId($image_folders, $cycle_stop),
        'memoryLeft' => disk_free_space("/")
    ];

    echo json_encode($obj_to_send);
} else {
    echo json_encode('DB connection error');
}