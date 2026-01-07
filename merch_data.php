<?php
require_once 'db.php';

$stmt = $pdo->query("SELECT id, name, photo, price FROM products ORDER BY id ASC");
$products = $stmt->fetchAll();
?>