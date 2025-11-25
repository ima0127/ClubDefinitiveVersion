import React, { useState, useEffect } from "react";
import "./reservas.css";
import "./resPendiente.css";

const opcionesUtensilios = [
  "ChalecosFlotadores",
  "KitCumpleanos",
  "PelotasBasquet",
  "BateBeisbol",
  "PelotasBeisbol",
  "GuantesBeisbol",
  "PelotasFutbol",
  "PelotasTenis",
  "PelotaVoleibol",
  "RaquetasTenis",
  "RedVoleibol",
  "Tobogan",
  "FlotadoresInfantiles",
  "EquipoSonido",
  "SillasExtras",
  "MesasExtras",
];

const opcionesFacilidades = [
  "Basquet",
  "Beisbol",
  "Futbol",
  "Tenis",
  "Beisbol",
  "Voleibol",
  "Piscina",
  "Eventos",
  "Gimnasio",
  "ParqueInfantil",
];

const ReservasPendientes = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  // popup
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [reservaEditar, setReservaEditar] = useState(null);
  const [utensiliosEditar, setUtensiliosEditar] = useState([]);

  // cargar reservas
  useEffect(() => {
    fetch("http://localhost/Backend/obtener_reservas_pendientes.php")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReservas(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // abrir popup con utensilios incluidos
  const editarReserva = (id) => {
    const res = reservas.find((r) => r.id === id);
    setReservaEditar(res);

    // mapear utensilios
    const uts = res.utensilios.map((u, index) => ({
      nombre: u,
      cantidad: res.cantidades[index] || 1,
    }));

    setUtensiliosEditar(uts);
    setMostrarPopup(true);
  };

  // agregar utensilio
  const agregarUtensilio = () => {
    if (utensiliosEditar.length >= 3) {
      alert("Máximo 3 utensilios.");
      return;
    }
    setUtensiliosEditar([...utensiliosEditar, { nombre: "", cantidad: 1 }]);
  };

  // modificar utensilio
  const cambiarUtensilio = (index, campo, valor) => {
    const copia = [...utensiliosEditar];
    copia[index][campo] = valor;
    setUtensiliosEditar(copia);
  };

  // eliminar utensilio
  const quitarUtensilio = (index) => {
    setUtensiliosEditar(utensiliosEditar.filter((_, i) => i !== index));
  };

  // guardar changes
  const guardarCambios = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const data = {
      id: reservaEditar.id,
      fecha: form.get("fecha"),
      hora: form.get("hora"),
      duracion: form.get("duracion"),
      facilidad: form.get("facilidad"),
      utensilios: utensiliosEditar.map((u) => u.nombre),
      cantidades: utensiliosEditar.map((u) => u.cantidad),
    };

    const response = await fetch("http://localhost/Backend/editar_reserva.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      alert("Reserva actualizada correctamente");

      setReservas((prev) =>
        prev.map((r) =>
          r.id === data.id ? { ...r, ...data } : r
        )
      );

      setMostrarPopup(false);
    } else {
      alert("Error al actualizar la reserva.");
    }
  };

  const eliminarReserva = (id) => {
    if (!window.confirm("¿Desea cancelar esta reserva?")) return;

    fetch(`http://localhost/Backend/eliminar_reserva.php?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReservas((prev) => prev.filter((r) => r.id !== id));
          alert("Reserva cancelada");
        }
      });
  };

  return (
    <div className="rc-page">
      <header>
        <h1 className="titulo-apartado">Reservas Pendientes</h1>
      </header>

      {loading && <p>Cargando...</p>}
      {!loading && reservas.length === 0 && <p>No hay reservas pendientes.</p>}

      <main className="container">
        {reservas.map((reserva) => (
          <section className="reserva-card" key={reserva.id}>
            <h2>Reserva del Socio {reserva.socio}</h2>

            <div className="info-general">
              <p><strong>Facilidad:</strong> {reserva.facilidad}</p>
              <p><strong>Fecha:</strong> {reserva.fecha}</p>
              <p><strong>Hora:</strong> {reserva.hora}</p>
              <p><strong>Duración:</strong> {reserva.duracion} hora(s)</p>

              {reserva.utensilios.length > 0 && (
                <>
                  <strong>Utensilios:</strong>
                  <ul>
                    {reserva.utensilios.map((u, i) => (
                      <li key={i}>
                        {u} ({reserva.cantidades[i]})
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

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

      {mostrarPopup && (
        <div className="popup-overlay">
          <div className="popup-content">

            <h2>Editar Reserva</h2>
            <button className="popup-close" onClick={() => setMostrarPopup(false)}>X</button>

            <form onSubmit={guardarCambios} className="form-editar">

              <label>Fecha:</label>
              <input type="date" name="fecha" defaultValue={reservaEditar.fecha} required />

              <label>Hora:</label>
              <input type="time" name="hora" defaultValue={reservaEditar.hora} required />

              <label>Duración:</label>
              <select name="duracion" defaultValue={reservaEditar.duracion}>
                {[1,2,3,4,5].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>

              <label>Facilidad:</label>
              <select name="facilidad" defaultValue={reservaEditar.facilidad}>
                {opcionesFacilidades.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <hr />

              <h3>Utensilios</h3>

              {utensiliosEditar.map((u, index) => (
                <div className="grupo-utensilio" key={index}>
                  <select
                    value={u.nombre}
                    onChange={(e) => cambiarUtensilio(index, "nombre", e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    {opcionesUtensilios.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={u.cantidad}
                    onChange={(e) => cambiarUtensilio(index, "cantidad", e.target.value)}
                  />

                  <button type="button" onClick={() => quitarUtensilio(index)}>X</button>
                </div>
              ))}

              <button type="button" className="btn-add" onClick={agregarUtensilio}>+ Agregar</button>

              <button type="submit" className="btnGuardar">Guardar Cambios</button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasPendientes;
