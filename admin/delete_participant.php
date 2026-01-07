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

try {
    $stmt = $pdo->prepare("DELETE FROM players WHERE id = ? LIMIT 1");
    $stmt->execute([$participantId]);

    echo json_encode(['success' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось удалить участника',
    ], JSON_UNESCAPED_UNICODE);
}

