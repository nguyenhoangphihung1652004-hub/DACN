<?php
// Tránh lỗi CORS khi React (Port: 3000/5173) đẩy dữ liệu sang PHP
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gọi các file thiết yếu
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../models/User.php';

// Khởi tạo DB
$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Bắt dữ liệu JSON từ Frontend ReactJS gửi sang
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->email) && !empty($data->password)) {
    $username = trim($data->username);
    $email = $data->email;
    $password = $data->password;

    // Validate Email
    if (preg_match('/\s/', $email)) {
        http_response_code(400); echo json_encode(["message" => "Email không được chứa khoảng trắng."]); exit();
    }
    if (!str_ends_with($email, "@gmail.com")) {
        http_response_code(400); echo json_encode(["message" => "Email đăng ký bắt buộc phải là @gmail.com."]); exit();
    }
    $localPart = explode('@', $email)[0];
    if (strlen($localPart) < 5 || strlen($localPart) > 15 || strlen($email) > 254) {
        http_response_code(400); echo json_encode(["message" => "Độ dài tài khoản Email trước @ phải từ 5 đến 15 ký tự."]); exit();
    }

    // Validate Password
    if (preg_match('/\s/', $password)) {
        http_response_code(400); echo json_encode(["message" => "Mật khẩu tuyệt đối không được có khoảng trắng."]); exit();
    }
    if (strlen($password) < 10 || strlen($password) > 12) {
        http_response_code(400); echo json_encode(["message" => "Mật khẩu quy định ngặt nghèo là từ 10 đến 12 ký tự."]); exit();
    }
    // Check độ phức tạp mật khẩu: Hoa, thường, số, ký tự đặc biệt (\W_ check non-alphanumeric)
    if (!preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/\d/', $password) || !preg_match('/[\W_]/', $password)) {
        http_response_code(400); echo json_encode(["message" => "Mật khẩu phải chứa đủ 1 chữ Hoa, thường, số, ký tự đặc biệt."]); exit();
    }

    // Lọt qua cửa Ải -> nạp vào Model
    $user->email = $email;

    // Xem Email đã đụng hàng chưa
    if ($user->emailExists()) {
        http_response_code(409); // Conflict
        echo json_encode(array("message" => "Email này đã được sử dụng!"));
    } else {
        $user->username = $username;
        // Mã hóa mật khẩu bảo mật tuyệt đối
        // Bắt buộc xài PASSWORD_BCRYPT theo chuẩn đồ án CNTT hiện nay
        $user->password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        
        if ($user->create()) {
            http_response_code(201); // Created
            echo json_encode(array("message" => "Đăng ký thành công!"));
        } else {
            http_response_code(503); // Service Unavailable
            echo json_encode(array("message" => "Không thể đăng ký. Lỗi Server."));
        }
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Vui lòng nhập đầy đủ thông tin."));
}
?>
