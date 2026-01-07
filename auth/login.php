<?php
session_start();
require_once '../db.php';

header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Заполните все поля']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, username, email, password_hash, role FROM users WHERE email = ? OR username = ?");
$stmt->execute([$username, $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    $pdo->prepare("INSERT INTO activity_log (user_id, action, details) VALUES (?, 'login_failed', ?)")
        ->execute([$user['id'] ?? 0, json_encode(['attempted_login' => $username])]);

    http_response_code(401);
    echo json_encode(['error' => 'Неверный логин или пароль']);
    exit;
}

$pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?")->execute([$user['id']]);

$pdo->prepare("INSERT INTO activity_log (user_id, action, details) VALUES (?, 'login_success', 'Вход через веб-интерфейс')")
    ->execute([$user['id']]);

$_SESSION['user'] = [
    'id' => $user['id'],
    'username' => $user['username'],
    'email' => $user['email'],
    'role' => $user['role'],
];

echo json_encode(['success' => true]);