<?php
$servername = "localhost";
$username = "root"; // usuario por defecto de XAMPP
$password = ""; // sin contraseña
$dbname = "bdclubuasd"; // nombre correcto en minúsculas

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer codificación
$conn->set_charset("utf8mb4");
?>
