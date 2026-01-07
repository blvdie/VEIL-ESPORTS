<?php
session_start();
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user'])) {
	echo json_encode(['authenticated' => false, 'role' => null]);
	exit;
}

$userId = (int)$_SESSION['user']['id'];

try {
	$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
	$stmt->execute([$userId]);
	$row = $stmt->fetch();
	$currentRole = $row ? $row['role'] : null;

	if ($currentRole && $_SESSION['user']['role'] !== $currentRole) {
		$_SESSION['user']['role'] = $currentRole;
	}

	echo json_encode([
		'authenticated' => true,
		'role' => $currentRole
	], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
	http_response_code(500);
	echo json_encode(['authenticated' => true, 'role' => $_SESSION['user']['role'] ?? null]);
}
?>

