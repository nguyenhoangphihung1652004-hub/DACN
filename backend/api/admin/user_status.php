<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data || ($user_data->role ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden']);
    exit();
}

$db = (new Database())->getConnection();

function hasColumn($db, $table, $column)
{
    $stmt = $db->prepare("SHOW COLUMNS FROM `$table` LIKE ?");
    $stmt->execute([$column]);
    return $stmt->rowCount() > 0;
}

function ensureStatusColumn($db)
{
    if (!hasColumn($db, 'users', 'status')) {
        $db->exec("ALTER TABLE users ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'active'");
    }
}

$payload = json_decode(file_get_contents('php://input'), true);
$userId = $payload['userId'] ?? null;
$status = $payload['status'] ?? null;

if (!$userId || !in_array($status, ['active', 'banned'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Dữ liệu không hợp lệ']);
    exit();
}

try {
    ensureStatusColumn($db);

    $stmt = $db->prepare("UPDATE users SET status = ? WHERE id = ?");
    $stmt->execute([$status, $userId]);

    http_response_code(200);
    echo json_encode(['message' => 'Cập nhật trạng thái tài khoản thành công']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Không thể cập nhật trạng thái tài khoản']);
}
