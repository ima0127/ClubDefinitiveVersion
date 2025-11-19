import React, { useEffect, useState } from "react";
import "./Configuracion.css";
import MenuNav from "./MenuNav";

const Configuracion = ({ correoUsuario }) => {
  const [tema, setTema] = useState("claro");
  const [nombreSistema, setNombreSistema] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar configuración desde el backend
  useEffect(() => {
    fetch("http://localhost/Backend/obtener_configuracion.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setNombreSistema(data.config.nombre_sistema || "");
          setLogoUrl(data.config.logo_url || "");
          setTema(data.config.tema || "claro");
          aplicarTema(data.config.tema);
        } else {
          console.warn("No se encontró configuración, se usará el tema por defecto.");
          aplicarTema("claro");
        }
      })
      .catch((err) => console.error("Error al obtener configuración:", err))
      .finally(() => setCargando(false));
  }, []);

  // 🔹 Aplica el tema visual
  const aplicarTema = (nuevoTema) => {
    if (nuevoTema === "oscuro") {
      document.body.classList.add("modo-oscuro");
      localStorage.setItem("tema", "oscuro");
    } else {
      document.body.classList.remove("modo-oscuro");
      localStorage.setItem("tema", "claro");
    }
  };

  // 🔹 Cambiar tema y guardar en la base de datos
  const cambiarTema = () => {
    const nuevoTema = tema === "oscuro" ? "claro" : "oscuro";
    setTema(nuevoTema);
    aplicarTema(nuevoTema);

    fetch("http://localhost/Backend/guardar_configuracion.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_sistema: nombreSistema || "Sistema de Gestión UASD",
        logo_url: logoUrl || null,
        tema: nuevoTema,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMensaje("✅ Configuración actualizada correctamente.");
        } else {
          setMensaje("⚠️ Error al actualizar configuración.");
        }
      })
      .catch((err) => {
        console.error("Error al guardar configuración:", err);
        setMensaje("⚠️ Error de conexión con el servidor.");
      });
  };

  if (cargando) {
    return (
      <div className="config-container">
        <MenuNav correoUsuario={correoUsuario} />
        <div className="config-content">
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="config-container">
      <MenuNav correoUsuario={correoUsuario} />

      <div className="config-content">
        <h1>Configuración del Sistema</h1>
        <p>Personaliza el tema y la información del sistema.</p>

        <div className="config-section">
          <label>Nombre del sistema:</label>
          <input
            type="text"
            value={nombreSistema}
            onChange={(e) => setNombreSistema(e.target.value)}
            placeholder="Ejemplo: Sistema de Gestión UASD"
          />
        </div>

        <div className="config-section">
          <label>Logo (URL):</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="http://localhost/Backend/img/logo.png"
          />
        </div>

        <div className="config-switch">
          <span>Tema actual: {tema === "oscuro" ? "Oscuro 🌙" : "Claro ☀️"}</span>
          <button onClick={cambiarTema} className="btn-tema">
            Cambiar tema
          </button>
        </div>

        {mensaje && <p className="mensaje-config">{mensaje}</p>}
      </div>
    </div>
  );
};

export default Configuracion;
