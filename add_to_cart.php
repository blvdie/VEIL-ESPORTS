<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Требуется авторизация']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$product_id = (int)($data['product_id'] ?? 0);
$size = trim($data['size'] ?? '');

if (!$product_id || !$size) {
    echo json_encode(['success' => false, 'error' => 'Некорректные данные']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, price FROM products WHERE id = ?");
$stmt->execute([$product_id]);
$product = $stmt->fetch();
if (!$product) {
    echo json_encode(['success' => false, 'error' => 'Товар не найден']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT id, quantity FROM cart 
    WHERE user_id = ? AND product_id = ? AND size = ?
");
$stmt->execute([$_SESSION['user']['id'], $product_id, $size]);
$row = $stmt->fetch();

if ($row && $row['quantity'] < 5) {
    $newQty = min($row['quantity'] + 1, 5);
    $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?")
        ->execute([$newQty, $row['id']]);
} else {
    $pdo->prepare("
        INSERT INTO cart (user_id, product_id, size, quantity) 
        VALUES (?, ?, ?, 1)
    ")->execute([$_SESSION['user']['id'], $product_id, $size]);
}

echo json_encode(['success' => true]);
?>