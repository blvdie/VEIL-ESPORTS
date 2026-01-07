<?php
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user'])) {
    echo json_encode([
        'success' => true,
        'items' => []
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$user_id = (int)$_SESSION['user']['id'];

try {
    $stmt = $pdo->prepare("
        SELECT 
            c.id AS cart_id,
            c.product_id,
            c.size,
            c.quantity,
            p.name,
            p.photo,
            p.price
        FROM cart c
        INNER JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        ORDER BY c.added_at DESC
    ");
    $stmt->execute([$user_id]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($items as &$item) {
        $item['price'] = (float)$item['price'];
    }

    echo json_encode([
        'success' => true,
        'items' => $items
    ], JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка загрузки корзины'
    ]);
}
?>