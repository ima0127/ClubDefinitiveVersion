import React from "react";
import "./Home.css";
import ImagenLogo from "../assets/LOGo.jpg";
import MenuNav from "../components/MenuNav";

const Home = ({ correoUsuario }) => {
  return (
    <div className="home-container">
      {/* Menú y encabezado principal */}
      <MenuNav correoUsuario={correoUsuario} />

      {/* Contenido principal */}
      <div className="main-content">
        <div className="watermark">
          <img src={ImagenLogo} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Home;
