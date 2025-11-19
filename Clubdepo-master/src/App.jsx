import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import appFirebase from "./Credenciales";

import Login from "./components/Login";
import Home from "./components/Home";
import Inscripcion from "./components/inscripcion";
import Usuarios from "./components/Usuarios";
import RegistroCobros from "./components/RegistroCobros";
import MostrarCobros from "./components/MostrarCobros"; // ✅ Componente de historial
import ReservasContainer from "./components/ReservasContainer";
import Configuracion from "./components/Configuracion";

import "./App.css";

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="loading">Cargando...</p>;
  }

  return (
    <Router>
      {usuario ? (
        <Routes>
          {/* 🏠 Pantalla principal */}
          <Route path="/" element={<Home correoUsuario={usuario.email} />} />

          {/* 🧾 Inscripción */}
          <Route path="/inscripcion" element={<Inscripcion />} />

          {/* 👥 Usuarios */}
          <Route path="/usuarios" element={<Usuarios />} />

          {/* 💰 Registro de Cobros */}
          <Route
            path="/registrocobros"
            element={<RegistroCobros correoUsuario={usuario.email} />}
          />

          {/* 📜 Mostrar / Historial de Cobros */}
          <Route
            path="/mostrar-cobros"
            element={<MostrarCobros correoUsuario={usuario.email} />}
          />

          {/* 📅 Reservas */}
          <Route path="/reservas" element={<ReservasContainer />} />

          {/* ⚙️ Configuración */}
          <Route
            path="/configuracion"
            element={<Configuracion correoUsuario={usuario.email} />}
          />
        </Routes>
      ) : (
        <Login />
      )}
    </Router>
  );
}

export default App;
