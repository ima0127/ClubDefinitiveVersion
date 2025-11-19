<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php'; // Usa tu conexión principal

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respuesta rápida para preflight CORS
    exit(0);
}

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "error" => "ID no especificado"]);
    exit;
}

$id = intval($_GET['id']);

// Usar consulta preparada para mayor seguridad
$stmt = $conn->prepare("DELETE FROM reservas WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
