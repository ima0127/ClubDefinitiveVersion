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

// Consulta todas las reservas
$sql = "SELECT r.id,
               s.id AS id_socio,
               s.nombre AS nombre_socio,
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
        $duracion = round(($fin - $inicio) / 3600, 2);

        $reserva = [
            "id" => $row['id'],
            "id_socio" => $row['id_socio'],
            "socio" => "#" . $row['id_socio'] . " - " . $row['nombre_socio'],
            "fecha" => $row['fecha_reserva'],
            "hora" => $row['hora_inicio'],
            "duracion" => $duracion,
            "facilidad" => $row['area'],
            "estado" => $row['estado'],
            "descripcion" => $row['descripcion'],
            "utensilios" => [],  // opcional: si hay otra tabla puedes unirla aquí
            "cantidades" => []
        ];

        $reservas[] = $reserva;
    }
}

// Devolver siempre un array
echo json_encode($reservas, JSON_UNESCAPED_UNICODE);

$conn->close();
?>
