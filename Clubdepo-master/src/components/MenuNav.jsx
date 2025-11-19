import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenuNav.css";

const MenuNav = ({ correoUsuario }) => {
  const navigate = useNavigate();

  // Simula el cierre de sesión (luego se reemplazará con el backend PHP)
  const handleLogout = () => {
    alert("👋 Sesión cerrada correctamente");
    navigate("/"); // Redirige al login
  };

  return (
    <div className="menu-container">
      {/* Encabezado principal */}
      <header className="headercolor">
        <h2>Sistema de Gestión Administrativa</h2>
        {correoUsuario && (
          <p className="welcome">
            Bienvenido <span>{correoUsuario}</span>
          </p>
        )}
      </header>

      {/* Menú principal */}
      <nav className="mini-menu">
        <ul>
          <li onClick={() => navigate("/inscripcion")}>
            Inscripción de Socios
          </li>
          <li onClick={() => navigate("/usuarios")}>Usuarios Registrados</li>
          <li onClick={() => navigate("/registrocobros")}>Cobros</li>
          <li onClick={() => navigate("/reservas")}>Reservas</li>
          <li onClick={() => navigate("/configuracion")}>Configuración</li>
          <li onClick={handleLogout} className="logout">
            Cerrar Sesión
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuNav;
