<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php';

$sql = "SELECT id,
               nombre,
               apellido,
               cedula,
               correo,
               telefono,
               direccion,
               fecha_inscripcion,
               estado
        FROM socios
        ORDER BY fecha_inscripcion DESC";

$result = $conn->query($sql);

$socios = [];

if ($result && $result->num_rows > 0) {
    while ($fila = $result->fetch_assoc()) {
        $socios[] = $fila;
    }
    echo json_encode($socios, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["message" => "No se encontraron socios."]);
}

$conn->close();
?>
