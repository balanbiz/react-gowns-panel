<?php
include 'db_connect.php';
if ($conn) {
    $_POST = json_decode(file_get_contents("php://input"), true);
    $id = $_POST['id'];
    $dir_path = "../assets/{$_POST['imageFolder']}";
    
    deleteDir($dir_path);

    $sql = "DELETE FROM products WHERE id = $id";
    mysqli_query($conn, $sql);
    $sql2 = "ALTER TABLE products DROP id";
    mysqli_query($conn, $sql2);
    $sql3 = "ALTER TABLE products ADD id INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (id), AUTO_INCREMENT=1";
    mysqli_query($conn, $sql3);
    echo json_encode($id);
} else {
    echo json_encode('DB connection error');
}

function deleteDir($dirPath) {
    if (is_dir($dirPath)) {
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
        $files = glob($dirPath . '*', GLOB_MARK);
        foreach ($files as $file) {
            if (is_dir($file)) {
               deleteDir($file);
            } else {
                unlink($file);
            }
        }
        rmdir($dirPath);
    }
}

?>