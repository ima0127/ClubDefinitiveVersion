<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

include("conexion.php");

// Consulta con JOIN para obtener el nombre del socio
$sql = "SELECT c.id,
               s.nombre AS socio,
               c.monto,
               c.fecha,
               c.descripcion,
               c.metodo,
               c.estado,
               c.dias_sin_pagar
        FROM cobros c
        INNER JOIN socios s ON c.socio_id = s.id
        ORDER BY c.id DESC";

$result = $conn->query($sql);

$cobros = [];

if ($result && $result->num_rows > 0) {
    while ($fila = $result->fetch_assoc()) {
        $cobros[] = $fila;
    }
    echo json_encode($cobros, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["message" => "No se encontraron cobros."]);
}

$conn->close();
?>
