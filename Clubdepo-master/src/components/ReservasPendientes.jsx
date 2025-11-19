import React, { useState, useEffect } from "react";
import "./reservas.css";
import "./resPendiente.css";

const ReservasPendientes = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar reservas pendientes desde PHP
  useEffect(() => {
    fetch("http://localhost/Backend/obtener_reservas_pendientes.php") // ← ruta corregida
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener las reservas pendientes");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setReservas(data);
        } else {
          console.error("Respuesta inesperada:", data);
          setReservas([]);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setReservas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Modificar reserva (en el futuro puedes abrir un formulario o modal)
  const editarReserva = (id) => {
    alert(`✏️ Editar reserva con ID: ${id}`);
  };

  // 🔹 Eliminar / cancelar reserva
  const eliminarReserva = (id) => {
    const confirmar = window.confirm("¿Desea cancelar esta reserva?");
    if (!confirmar) return;

    fetch(`http://localhost/Backend/eliminar_reserva.php?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setReservas((prev) => prev.filter((r) => r.id !== id));
          alert("✅ Reserva cancelada correctamente");
        } else {
          alert("❌ Error al cancelar la reserva: " + (data.error || ""));
        }
      })
      .catch((err) => {
        console.error("Error al cancelar:", err);
        alert("⚠️ No se pudo conectar con el servidor.");
      });
  };

  return (
    <div className="rc-page">
      <header>
        <h1 className="titulo-apartado">Reservas Pendientes</h1>
      </header>

      <main className="container">
        {loading && <p>Cargando reservas...</p>}
        {!loading && reservas.length === 0 && <p>No hay reservas pendientes.</p>}

        {reservas.map((reserva) => (
          <section className="reserva-card" key={reserva.id}>
           <h2>Reserva del Socio {reserva.socio}</h2>

            <div className="info-general">
              <p>
                <strong>Facilidad:</strong>{" "}
                {reserva.facilidad && reserva.facilidad !== "" ? reserva.facilidad : "—"}
              </p>
              <p>
                <strong>Fecha:</strong> {reserva.fecha}
              </p>
              <p>
                <strong>Hora de inicio:</strong> {reserva.hora}
              </p>
              <p>
                <strong>Duración:</strong> {reserva.duracion} hora(s)
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  style={{
                    color:
                      reserva.estado === "Pendiente"
                        ? "orange"
                        : reserva.estado === "Hecha"
                        ? "green"
                        : "red",
                  }}
                >
                  {reserva.estado}
                </span>
              </p>
            </div>

            {reserva.utensilios && reserva.utensilios.length > 0 && (
              <div className="utensilios-box">
                <h3>Utensilios Reservados</h3>
                <ul>
                  {reserva.utensilios.map((item, index) => (
                    <li key={index}>
                      {item} —{" "}
                      <strong>
                        {reserva.cantidades && reserva.cantidades[index]
                          ? reserva.cantidades[index]
                          : "1"}{" "}
                        unidad(es)
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="botones">
              <button className="btnEditar" onClick={() => editarReserva(reserva.id)}>
                Modificar Reserva
              </button>
              <button className="btnEliminar" onClick={() => eliminarReserva(reserva.id)}>
                Cancelar Reserva
              </button>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default ReservasPendientes;
