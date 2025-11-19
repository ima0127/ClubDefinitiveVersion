import React, { useState } from "react";
import Reservas from "./Reservas";
import ReservasPendientes from "./ReservasPendientes";
import ReservasHechas from "./reservasHechas";
import MenuNav from "../components/MenuNav";
import "./reservas.css";

const ReservasContainer = ({ correoUsuario }) => {
  const [pestana, setPestana] = useState("form");

  return (
    <div className="reserva-container">
      {/* ✅ MenuNav solo aquí */}
      <MenuNav correoUsuario={correoUsuario} />

      {/* ✅ Menú superior de pestañas */}
      <nav className="navMenu">
        <button
          className={`btnFunciones ${pestana === "form" ? "active" : ""}`}
          onClick={() => setPestana("form")}
        >
          Reservar
        </button>
        <button
          className={`btnFunciones ${pestana === "pendientes" ? "active" : ""}`}
          onClick={() => setPestana("pendientes")}
        >
          Pendientes
        </button>
        <button
          className={`btnFunciones ${pestana === "hechas" ? "active" : ""}`}
          onClick={() => setPestana("hechas")}
        >
          Historial
        </button>
      </nav>

      <div className="reserva-pestanas">
        {pestana === "form" && <Reservas />}
        {pestana === "pendientes" && <ReservasPendientes />}
        {pestana === "hechas" && <ReservasHechas />}
      </div>
    </div>
  );
};

export default ReservasContainer;
