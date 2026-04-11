<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Nhận JSON từ ReactJS
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    $email_exists = $user->emailExists();

    // Đối chiếu Password gõ vào với Password đã rải băm (Hash) lưu trong DB
    if ($email_exists && password_verify($data->password, $user->password_hash)) {
        http_response_code(200);
        
        // Cấp 1 mã Token Tạm Thời (Sau này nên nâng cấp lên kĩ thuật JWT xịn hơn)
        $token = "fake-jwt-token-" . time(); 
        
        echo json_encode(
            array(
                "message" => "Đăng nhập thành công.",
                "token" => $token,
                "role" => $user->role,
                "fullname" => $user->fullname
            )
        );
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(array("message" => "Email hoặc mật khẩu không chính xác."));
    }
} else {
    http_response_code(400); // Bad request
    echo json_encode(array("message" => "Xin vui lòng điền đủ Email và Mật khẩu."));
}
?>
