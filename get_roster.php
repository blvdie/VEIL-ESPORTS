<?php
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

if ($slug === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Не указан идентификатор дисциплины',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, name, slug
        FROM disciplines
        WHERE slug = ?
        LIMIT 1
    ");
    $stmt->execute([$slug]);
    $discipline = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$discipline) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Дисциплина не найдена',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $playersStmt = $pdo->prepare("
        SELECT id, nickname, first_name, last_name
        FROM players
        WHERE discipline_id = ?
        ORDER BY id ASC
    ");
    $playersStmt->execute([$discipline['id']]);
    $players = $playersStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'discipline' => $discipline,
        'players' => $players,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось загрузить состав команды',
    ], JSON_UNESCAPED_UNICODE);
}

