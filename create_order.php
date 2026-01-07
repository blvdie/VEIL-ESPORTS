<?php
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Требуется авторизация'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

$payload = json_decode(file_get_contents('php://input'), true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректные данные'], JSON_UNESCAPED_UNICODE);
    exit;
}

$fullName = trim((string)($payload['full_name'] ?? ''));
$phone = trim((string)($payload['phone'] ?? ''));
$country = trim((string)($payload['country'] ?? ''));
$city = trim((string)($payload['city'] ?? ''));
$address = trim((string)($payload['address'] ?? ''));

if ($fullName === '' || $phone === '' || $country === '' || $city === '' || $address === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Все поля обязательны для заполнения'], JSON_UNESCAPED_UNICODE);
    exit;
}

$digits = preg_replace('/\D+/', '', $phone);
if (strlen($digits) < 10 || strlen($digits) > 15) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный номер телефона'], JSON_UNESCAPED_UNICODE);
    exit;
}

$phoneFormatted = ($phone[0] === '+') ? '+' . $digits : $digits;

$userId = (int)$_SESSION['user']['id'];

try {
    $pdo->beginTransaction();

    $cartStmt = $pdo->prepare("
        SELECT c.id, c.product_id, c.quantity, c.size, p.price
        FROM cart c
        INNER JOIN products p ON p.id = c.product_id
        WHERE c.user_id = ?
        ORDER BY c.id ASC
        FOR UPDATE
    ");
    $cartStmt->execute([$userId]);
    $cartItems = $cartStmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$cartItems) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Корзина пуста'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $total = 0;
    foreach ($cartItems as $item) {
        $price = (float)$item['price'];
        $qty = max(1, (int)$item['quantity']);
        $total += $price * $qty;
    }

    $orderStmt = $pdo->prepare("
        INSERT INTO orders (user_id, full_name, phone, country, city, address, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $orderStmt->execute([
        $userId,
        mb_substr($fullName, 0, 255),
        mb_substr($phoneFormatted, 0, 30),
        mb_substr($country, 0, 100),
        mb_substr($city, 0, 100),
        mb_substr($address, 0, 255),
        number_format($total, 2, '.', '')
    ]);

    $orderId = (int)$pdo->lastInsertId();

    $itemStmt = $pdo->prepare("
        INSERT INTO order_items (order_id, product_id, size, quantity, price)
        VALUES (?, ?, ?, ?, ?)
    ");

    foreach ($cartItems as $item) {
        $itemStmt->execute([
            $orderId,
            (int)$item['product_id'],
            $item['size'] !== null ? mb_substr($item['size'], 0, 50) : null,
            max(1, (int)$item['quantity']),
            number_format((float)$item['price'], 2, '.', '')
        ]);
    }

    $deleteStmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $deleteStmt->execute([$userId]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'order_id' => $orderId
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось оформить заказ'
    ], JSON_UNESCAPED_UNICODE);
}

