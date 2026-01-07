<?php
session_start();
require_once '../db.php';

header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$password2 = $input['password2'] ?? '';

if (!$username) {
    echo json_encode(['error' => 'Укажите логин']);
    exit;
}
if (strlen($username) < 3 || strlen($username) > 30) {
    echo json_encode(['error' => 'Логин должен быть от 3 до 30 символов']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Некорректный email']);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(['error' => 'Пароль должен быть не короче 6 символов']);
    exit;
}
if ($password !== $password2) {
    echo json_encode(['error' => 'Пароли не совпадают']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->execute([$username, $email]);
if ($stmt->fetch()) {
    echo json_encode(['error' => 'Пользователь с таким логином или email уже существует']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);


$stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user')");
try {
    $stmt->execute([$username, $email, $hash]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Ошибка регистрации. Попробуйте позже.']);
}