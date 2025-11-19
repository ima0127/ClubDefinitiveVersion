<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Incluir conexión
include "conexion.php";

// Validar que llega un ID
if (!isset($_GET["id"])) {
    echo json_encode(["error" => "No se recibió el ID del cobro a eliminar."]);
    exit;
}

$id = intval($_GET["id"]);

// Verificar si el registro existe
$verificar = $conn->query("SELECT id FROM cobros WHERE id = $id");

if ($verificar->num_rows === 0) {
    echo json_encode(["error" => "El cobro no existe o ya fue eliminado."]);
    exit;
}

// Proceder con la eliminación
$sql = "DELETE FROM cobros WHERE id = $id";
$resultado = $conn->query($sql);

if ($resultado) {
    echo json_encode(["mensaje" => "Cobro eliminado correctamente."]);
} else {
    echo json_encode(["error" => "No se pudo eliminar el cobro."]);
}

$conn->close();
?>
