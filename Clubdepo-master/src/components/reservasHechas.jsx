import React, { useState, useEffect } from "react";
import "./reservas.css";
import "./resPendiente.css";

const ReservasHechas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar las reservas desde el backend PHP
  useEffect(() => {
    fetch("http://localhost/Backend/obtener_reservas.php") // ← ruta corregida
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener las reservas");
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

  return (
    <div className="rc-page">
      <header>
        <h1 className="titulo-apartado">Historial de Reservas</h1>
      </header>

      <main className="container">
        {loading && <p>Cargando reservas...</p>}

        {!loading && reservas.length === 0 && (
          <p className="rc-mensaje">No hay reservas realizadas.</p>
        )}

        {reservas.map((reserva) => (
          <section className="reserva-card" key={reserva.id}>
            <h2>Reserva del Socio {reserva.socio}</h2>

            <div className="info-general">
              <p>
                <strong>Facilidad:</strong>{" "}
                {reserva.facilidad && reserva.facilidad !== ""
                  ? reserva.facilidad
                  : "—"}
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
                      reserva.estado === "Hecha"
                        ? "green"
                        : reserva.estado === "Pendiente"
                        ? "orange"
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
                  {reserva.utensilios.map((u, i) => (
                    <li key={i}>
                      {u} —{" "}
                      <strong>
                        {reserva.cantidades && reserva.cantidades[i]
                          ? reserva.cantidades[i]
                          : "1"}{" "}
                        unidad(es)
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};

export default ReservasHechas;
