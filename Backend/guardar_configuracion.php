<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'conexion.php';

// Leer JSON del cuerpo
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos inválidos o no enviados"]);
    exit;
}

// Validar y sanear campos
$nombre_sistema = isset($data['nombre_sistema']) ? trim($data['nombre_sistema']) : null;
$logo_url = isset($data['logo_url']) ? trim($data['logo_url']) : null;
$tema = isset($data['tema']) ? trim($data['tema']) : null;

if ($nombre_sistema === null || $nombre_sistema === '') {
    echo json_encode(["success" => false, "message" => "El campo nombre_sistema es requerido"]);
    exit;
}

if ($tema !== null && !in_array($tema, ['claro', 'oscuro'])) {
    echo json_encode(["success" => false, "message" => "Valor de tema inválido"]);
    exit;
}

// Verificar si ya existe alguna fila en configuracion
$rowCheck = $conn->query("SELECT id FROM configuracion LIMIT 1");

if ($rowCheck && $rowCheck->num_rows > 0) {
    // Actualizar la fila existente
    $existing = $rowCheck->fetch_assoc();
    $id = intval($existing['id']);

    $stmt = $conn->prepare("UPDATE configuracion SET nombre_sistema = ?, logo_url = ?, tema = ? WHERE id = ?");
    $stmt->bind_param("sssi", $nombre_sistema, $logo_url, $tema, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Configuración actualizada correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar: " . $stmt->error]);
    }

    $stmt->close();
} else {
    // Insertar nueva fila
    $stmt = $conn->prepare("INSERT INTO configuracion (nombre_sistema, logo_url, tema) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $nombre_sistema, $logo_url, $tema);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Configuración guardada correctamente", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al insertar: " . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
