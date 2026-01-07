<?php
session_start();
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
	echo json_encode(['success' => false, 'error' => 'Доступ запрещён']);
	exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];

$name = trim((string)($data['name'] ?? ''));
$photo = trim((string)($data['photo'] ?? ''));
$sizes = trim((string)($data['sizes'] ?? ''));
$description = trim((string)($data['description'] ?? ''));

if ($name === '') {
	echo json_encode(['success' => false, 'error' => 'Название обязательно']);
	exit;
}

try {
	$stmt = $pdo->prepare("
		INSERT INTO products (name, photo, sizes, description, price)
		VALUES (?, ?, ?, ?, 0)
	");
	$stmt->execute([$name, $photo, $sizes, $description]);

	$newId = (int)$pdo->lastInsertId();

	echo json_encode([
		'success' => true,
		'product' => [
			'id' => $newId,
			'name' => $name,
			'photo' => $photo,
			'sizes' => $sizes,
			'description' => $description
		]
	], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
	http_response_code(500);
	echo json_encode(['success' => false, 'error' => 'Ошибка добавления']);
}
?>

