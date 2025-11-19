import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RCobros.css";
import MenuNav from "../components/MenuNav";

const RegistroCobros = ({ correoUsuario }) => {
  const [formData, setFormData] = useState({
    socio_id: "",
    monto: "",
    fecha: "",
    descripcion: "",
    metodo: "",
    estado: "",
    dias_sin_pagar: "",
  });

  const navigate = useNavigate();

  // ✔ CORREGIDO: handleChange ya NO borra ni modifica campos innecesarios
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si se cambia la descripción → cambiar monto automáticamente
    if (name === "descripcion") {
      let montoActualizado = "";

      if (value === "inscripcion") {
        montoActualizado = 5000;
      } else if (value === "mensualidad") {
        montoActualizado = 2000;
      }

      setFormData((prev) => ({
        ...prev,
        descripcion: value,
        monto: montoActualizado, // solo cambia aquí
      }));

      return; // EVITA que se sobrescriba por el setFormData general
    }

    // Para todos los demás inputs
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✔ Cálculo de días sin pagar
  const calcularDiasSinPagar = (fecha) => {
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    const diferencia = Math.floor(
      (hoy - fechaSeleccionada) / (1000 * 60 * 60 * 24)
    );
    return diferencia > 0 ? diferencia : 0;
  };

  const handleFechaChange = (e) => {
    const nuevaFecha = e.target.value;
    const dias = calcularDiasSinPagar(nuevaFecha);

    setFormData((prev) => ({
      ...prev,
      fecha: nuevaFecha,
      dias_sin_pagar: dias,
    }));
  };

  // ✔ Enviar al backend PHP
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(
      "http://localhost/Backend/insertar_cobro.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }

      const data = await respuesta.json();

      if (data.mensaje) {
        alert("✅ " + data.mensaje);
        handleReset();
      } else if (data.error) {
        alert("❌ Error: " + data.error);
      } else {
        alert("⚠️ Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert(
        "⚠️ No se pudo conectar con el servidor.\n" +
          "Verifica que Apache esté activo y que insertar_cobro.php esté en C:\\xampp\\htdocs\\Backend\\"
      );
    }
  };

  const handleReset = () => {
    setFormData({
      socio_id: "",
      monto: "",
      fecha: "",
      descripcion: "",
      metodo: "",
      estado: "",
      dias_sin_pagar: "",
    });
  };

  const irAMostrarCobros = () => {
    navigate("/mostrar-cobros");
  };

  return (
    <div className="rc-pagina">
      <MenuNav correoUsuario={correoUsuario} />

      <div className="rc-container">
        <h1 className="titulo-apartado">Registro de Cobros</h1>

        <form className="rc-form" onSubmit={handleSubmit} onReset={handleReset}>
          {/* Socio ID */}
          <div className="rc-field">
            <label htmlFor="socio_id" className="rc-label">
              ID del Socio:
            </label>
            <input
              type="text"
              id="socio_id"
              name="socio_id"
              className="rc-input"
              value={formData.socio_id}
              onChange={handleChange}
              required
            />
          </div>

          {/* Descripción */}
          <div className="rc-field">
            <label htmlFor="descripcion" className="rc-label">
              Descripción:
            </label>
            <select
              id="descripcion"
              name="descripcion"
              className="rc-select"
              value={formData.descripcion}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="mensualidad">Mensualidad</option>
              <option value="inscripcion">Inscripción</option>
            </select>
          </div>

          {/* Monto */}
          <div className="rc-field">
            <label htmlFor="monto" className="rc-label">
              Monto:
            </label>
            <input
              type="number"
              id="monto"
              name="monto"
              className="rc-input"
              value={formData.monto}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fecha */}
          <div className="rc-field">
            <label htmlFor="fecha" className="rc-label">
              Fecha del Cobro:
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              className="rc-input"
              value={formData.fecha}
              onChange={handleFechaChange}
              required
            />
          </div>

          {/* Método */}
          <div className="rc-field">
            <label htmlFor="metodo" className="rc-label">
              Método de Pago:
            </label>
            <select
              id="metodo"
              name="metodo"
              className="rc-select"
              value={formData.metodo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un método</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          {/* Estado */}
          <div className="rc-field">
            <label htmlFor="estado" className="rc-label">
              Estado:
            </label>
            <select
              id="estado"
              name="estado"
              className="rc-select"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="vencido">Vencido</option>
              <option value="anulado">Anulado</option>
            </select>
          </div>

          {/* Días sin pagar */}
          <div className="rc-field">
            <label htmlFor="dias_sin_pagar" className="rc-label">
              Días sin pagar:
            </label>
            <input
              type="text"
              id="dias_sin_pagar"
              name="dias_sin_pagar"
              className="rc-input rc-input-readonly"
              value={formData.dias_sin_pagar}
              readOnly
            />
          </div>

          {/* Botones */}
          <div className="rc-botones">
            <button type="submit" className="rc-btn rc-btn-submit">
              Registrar Cobro
            </button>
            <button type="reset" className="rc-btn rc-btn-reset">
              Limpiar
            </button>
            <button
              type="button"
              className="rc-btn rc-btn-ver"
              onClick={irAMostrarCobros}
            >
              Ver Cobros Registrados
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroCobros;
