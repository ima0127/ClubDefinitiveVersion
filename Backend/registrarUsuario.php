<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

include("conexion.php");

// Recibir datos del frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

$correo = $data["correo"];
$contrasena = password_hash($data["contrasena"], PASSWORD_DEFAULT);

// Rol fijo al registrar (puedes cambiarlo)
$rol = "usuario";

// Insertar nuevo usuario
$sql = "INSERT INTO usuarios (correo, contrasena, rol, fecha_registro)
        VALUES (?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $correo, $contrasena, $rol);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario registrado correctamente"]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "El correo ya está registrado o ocurrió un error"
    ]);
}

$stmt->close();
$conn->close();
?>
