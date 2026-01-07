<?php
session_start();
require_once __DIR__ . '/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$cart_id = (int)($data['cart_id'] ?? 0);

if (!$cart_id || !isset($_SESSION['user'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректные данные']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ? AND user_id = ?");
    $deleted = $stmt->execute([$cart_id, $_SESSION['user']['id']]);
    
    echo json_encode(['success' => $deleted]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Ошибка удаления']);
}
?>