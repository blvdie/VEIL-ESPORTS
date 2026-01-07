<?php
session_start();
require_once __DIR__ . '/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$cart_id = (int)($data['cart_id'] ?? 0);
$quantity = (int)($data['quantity'] ?? 1);

if (!$cart_id || $quantity < 1 || $quantity > 5 || !isset($_SESSION['user'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректные данные']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?");
    $updated = $stmt->execute([$quantity, $cart_id, $_SESSION['user']['id']]);
    
    if ($updated) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Не найдено']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Ошибка БД']);
}
?>