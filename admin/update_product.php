<?php
session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Доступ запрещён']);
    exit;
}

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

$payload = json_decode(file_get_contents('php://input'), true);

$productId = isset($payload['id']) ? (int)$payload['id'] : 0;
if ($productId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный идентификатор товара']);
    exit;
}

$fieldsMap = [
    'name' => 'name',
    'photo' => 'photo',
    'sizes' => 'sizes',
    'description' => 'description',
    'price' => 'price',
];

$setParts = [];
$params = [];

foreach ($fieldsMap as $key => $column) {
    if (array_key_exists($key, $payload)) {
        $value = $payload[$key];

        if ($key === 'price') {
            $value = str_replace(',', '.', (string)$value);
            if (!is_numeric($value)) {
                echo json_encode(['success' => false, 'error' => 'Цена должна быть числом']);
                exit;
            }
            $value = number_format((float)$value, 2, '.', '');
        } else {
            $value = trim((string)$value);
        }

        $setParts[] = "`$column` = ?";
        $params[] = $value;
    }
}

if (empty($setParts)) {
    echo json_encode(['success' => false, 'error' => 'Нет данных для обновления']);
    exit;
}

$params[] = $productId;

try {
    $stmt = $pdo->prepare("
        UPDATE products
        SET " . implode(', ', $setParts) . "
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute($params);

    echo json_encode(['success' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось сохранить изменения',
    ], JSON_UNESCAPED_UNICODE);
}

