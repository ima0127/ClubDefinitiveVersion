<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include("conexion.php");

// Recibir JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["id"])) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

$id = $data["id"];
$fecha = $data["fecha"];
$hora = $data["hora"];
$duracion = intval($data["duracion"]);
$area = $data["facilidad"];   // <-- AQUÍ SE GUARDA LA FACILIDAD BIEN

// Calcular hora fin
$horaFin = date("H:i", strtotime($hora) + ($duracion * 3600));

// Procesar utensilios
$descripcion = "Sin Utensilios";

if (!empty($data["utensilios"])) {
    $items = [];

    foreach ($data["utensilios"] as $index => $u) {
        if ($u !== "") {
            $cant = intval($data["cantidades"][$index]);
            $items[] = $u . "(" . $cant . ")";
        }
    }

    if (count($items) > 0) {
        $descripcion = "Utensilios: " . implode(", ", $items);
    }
}

// Actualizar reserva en BD
$sql = "UPDATE reservas 
        SET fecha_reserva = ?, 
            hora_inicio = ?, 
            hora_fin = ?, 
            area = ?, 
            descripcion = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssi", $fecha, $hora, $horaFin, $area, $descripcion, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
