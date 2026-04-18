<?php

/**
 * Cron Job: Gửi email nhắc nhở ôn tập hàng ngày
 * Chạy: mỗi ngày vào lúc 7h sáng
 * Cấu hình cron: 0 7 * * * php /path/to/backend/api/cron/send_reminder_emails.php
 */

header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../config/email_config.php';

$db = (new Database())->getConnection();
$config = getEmailConfig();

if (empty($config['username']) || empty($config['password'])) {
    echo json_encode(["status" => "error", "message" => "Email configuration missing"]);
    exit;
}

try {
    $query = "SELECT DISTINCT u.id, u.email, u.username, 
              COUNT(c.id) as due_count,
              GROUP_CONCAT(DISTINCT d.title SEPARATOR ', ') as deck_names
              FROM users u
              JOIN decks d ON d.user_id = u.id
              JOIN cards c ON c.deck_id = d.id
              WHERE c.next_review_date <= CURDATE() 
              AND u.status = 'active'
              AND u.role = 'learner'
              GROUP BY u.id, u.email, u.username";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $sentCount = 0;
    $failedCount = 0;
    $results = [];

    $reviewUrl = $_ENV['APP_URL'] ?? "http://localhost:5173/review";

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $userEmail = $row['email'];
        $userName = $row['username'];
        $dueCount = $row['due_count'];
        $deckNames = $row['deck_names'];

        $subject = "🔔 Bạn có $dueCount thẻ cần ôn tập hôm nay!";

        $body = getReminderEmailBody($userName, $dueCount, $deckNames, $reviewUrl);

        $result = sendEmail($userEmail, $userName, $subject, $body);

        if ($result) {
            $sentCount++;
            $results[] = ["email" => $userEmail, "status" => "sent"];
        } else {
            $failedCount++;
            $results[] = ["email" => $userEmail, "status" => "failed"];
        }
    }

    echo json_encode([
        "status" => "success",
        "total" => $stmt->rowCount(),
        "sent" => $sentCount,
        "failed" => $failedCount
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}