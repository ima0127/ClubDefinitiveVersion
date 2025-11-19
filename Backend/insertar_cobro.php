<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

include("conexion.php");

// Leer el cuerpo JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No se recibieron datos"]);
    exit;
}

// Validar campos obligatorios
$requiredFields = ["socio_id", "monto", "fecha", "descripcion", "metodo", "estado"];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || $data[$field] === "") {
        echo json_encode(["error" => "Falta el campo: $field"]);
        exit;
    }
}

// Asignar variables
$socio_id = intval($data["socio_id"]);
$monto = floatval($data["monto"]);
$fecha = $data["fecha"];
$descripcion = $data["descripcion"];
$metodo = $data["metodo"];
$estado = $data["estado"];
$dias_sin_pagar = isset($data["dias_sin_pagar"]) ? intval($data["dias_sin_pagar"]) : 0;

// Consulta segura
$sql = "INSERT INTO cobros (socio_id, monto, fecha, descripcion, metodo, estado, dias_sin_pagar)
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("idssssi", $socio_id, $monto, $fecha, $descripcion, $metodo, $estado, $dias_sin_pagar);

if ($stmt->execute()) {
    echo json_encode(["mensaje" => "Cobro registrado correctamente"]);
} else {
    echo json_encode(["error" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
