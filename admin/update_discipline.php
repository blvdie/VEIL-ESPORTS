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

$disciplineId = isset($payload['id']) ? (int)$payload['id'] : 0;
if ($disciplineId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный идентификатор дисциплины']);
    exit;
}

$fieldsMap = [
    'name' => 'name',
    'slug' => 'slug',
];

$setParts = [];
$params = [];

foreach ($fieldsMap as $key => $column) {
    if (array_key_exists($key, $payload)) {
        $value = trim((string)$payload[$key]);
        if ($value === '') {
            echo json_encode(['success' => false, 'error' => 'Поля не могут быть пустыми']);
            exit;
        }
        $setParts[] = "`$column` = ?";
        $params[] = $value;
    }
}

if (empty($setParts)) {
    echo json_encode(['success' => false, 'error' => 'Нет данных для обновления']);
    exit;
}

$params[] = $disciplineId;

try {
    $stmt = $pdo->prepare("
        UPDATE disciplines
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

