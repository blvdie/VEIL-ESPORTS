<?php
session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Доступ запрещён']);
    exit;
}

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

$payload = json_decode(file_get_contents('php://input'), true) ?? [];

$name = trim((string)($payload['name'] ?? ''));
$photo = trim((string)($payload['photo'] ?? ''));
$sizes = trim((string)($payload['sizes'] ?? ''));
$description = trim((string)($payload['description'] ?? ''));

$priceRaw = isset($payload['price']) ? str_replace(',', '.', (string)$payload['price']) : '0';
$price = is_numeric($priceRaw) ? number_format((float)$priceRaw, 2, '.', '') : '0.00';

if ($name === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите название товара'], JSON_UNESCAPED_UNICODE);
    exit;
}

$photo = $photo === '' ? null : $photo;
$sizes = $sizes === '' ? null : $sizes;
$description = $description === '' ? null : $description;

try {
    $stmt = $pdo->prepare("
        INSERT INTO products (name, photo, sizes, description, price)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$name, $photo, $sizes, $description, $price]);

    $newId = (int)$pdo->lastInsertId();

    $stmt = $pdo->prepare("
        SELECT id, name, photo, sizes, description, price
        FROM products
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$newId]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'product' => $product], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось добавить товар',
    ], JSON_UNESCAPED_UNICODE);
}

