// frontend/src/components/Header.jsx

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Header() {
  const [camarero, setCamarero] = useState(null);
  const [comensal, setComensal] = useState(null);
  const navigate = useNavigate();

  // 🔹 Cargar camarero desde localStorage y escuchar login
  useEffect(() => {
    const loadCamarero = () => {
      try {
        const stored = localStorage.getItem("camarero");
        if (!stored) return setCamarero(null);
        const parsed = JSON.parse(stored);
        if (parsed?.id && parsed?.nombre) {
          setCamarero(parsed);
        } else {
          localStorage.removeItem("camarero");
          setCamarero(null);
        }
      } catch (err) {
        console.error("Error leyendo datos de camarero:", err);
        localStorage.removeItem("camarero");
        setCamarero(null);
      }
    };

    loadCamarero();
    window.addEventListener("camarero-login", loadCamarero);

    return () => {
      window.removeEventListener("camarero-login", loadCamarero);
    };
  }, []);

  // 🔹 Cargar comensal desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("comensal");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed?.id && parsed?.nombre && parsed?.token && parsed?.mesa_id) {
        setComensal(parsed);
      } else {
        localStorage.removeItem("comensal");
      }
    } catch (err) {
      console.error("Error leyendo datos de comensal:", err);
      localStorage.removeItem("comensal");
    }
  }, []);

  // 🔹 Logout camarero
  const handleLogoutCamarero = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("camarero");
    setCamarero(null);
    navigate("/");
  };

  return (
    <header className="header-bar fixed">
      {/* IZQUIERDA */}
      <div className="left">
        <Link to="/" className="logo-btn">
          🍣 Carta Digital
        </Link>

        <nav className="nav">
          {/* 🧍‍♂️ COMENSAL */}
          <div className="dropdown">
            <span className="dropbtn">Comensal ▾</span>
            <div className="dropdown-content">
              <Link
                to={
                  localStorage.getItem("comensal")
                    ? (() => {
                        const c = JSON.parse(localStorage.getItem("comensal"));
                        return `/comensal/menu-comida?mesa=${c.mesa_id}&session_id=${c.session_id}&comensal_token=${c.token}`;
                      })()
                    : "/comensal/apertura-comensal"
                }
              >
                Menú comida
              </Link>
              <Link
                to={
                  localStorage.getItem("comensal")
                    ? (() => {
                        const c = JSON.parse(localStorage.getItem("comensal"));
                        return `/comensal/mesa/${c.mesa_id}?session_id=${c.session_id}&comensal_token=${c.token}`;
                      })()
                    : "/comensal/apertura-comensal"
                }
              >
                Mis pedidos
              </Link>
            </div>
          </div>

          {/* 👨‍🍳 CAMARERO */}
          <div className="dropdown">
            <span className="dropbtn">Camarero ▾</span>
            <div className="dropdown-content">
              <Link to="/camarero/setup">Apertura Mesa</Link>
              <Link to="/camarero/mesas">Mis Mesas</Link>
            </div>
          </div>

          {/* 🧑‍💼 ADMIN */}
          <div className="dropdown">
            <span className="dropbtn">Admin ▾</span>
            <div className="dropdown-content">
              <Link to="/admin/mesas">Mesas</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* DERECHA */}
      <div className="right">
        {camarero ? (
          <div className="session-box">
            👨‍🍳 <strong>{camarero.nombre}</strong> (ID {camarero.id})
            <button className="logout-btn" onClick={handleLogoutCamarero}>
              Logout
            </button>
          </div>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/camarero/login")}
          >
            Login Camarero
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
