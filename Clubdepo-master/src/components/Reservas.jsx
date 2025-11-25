import React, { useState } from "react";
import "./reservas.css";

const Reservas = () => {
  const [mostrarFacilidades, setMostrarFacilidades] = useState(false);
  const [mostrarUtensilios, setMostrarUtensilios] = useState(false);
  const [utensilios, setUtensilios] = useState([{ id: 1, value: "", cantidad: 1 }]);

  // 🔹 Agregar nuevo utensilio
  const agregarUtensilio = () => {
    if (utensilios.length >= 3) {
      alert("Solo se pueden agregar hasta 3 utensilios.");
      return;
    }
    setUtensilios([...utensilios, { id: Date.now(), value: "", cantidad: 1 }]);
  };

  // 🔹 Eliminar utensilio
  const eliminarUtensilio = (id) => {
    setUtensilios((prev) => prev.filter((u) => u.id !== id));
  };

  // 🔹 Actualizar utensilio o cantidad
  const handleUtensilioChange = (id, campo, valor) => {
    setUtensilios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [campo]: valor } : u))
    );
  };

  // 🔹 Calcular hora de fin (FORMATO TIME)
  const calcularHoraFin = (horaInicio, duracion) => {
    const [h] = horaInicio.split(":").map(Number);
    const fin = h + parseInt(duracion);
    return `${fin.toString().padStart(2, "0")}:00:00`; // FORMATO CORRECTO PARA MYSQL
  };

  // 🔹 Enviar formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const horaInicio = e.target.hora.value;
    const duracion = e.target.duracion.value;
    const horaFin = calcularHoraFin(horaInicio, duracion);

    const datosReserva = {
      socio_id: e.target.socio.value.trim(),
      fecha_reserva: e.target.fecha_reserva.value,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      area: mostrarFacilidades ? e.target.facilidad.value : "General",
      estado: "pendiente",
      descripcion: mostrarUtensilios
        ? `Utensilios: ${utensilios
            .map((u) => `${u.value}(${u.cantidad})`)
            .join(", ")}`
        : "Sin utensilios",
    };

    try {
      const response = await fetch("http://localhost/Backend/reservas.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosReserva),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Respuesta del servidor no es JSON:\n" + text);
      }

      if (data.success) {
        alert("✅ Reserva registrada correctamente");
        e.target.reset();
        handleReset();
      } else if (data.message) {
        alert("❌ " + data.message);
      } else {
        alert("⚠️ Respuesta inesperada del servidor:\n" + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      alert("⚠️ Error al conectar con el servidor.");
    }
  };

  // 🔹 Limpiar formulario
  const handleReset = () => {
    setMostrarFacilidades(false);
    setMostrarUtensilios(false);
    setUtensilios([{ id: 1, value: "", cantidad: 1 }]);
  };

  return (
    <div className="rc-page">
      <div className="rc-container">
        <h1 className="titulo-apartado">Reservas</h1>

        <form onSubmit={handleSubmit} onReset={handleReset} className="rc-form">

          {/* ID Socio */}
          <div className="rc-field">
            <label className="rc-label">ID Socio:</label>
            <input type="text" id="socio" name="socio" required className="rc-input" />
          </div>

          {/* Fecha */}
          <div className="rc-field">
            <label className="rc-label">Fecha de reserva:</label>
            <input type="date" id="fecha_reserva" name="fecha_reserva" required className="rc-input" />
          </div>

          {/* Tipo */}
          <p className="rc-label">¿Qué desea reservar?</p>
          <div className="rc-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={mostrarFacilidades}
                onChange={() => setMostrarFacilidades(!mostrarFacilidades)}
              /> 
              Facilidades
            </label>

            <label>
              <input
                type="checkbox"
                checked={mostrarUtensilios}
                onChange={() => setMostrarUtensilios(!mostrarUtensilios)}
              /> 
              Utensilios
            </label>
          </div>

          {/* Facilidades */}
          {mostrarFacilidades && (
            <div className="rc-field">
              <label className="rc-label">Tipo de facilidad:</label>
              <select id="facilidad" name="facilidad" className="rc-select" required>
                <option value="">Seleccione una facilidad</option>
                <option value="Basquet">Básquet</option>
                <option value="Beisbol">Béisbol</option>
                <option value="Futbol">Fútbol</option>
                <option value="Tenis">Tenis</option>
                <option value="Voleibol">Voleibol</option>
                <option value="Piscina">Piscina</option>
                <option value="Eventos">Área de eventos</option>
                <option value="Gimnasio">Gimnasio</option>
                <option value="ParqueInfantil">Parque infantil</option>
              </select>
            </div>
          )}

          {/* Utensilios */}
          {mostrarUtensilios && (
            <div className="rc-field">
              {utensilios.map((u) => (
                <div key={u.id} className="rc-utensilio">
                  <label className="rc-label">Utensilio:</label>
                  <select
                    value={u.value}
                    onChange={(e) => handleUtensilioChange(u.id, "value", e.target.value)}
                    className="rc-select"
                  >
                    <option value="">Seleccione un utensilio</option>
                    <option value="ChalecosFlotadores">Chalecos flotadores</option>
                    <option value="KitCumpleanos">Kit de cumpleaños</option>
                    <option value="PelotasBasquet">Pelotas de básquet</option>
                    <option value="BateBeisbol">Bate de béisbol</option>
                    <option value="PelotasBeisbol">Pelotas de béisbol</option>
                    <option value="GuantesBeisbol">Guantes de béisbol</option>
                    <option value="PelotasFutbol">Pelotas de fútbol</option>
                    <option value="PelotasTenis">Pelotas de tenis</option>
                    <option value="PelotaVoleibol">Pelota de voleibol</option>
                    <option value="RaquetasTenis">Raquetas de tenis</option>
                    <option value="RedVoleibol">Red de voleibol</option>
                    <option value="Tobogan">Tobogán infantil</option>
                    <option value="FlotadoresInfantiles">Flotadores infantiles</option>
                    <option value="EquipoSonido">Equipo de sonido</option>
                    <option value="SillasExtras">Sillas extras</option>
                    <option value="MesasExtras">Mesas extras</option>
                  </select>

                  <label className="rc-label">Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={u.cantidad}
                    onChange={(e) =>
                      handleUtensilioChange(u.id, "cantidad", parseInt(e.target.value))
                    }
                    className="rc-input"
                  />

                  {utensilios.length > 1 && (
                    <button
                      type="button"
                      className="rc-btn rc-btn-remove"
                      onClick={() => eliminarUtensilio(u.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="rc-btn rc-btn-add" onClick={agregarUtensilio}>
                +
              </button>
            </div>
          )}

          {/* Hora */}
          <div className="rc-field">
            <label className="rc-label">Hora de inicio:</label>
            <select id="hora" name="hora" className="rc-select">
              {Array.from({ length: 10 }, (_, i) => i + 8).map((h) => (
                <option key={h} value={`${h.toString().padStart(2, "0")}:00:00`}>
                  {h}:00
                </option>
              ))}
            </select>
          </div>

          {/* Duración */}
          <div className="rc-field">
            <label className="rc-label">Duración (máx. 5 horas):</label>
            <select id="duracion" name="duracion" className="rc-select">
              {[1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="rc-botones">
            <button type="submit" className="rc-btn rc-btn-submit">
              Guardar
            </button>
            <button type="reset" className="rc-btn rc-btn-reset">
              Borrar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Reservas;
