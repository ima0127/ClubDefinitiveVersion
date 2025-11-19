<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php'; // usa la conexión ya configurada

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
        ORDER BY c.fecha DESC";

$result = $conn->query($sql);

$cobros = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $cobros[] = $row;
    }
}

echo json_encode($cobros, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
