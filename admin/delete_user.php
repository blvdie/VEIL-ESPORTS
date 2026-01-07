<?php
session_start();
require_once '../db.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = (int)($input['user_id'] ?? 0);

if ($user_id == $_SESSION['user']['id']) {
    echo json_encode(['error' => 'Нельзя удалить себя']);
    exit;
}

$pdo->prepare("DELETE FROM activity_log WHERE user_id = ?")->execute([$user_id]);
$pdo->prepare("DELETE FROM cart WHERE user_id = ?")->execute([$user_id]);

$pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$user_id]);

echo json_encode(['success' => true]);