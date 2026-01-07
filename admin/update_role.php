<?php
session_start();
require_once '../db.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = (int)($input['user_id'] ?? 0);
$new_role = in_array($input['role'], ['user', 'admin']) ? $input['role'] : 'user';

if ($user_id == $_SESSION['user']['id'] && $new_role === 'user') {
    echo json_encode(['error' => 'Нельзя снять роль с себя']);
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
$stmt->execute([$new_role, $user_id]);

echo json_encode(['success' => true]);

