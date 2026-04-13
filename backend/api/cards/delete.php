<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

include_once '../../config/database.php';
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
if (!JWT::validate(str_replace('Bearer ', '', $authHeader))) {
    http_response_code(401); exit();
}

$id = isset($_GET['id']) ? $_GET['id'] : die(json_encode(["message"=>"Thiếu id"]));

$db = (new Database())->getConnection();
$query = "DELETE FROM cards WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(":id", $id);

if($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Xóa thành công"]);
} else {
    http_response_code(503);
    echo json_encode(["message" => "Lỗi xóa thẻ"]);
}
?>
