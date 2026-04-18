<?php

/**
 * Test database connection
 */
header("Content-Type: application/json");

$host = "localhost";
$port = 3307;
$dbname = "spaced_repetition_db";
$user = "root";
$pass = "";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    $conn = new PDO($dsn, $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Test query
    $stmt = $conn->query("SELECT COUNT(*) as user_count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "message" => "Kết nối thành công!",
        "user_count" => $result['user_count']
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi kết nối: " . $e->getMessage()
    ]);
}
