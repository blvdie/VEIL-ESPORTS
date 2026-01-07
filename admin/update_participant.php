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

$participantId = isset($payload['id']) ? (int)$payload['id'] : 0;
if ($participantId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный идентификатор участника']);
    exit;
}

$fieldsMap = [
    'nickname' => 'nickname',
    'first_name' => 'first_name',
    'last_name' => 'last_name',
    'discipline_id' => 'discipline_id',
];

$setParts = [];
$params = [];

foreach ($fieldsMap as $key => $column) {
    if (!array_key_exists($key, $payload)) {
        continue;
    }

    if ($key === 'discipline_id') {
        $value = (int)$payload[$key];
        if ($value <= 0) {
            echo json_encode(['success' => false, 'error' => 'Нужно выбрать дисциплину']);
            exit;
        }
        $setParts[] = "`$column` = ?";
        $params[] = $value;
        continue;
    }

    $value = trim((string)$payload[$key]);
    if ($key === 'nickname' && $value === '') {
        echo json_encode(['success' => false, 'error' => 'Никнейм не может быть пустым']);
        exit;
    }

    $setParts[] = "`$column` = ?";
    $params[] = $value === '' ? null : $value;
}

if (empty($setParts)) {
    echo json_encode(['success' => false, 'error' => 'Нет данных для обновления']);
    exit;
}

$params[] = $participantId;

try {
    $stmt = $pdo->prepare("
        UPDATE players
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

