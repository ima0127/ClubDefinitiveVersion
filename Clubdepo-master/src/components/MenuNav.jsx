import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenuNav.css";

const MenuNav = ({ correoUsuario }) => {
  const navigate = useNavigate();

  // Cierre de sesión con localStorage
  const handleLogout = () => {
    localStorage.removeItem("correoUsuario"); // eliminar sesión

    navigate("/"); // ir al login
    window.location.reload(); // recargar App.jsx para que detecte que no hay usuario
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
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/inscripcion")}>
            Inscripción de Socios
          </li>

          <li onClick={() => navigate("/")}>Socios registrados</li>
          <li onClick={() => navigate("/registrocobros")}>Cobros</li>
          <li onClick={() => navigate("/reservas")}>Reservas</li>
          <li onClick={() => navigate("/configuracion")}>Configuración</li>

          {/* 🔥 Botón de Cerrar Sesión */}
          <li onClick={handleLogout} className="logout">
            Cerrar Sesión
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuNav;
