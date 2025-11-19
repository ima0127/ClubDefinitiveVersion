<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Obtener todas las reservas, ordenadas por fecha y hora
$sql = "SELECT r.id,
               s.nombre AS socio,
               r.fecha_reserva,
               r.hora_inicio,
               r.hora_fin,
               r.area,
               r.estado,
               r.descripcion
        FROM reservas r
        INNER JOIN socios s ON r.socio_id = s.id
        ORDER BY r.fecha_reserva DESC, r.hora_inicio DESC";

$result = $conn->query($sql);

$reservas = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Calcular duración en horas
        $inicio = strtotime($row['hora_inicio']);
        $fin = strtotime($row['hora_fin']);
        $row['duracion'] = round(($fin - $inicio) / 3600, 2);

        // Renombrar campos para React
        $row['id_socio'] = $row['socio'];
        $row['fecha'] = $row['fecha_reserva'];
        $row['hora'] = $row['hora_inicio'];
        $row['facilidad'] = $row['area'];

        // Inicializar utensilios y cantidades si los tienes en otra tabla
        $row['utensilios'] = [];
        $row['cantidades'] = [];

        $reservas[] = $row;
    }
}

// Siempre devolver un array
echo json_encode($reservas, JSON_UNESCAPED_UNICODE);

$conn->close();
?>
