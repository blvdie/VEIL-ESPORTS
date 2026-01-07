<?php
require_once 'db.php';

$newPassword = '123123';
$hash = password_hash($newPassword, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE username = ?");
$stmt->execute([$hash, 'zxc']);

echo "Пароль для zxc обновлён!";
?>