<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bdclubuasd";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

// Obtener datos JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validación
if (!isset($data["socio_id"], $data["fecha_reserva"], $data["hora_inicio"], 
          $data["hora_fin"], $data["area"], $data["estado"])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

// Capturar datos del JSON
$socio_id = intval($data["socio_id"]);
$fecha_reserva = $data["fecha_reserva"];
$hora_inicio = $data["hora_inicio"];
$hora_fin = $data["hora_fin"];
$area = $data["area"];
$estado = $data["estado"];
$descripcion = isset($data["descripcion"]) ? $data["descripcion"] : "Sin descripción";

// VALIDACIÓN: El socio debe existir
$checkSocio = $conn->prepare("SELECT id FROM socios WHERE id = ?");
$checkSocio->bind_param("i", $socio_id);
$checkSocio->execute();
$checkSocio->store_result();

if ($checkSocio->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "El socio no existe."]);
    exit;
}

// VALIDACIÓN: No puede reservar la misma área a la misma hora
$checkOverlap = $conn->prepare("SELECT id FROM reservas 
    WHERE fecha_reserva = ? AND area = ? 
    AND (
        (hora_inicio <= ? AND hora_fin > ?) OR
        (hora_inicio < ? AND hora_fin >= ?)
    )");

$checkOverlap->bind_param(
    "ssssss",
    $fecha_reserva,
    $area,
    $hora_inicio, $hora_inicio,
    $hora_fin, $hora_fin
);

$checkOverlap->execute();
$checkOverlap->store_result();

if ($checkOverlap->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Ya existe una reserva en esa área y horario."
    ]);
    exit;
}

// INSERTAR LA RESERVA
$sql = "INSERT INTO reservas 
(socio_id, fecha_reserva, hora_inicio, hora_fin, area, estado, descripcion) 
VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "issssss",
    $socio_id,
    $fecha_reserva,
    $hora_inicio,
    $hora_fin,
    $area,
    $estado,
    $descripcion
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Reserva creada correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar la reserva"]);
}

$conn->close();
?>
