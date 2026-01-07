<?php
session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Доступ запрещён']);
    exit;
}

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $stmt = $pdo->query("
        SELECT
            p.id,
            p.nickname,
            p.first_name,
            p.last_name,
            p.discipline_id,
            d.name AS discipline_name
        FROM players p
        LEFT JOIN disciplines d ON d.id = p.discipline_id
        ORDER BY p.id ASC
    ");

    $participants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'participants' => $participants,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось получить список участников',
    ], JSON_UNESCAPED_UNICODE);
}

