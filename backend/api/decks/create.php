<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

include_once '../../config/database.php';
include_once '../../models/Deck.php';
include_once '../../config/jwt_helper.php';

// Tường Lửa chống phá hoại Database
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data) {
    http_response_code(401);
    echo json_encode(["message" => "Không có quyền Thêm Bộ thẻ. Token giả mạo."]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$deck = new Deck($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->title)) {
    // Cài ID Chủ sở hữu cứng từ ruột Token, tuyệt đối ko lấy qua file JSON Input (đề phòng chiếm đoạt)
    $deck->user_id = $user_data->id;
    $deck->title = $data->title;
    $deck->description = !empty($data->description) ? $data->description : "";
    $deck->is_public = !empty($data->is_public) ? 1 : 0;
    
    if ($deck->create()) {
        http_response_code(201); // 201 Created
        echo json_encode(array("message" => "Tạo bộ thẻ mới thành công.", "id" => $deck->id));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Không thể tạo bộ thẻ, truy vấn thất bại."));
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Bắt buộc phải lấp đầy Tiêu đề của Bộ thẻ."));
}
?>
