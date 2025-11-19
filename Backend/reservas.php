<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("conexion.php");

mysqli_report(MYSQLI_REPORT_OFF); // Evita errores fatales visibles

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos no recibidos correctamente"]);
    exit;
}

$requiredFields = ["socio_id", "fecha_reserva", "hora_inicio", "hora_fin", "area", "estado"];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Falta el campo: $field"]);
        exit;
    }
}

$socio_id = intval($data["socio_id"]);
$fecha_reserva = $data["fecha_reserva"];
$hora_inicio = $data["hora_inicio"];
$hora_fin = $data["hora_fin"];
$area = $data["area"];
$estado = $data["estado"];
$descripcion = isset($data["descripcion"]) ? $data["descripcion"] : null;

$sql = "INSERT INTO reservas (socio_id, fecha_reserva, hora_inicio, hora_fin, area, estado, descripcion)
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error en la preparación: " . $conn->error]);
    exit;
}

$stmt->bind_param("issssss", $socio_id, $fecha_reserva, $hora_inicio, $hora_fin, $area, $estado, $descripcion);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Reserva registrada correctamente"]);
} else {
    // ⚠️ Capturar error MySQL y mostrarlo como texto
    echo json_encode(["success" => false, "message" => "Error al guardar la reserva: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
