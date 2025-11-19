import React, { useEffect, useState } from "react";
import "./RCobros.css";
import MenuNav from "../components/MenuNav";

const MostrarCobros = ({ correoUsuario }) => {
  const [cobros, setCobros] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarCobros = () => {
    fetch("http://localhost/Backend/cobros.php")
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => setCobros(data))
      .catch((err) => {
        console.error("Error al obtener cobros:", err);
        alert(
          "⚠️ No se pudo obtener la lista de cobros.\n" +
            "Verifica que Apache esté activo y que cobros.php exista en C:\\xampp\\htdocs\\Backend\\"
        );
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarCobros();
  }, []);

  const eliminarCobro = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cobro?")) return;

    try {
      const res = await fetch(
        `http://localhost/Backend/eliminar_cobro.php?id=${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.mensaje) {
        alert("✅ " + data.mensaje);
        cargarCobros(); // recarga la lista
      } else if (data.error) {
        alert("❌ " + data.error);
      }
    } catch (error) {
      console.error("Error al eliminar cobro:", error);
      alert("⚠️ No se pudo eliminar el cobro.");
    }
  };

  if (cargando) {
    return (
      <div className="rc-pagina">
        <MenuNav correoUsuario={correoUsuario} />
        <div className="rc-container">
          <h2 className="titulo-apartado">Cargando cobros...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="rc-pagina">
      <MenuNav correoUsuario={correoUsuario} />
      <div className="rc-container">
        <h1 className="usuarios-headercolor">Historial de Cobros</h1>

        {cobros.length === 0 ? (
          <p className="usuarios-texto">No hay registros de cobros disponibles.</p>
        ) : (
          <div className="rc-tabla-wrapper">
            <table className="usuarios-tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Socio</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Días sin pagar</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cobros.map((cobro) => (
                  <tr key={cobro.id}>
                    <td>{cobro.id}</td>
                    <td>{cobro.socio}</td>
                    <td>${parseFloat(cobro.monto).toFixed(2)}</td>
                    <td>{cobro.fecha}</td>
                    <td>{cobro.descripcion}</td>
                    <td>{cobro.metodo}</td>
                    <td>{cobro.estado}</td>
                    <td>{cobro.dias_sin_pagar}</td>
                    <td>
                      <button
                        className="rc-btn rc-btn-reset"
                        onClick={() => eliminarCobro(cobro.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MostrarCobros;
