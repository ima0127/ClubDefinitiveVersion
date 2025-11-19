import React, { useEffect, useState } from "react";
import "./Usuarios.css";
import MenuNav from "../components/MenuNav";

const Usuarios = ({ correoUsuario }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar socios desde el backend PHP
  useEffect(() => {
    fetch("http://localhost/Backend/obtener_socios.php")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los socios");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          console.error("Respuesta inesperada:", data);
          setUsuarios([]);
        }
      })
      .catch((err) => {
        console.error("Error de conexión:", err);
        setUsuarios([]);
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="usuarios-container">
      <MenuNav correoUsuario={correoUsuario} />

      <div className="usuarios-contenido">
        <h1 className="usuarios-headercolor">Lista de Socios Registrados</h1>

        {cargando ? (
          <p className="usuarios-texto">Cargando socios...</p>
        ) : usuarios.length === 0 ? (
          <p className="usuarios-texto">No hay socios registrados.</p>
        ) : (
          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre completo</th>
                <th>Cédula</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Fecha de inscripción</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre} {usuario.apellido}</td>
                  <td>{usuario.cedula}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.direccion}</td>
                  <td>{usuario.fecha_inscripcion}</td>
                  <td>{usuario.estado || "Activo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
