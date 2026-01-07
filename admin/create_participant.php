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

$nickname = trim((string)($payload['nickname'] ?? ''));
$firstName = trim((string)($payload['first_name'] ?? ''));
$lastName = trim((string)($payload['last_name'] ?? ''));
$disciplineId = isset($payload['discipline_id']) ? (int)$payload['discipline_id'] : 0;

if ($nickname === '' || $disciplineId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите никнейм и корректный ID дисциплины'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $disciplineCheck = $pdo->prepare("SELECT name FROM disciplines WHERE id = ? LIMIT 1");
    $disciplineCheck->execute([$disciplineId]);
    $disciplineName = $disciplineCheck->fetchColumn();

    if ($disciplineName === false) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Дисциплина с таким ID не найдена'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO players (nickname, first_name, last_name, discipline_id)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        $nickname,
        $firstName === '' ? null : $firstName,
        $lastName === '' ? null : $lastName,
        $disciplineId
    ]);

    $newId = (int)$pdo->lastInsertId();

    $stmt = $pdo->prepare("
        SELECT
            p.id,
            p.nickname,
            p.first_name,
            p.last_name,
            p.discipline_id,
            d.name AS discipline_name
        FROM players p
        LEFT JOIN disciplines d ON d.id = p.discipline_id
        WHERE p.id = ?
        LIMIT 1
    ");
    $stmt->execute([$newId]);
    $participant = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'participant' => $participant], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Не удалось добавить участника'], JSON_UNESCAPED_UNICODE);
}

