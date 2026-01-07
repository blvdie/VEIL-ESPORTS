<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Доступ запрещён']);
    exit;
}

require_once __DIR__ . '/../db.php';

if (!isset($pdo) || !$pdo instanceof PDO) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Ошибка подключения к БД']);
    exit;
}

$col = $_GET['col'] ?? 'created_at';
$order = $_GET['order'] ?? 'desc';
$allowed = ['id', 'user_id', 'action', 'created_at'];
$col = in_array($col, $allowed) ? $col : 'created_at';
$order = in_array($order, ['asc', 'desc']) ? $order : 'desc';

try {
    $stmt = $pdo->prepare("
        SELECT id, user_id, action, details, created_at 
        FROM activity_log 
        ORDER BY `$col` $order 
        LIMIT 100
    ");
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($data as &$row) {
        if (!empty($row['details'])) {

            $details = $row['details'];
       
            $json = json_decode($details, true);
            if (is_array($json)) {
               
                if (isset($json['attempted_login'])) {
                    $details = 'Попытка входа: ' . htmlspecialchars($json['attempted_login'], ENT_QUOTES, 'UTF-8');
                } else {
                    $details = htmlspecialchars(json_encode($json, JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8');
                }
            } else {
                $details = htmlspecialchars($details, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            }
            $row['details'] = $details;
        } else {
            $row['details'] = '';
        }

        $row['created_at'] = date('d.m.Y H:i', strtotime($row['created_at']));
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка БД',
        'debug' => $e->getMessage()
    ]);
}
?>