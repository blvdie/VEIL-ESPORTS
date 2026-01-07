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
$slug = trim((string)($payload['slug'] ?? ''));

if ($name === '' || $slug === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите название и slug дисциплины'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO disciplines (name, slug)
        VALUES (?, ?)
    ");
    $stmt->execute([$name, $slug]);

    $newId = (int)$pdo->lastInsertId();

    $stmt = $pdo->prepare("
        SELECT id, name, slug
        FROM disciplines
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$newId]);
    $discipline = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'discipline' => $discipline], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Такой slug уже используется'], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Не удалось добавить дисциплину'], JSON_UNESCAPED_UNICODE);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Не удалось добавить дисциплину'], JSON_UNESCAPED_UNICODE);
}

