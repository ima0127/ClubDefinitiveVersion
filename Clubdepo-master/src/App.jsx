import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Home from "./components/Home";
import Inscripcion from "./components/inscripcion";
import Usuarios from "./components/Usuarios";
import RegistroCobros from "./components/RegistroCobros";
import MostrarCobros from "./components/MostrarCobros";
import ReservasContainer from "./components/ReservasContainer";
import Configuracion from "./components/Configuracion";

import "./App.css";

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const correoGuardado = localStorage.getItem("correoUsuario");
    setUsuario(correoGuardado);
  }, []);

  return (
    <Router>
      {usuario ? (
        <Routes>
          <Route path="/" element={<Home correoUsuario={usuario} />} />
          <Route path="/inscripcion" element={<Inscripcion />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/registrocobros" element={<RegistroCobros correoUsuario={usuario} />} />
          <Route path="/mostrar-cobros" element={<MostrarCobros correoUsuario={usuario} />} />
          <Route path="/reservas" element={<ReservasContainer />} />
          <Route path="/configuracion" element={<Configuracion correoUsuario={usuario} />} />
        </Routes>
      ) : (
        <Login />
      )}
    </Router>
  );
}

export default App;
