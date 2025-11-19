<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once("conexion.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No se recibieron datos"]);
    exit;
}

// Campos requeridos reales según la base de datos
$requiredFields = ["nombre", "apellido", "cedula", "correo", "telefono", "direccion"];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Falta el campo: $field"]);
        exit;
    }
}

$nombre = $data["nombre"];
$apellido = $data["apellido"];
$cedula = $data["cedula"];
$correo = $data["correo"];
$telefono = $data["telefono"];
$direccion = $data["direccion"];

// Insertar en la base de datos
$sql = "INSERT INTO socios (nombre, apellido, cedula, correo, telefono, direccion, fecha_inscripcion, estado)
        VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 'activo')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $nombre, $apellido, $cedula, $correo, $telefono, $direccion);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Socio guardado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}

$stmt->close();
$conn->close();
?>
