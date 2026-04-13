<?php
class JWT
{
    // Chìa khóa bí mật để đánh dấu và ký Token (Tuyệt đối không để lộ cái này nếu Public web)
    private static $secret_key = "Gia_Bao_Mat_Danh_Cho_SpacedRepetition_!@#$";

    public static function encode($payload)
    {
        // 1. Tạo Header
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        // 2. Chuyển Dữ Liệu mảng (Payload) thành chuỗi siêu văn bản JSON
        $payload_json = json_encode($payload);
        
        // 3. Mã hóa Base64URL để đảm bảo an toàn kí tự khi truyền qua HTTP API
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload_json));
        
        // 4. Ký (Sign) thuật toán HMAC SHA256 dựa vào Secret Key
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        // 5. Gắn 3 cục Header.Payload.Signature lại thành Token chuẩn quốc tế
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function validate($jwt)
    {
        // Cắt khúc Token ra thành 3 mảng
        $tokenParts = explode('.', $jwt);
        if (count($tokenParts) != 3) {
            return false;
        }

        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1]);
        $signature_provided = $tokenParts[2];
        
        // Lấy Header và Payload do Client gửi, giả vờ Băm lại 1 lần nữa ở Server
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        // Nếu cục Băm ở Server TRÙNG KHỚP Y XÌ với cục Băm mà Client đưa -> Token CHUẨN XỊN chưa bị Edit gian lận
        if ($base64UrlSignature === $signature_provided) {
            $payloadObj = json_decode($payload);
            // Kiểm tra Token đã hết Hạn Dùng (Expire - exp) chưa
            if (isset($payloadObj->exp) && $payloadObj->exp < time()) {
                return false; // Pháo bông đã tàn
            }
            return $payloadObj;
        }
        // Phát hiện bị chọc ngoáy Token giả
        return false;
    }
}
?>
