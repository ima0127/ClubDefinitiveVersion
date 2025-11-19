import React, { useState } from "react";
import "./inscripcion.css";
import MenuNav from "../components/MenuNav";

const Inscripcion = ({ correoUsuario }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    correo: "",
    direccion: "",
    telefonoEmergencia: "",
    parentescoEmergencia: "",
    fecha_nacimiento: "",
    genero: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost/Backend/guardarSocio.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        alert("✅ Socio registrado correctamente");
        setFormData({
          nombre: "",
          apellido: "",
          cedula: "",
          telefono: "",
          correo: "",
          direccion: "",
          telefonoEmergencia: "",
          parentescoEmergencia: "",
          fecha_nacimiento: "",
          genero: "",
        });
      } else {
        alert("❌ Error al guardar: " + (data.message || "Inténtalo nuevamente."));
      }
    } catch (error) {
      console.error("Error al conectar:", error);
      alert(
        "⚠️ No se pudo conectar con el servidor PHP.\n" +
          "Verifica que Apache esté activo y que el archivo guardarSocio.php exista en C:\\xampp\\htdocs\\Backend\\"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inscripcion-container">
      <MenuNav correoUsuario={correoUsuario} />

      <div
        className="inscripcion-card shadow-lg p-4 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <h3 className="inscripcion-title text-center mb-4 text-primary">
          Inscripción de Socio
        </h3>

        <form onSubmit={handleSubmit} className="inscripcion-form">
          {/* Nombre */}
          <div className="inscripcion-group mb-3">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Apellido */}
          <div className="inscripcion-group mb-3">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>

          {/* Cédula */}
          <div className="inscripcion-group mb-3">
            <label>Cédula</label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              required
            />
          </div>

          {/* Teléfono */}
          <div className="inscripcion-group mb-3">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dirección */}
          <div className="inscripcion-group mb-3">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>

          {/* Género */}
          <div className="inscripcion-group mb-3">
            <label>Género</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Correo */}
          <div className="inscripcion-group mb-3">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fecha de nacimiento */}
          <div className="inscripcion-group mb-3">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </div>

          {/* Teléfono emergencia */}
          <div className="inscripcion-group mb-3">
            <label>Teléfono de emergencia</label>
            <input
              type="tel"
              name="telefonoEmergencia"
              value={formData.telefonoEmergencia}
              onChange={handleChange}
              required
            />
          </div>

          {/* Parentesco emergencia */}
          <div className="inscripcion-group mb-3">
            <label>Parentesco de emergencia</label>
            <select
              name="parentescoEmergencia"
              value={formData.parentescoEmergencia}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona parentesco</option>
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Hermano(a)">Hermano(a)</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Botón */}
          <button type="submit" className="inscripcion-btn" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inscripcion;
