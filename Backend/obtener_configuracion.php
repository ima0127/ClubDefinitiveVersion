<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'conexion.php';

// Intentamos obtener la configuración (suponiendo que hay 1 fila)
$sql = "SELECT id, nombre_sistema, logo_url, tema FROM configuracion LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $config = $result->fetch_assoc();
    echo json_encode(["success" => true, "config" => $config], JSON_UNESCAPED_UNICODE);
} else {
    // No hay configuración registrada aún
    echo json_encode(["success" => false, "message" => "No se encontró configuración."]);
}

$conn->close();
?>
