<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once("conexion.php");

// Leer los datos enviados en formato JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

$correo = $data["correo"];
$contrasena = $data["contrasena"];

// Buscar el usuario por correo
$stmt = $conn->prepare("SELECT contrasena, rol FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->bind_result($hash, $rol);
$stmt->fetch();

// Verificar contraseña (funciona con hash o texto plano)
if ($contrasena === $hash || password_verify($contrasena, $hash)) {
    echo json_encode([
        "success" => true,
        "message" => "Inicio de sesión exitoso",
        "rol" => $rol
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
}

$stmt->close();
$conn->close();
?>
