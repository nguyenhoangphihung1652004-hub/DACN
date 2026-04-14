<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

include_once '../../config/database.php';
include_once '../../models/Deck.php';
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data) {
    http_response_code(401); exit();
}

$db = (new Database())->getConnection();
$deck = new Deck($db);
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $deck->id = $data->id;
    $deck->user_id = $user_data->id;

    try {
        $db->beginTransaction();
        
        // 1. Phủi bay toàn bộ Log rác rưởi liên quan đến các card trong deck
        $deleteLogs = $db->prepare("DELETE FROM review_logs WHERE card_id IN (SELECT id FROM cards WHERE deck_id = ?)");
        $deleteLogs->execute([$deck->id]);
        
        // 2. Chém đứt toàn bộ Thẻ con (Cards)
        $deleteCards = $db->prepare("DELETE FROM cards WHERE deck_id = ?");
        $deleteCards->execute([$deck->id]);

        // 3. Xóa sổ Bộ Thẻ cha (Decks) thông qua OOP Method có check điều kiện User ID để cấm xóa nhầm của người khác
        if ($deck->delete()) {
            $db->commit();
            http_response_code(200);
            echo json_encode(array("message" => "Đã xóa toàn bộ dữ liệu bộ thẻ và thẻ con."));
        } else {
            $db->rollBack();
            http_response_code(503);
            echo json_encode(array("message" => "Lỗi thực thi lệnh xóa, hoặc bạn không có quyền sở hữu bộ thẻ này."));
        }
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(array("message" => "Transaction sụp đổ. Đã Rollback. " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu ID bộ thẻ cần xóa."));
}
?>
