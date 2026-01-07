<?php
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

$id = (int)($_GET['id'] ?? 0);
if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID товара не указан']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, name, photo, sizes, description, price 
        FROM products 
        WHERE id = ?
    ");
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    if (!$product) {
        http_response_code(404);
        echo json_encode(['error' => 'Товар не найден']);
        exit;
    }

    echo json_encode([
        'id' => (int)$product['id'],
        'name' => htmlspecialchars($product['name'], ENT_QUOTES, 'UTF-8'),
        'photo' => $product['photo'] ? htmlspecialchars($product['photo'], ENT_QUOTES, 'UTF-8') : 'pic/placeholder.png',
        'sizes' => $product['sizes'],
        'description' => $product['description'] ? htmlspecialchars($product['description'], ENT_QUOTES, 'UTF-8') : null,
        'price' => (float)$product['price']
    ], JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);

} catch (Exception $e) {
    error_log("get_product.php error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
}