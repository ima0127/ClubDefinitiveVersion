<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

include("conexion.php");

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
        WHERE r.estado = 'pendiente'
        ORDER BY r.fecha_reserva DESC, r.hora_inicio DESC";

$result = $conn->query($sql);

$reservas = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        // duración
        $inicio = strtotime($row['hora_inicio']);
        $fin = strtotime($row['hora_fin']);
        $duracion = round(($fin - $inicio) / 3600, 2);

        // 🟩 PARSEAR UTENSILIOS DESDE descripcion
        $utensilios = [];
        $cantidades = [];

        if (strpos($row['descripcion'], "Utensilios:") !== false) {

            // Utensilios: PelotasBasquet(2), SillasExtras(1)
            $lista = str_replace("Utensilios:", "", $row["descripcion"]);
            $lista = trim($lista);

            $items = explode(",", $lista);

            foreach ($items as $item) {
                $item = trim($item);

                if (preg_match('/([A-Za-z0-9]+)\((\d+)\)/', $item, $m)) {
                    $utensilios[] = $m[1];
                    $cantidades[] = intval($m[2]);
                }
            }
        }

        $reservas[] = [
            "id" => $row['id'],
            "id_socio" => $row['id_socio'],
            "socio" => "#" . $row['id_socio'] . " - " . $row['nombre_socio'],
            "fecha" => $row['fecha_reserva'],
            "hora" => $row['hora_inicio'],
            "duracion" => $duracion,
            "facilidad" => $row['area'],
            "estado" => $row['estado'],
            "descripcion" => $row['descripcion'],
            "utensilios" => $utensilios,
            "cantidades" => $cantidades
        ];
    }
}

echo json_encode($reservas, JSON_UNESCAPED_UNICODE);

$conn->close();
?>
