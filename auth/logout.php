<?php
session_start();
require_once '../db.php';

if (isset($_SESSION['user']['id'])) {
    $userId = $_SESSION['user']['id'];
    $pdo->prepare("INSERT INTO activity_log (user_id, action, details) VALUES (?, 'logout', 'Выход через веб-интерфейс')")
        ->execute([$userId]);
}

$_SESSION = [];
session_destroy();

header('Location: /');
exit;