import React, { useState } from "react";
import Imagen from "../assets/LOGo.jpg";
import ImagenProfile from "../assets/usuariologo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [registrando, setRegistrando] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    const correo = e.target.email.value.trim();
    const contrasena = e.target.password.value.trim();

    if (!correo || !contrasena) {
      alert("⚠️ Por favor completa todos los campos.");
      return;
    }

    try {
      const url = registrando
        ? "http://localhost/Backend/registrarUsuario.php"
        : "http://localhost/Backend/loginUsuario.php";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (registrando) {
          alert("✅ Usuario registrado correctamente. Ahora puedes iniciar sesión.");
          setRegistrando(false);
        } else {
          alert("✅ Inicio de sesión exitoso");
          localStorage.setItem("correoUsuario", correo);
          navigate("/menu"); // redirige al menú principal
        }
      } else {
        alert("❌ " + (data.message || "Error al autenticar usuario."));
      }
    } catch (error) {
      console.error("Error al autenticar:", error);
      alert(
        "⚠️ No se pudo conectar con el servidor PHP.\n" +
        "Verifica que Apache esté activo y el archivo PHP exista en C:\\xampp\\htdocs\\Backend\\"
      );
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center">
        {/* Columna del login */}
        <div className="col-md-4 mb-4">
          <div className="Padre d-flex justify-content-center">
            <div className="card card-body shadow-lg border-0 rounded-4 text-center">
              <img
                src={ImagenProfile}
                alt="Usuario"
                className="estilo-profile rounded-circle mb-3 mx-auto"
                width="100"
                height="100"
              />

              <form className="d-flex flex-column gap-3" onSubmit={handleAuth}>
                <input
                  type="email"
                  placeholder="Ingresar Email"
                  className="form-control Cajatexto"
                  id="email"
                  required
                />
                <input
                  type="password"
                  placeholder="Ingresar Contraseña"
                  className="form-control Cajatexto"
                  id="password"
                  required
                />
                <button type="submit" className="btn btn-primary btnForm">
                  {registrando ? "Registrarte" : "Iniciar Sesión"}
                </button>
              </form>

              <h5 className="mt-4 fw-semibold">
                {registrando ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
              </h5>
              <button
                className="btn btn-outline-secondary w-75 mt-2"
                onClick={() => setRegistrando(!registrando)}
              >
                {registrando ? "Inicia sesión" : "Regístrate"}
              </button>
            </div>
          </div>
        </div>

        {/* Columna del logo */}
        <div className="col-md-8 text-center">
          <img
            src={Imagen}
            alt="Logo del club"
            className="tamano-imagen img-fluid rounded-4 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
