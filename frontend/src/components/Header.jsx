import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Header() {
  const [camarero, setCamarero] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [comensal, setComensal] = useState(null);

  const navigate = useNavigate();

  // 🔹 Cargar camarero desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("camarero");
      if (!stored) return;

      const parsed = JSON.parse(stored);

      // Validamos estructura esperada
      if (parsed && parsed.id && parsed.nombre) {
        setCamarero(parsed); // { id, nombre, email? }
      } else {
        console.warn("⚠️ Datos de camarero incompletos en localStorage");
        localStorage.removeItem("camarero");
      }
    } catch (err) {
      console.error("Error leyendo datos de camarero:", err);
      localStorage.removeItem("camarero");
    }
  }, []);

  // 🔹 Cargar comensal desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("comensal");
      if (!stored) return;

      const parsed = JSON.parse(stored);

      // Validamos estructura esperada
      if (
        parsed &&
        parsed.id &&
        parsed.nombre &&
        parsed.token &&
        parsed.mesa_id
      ) {
        setComensal(parsed); // { id, nombre, token, mesa_id }
      } else {
        console.warn("⚠️ Datos de comensal incompletos en localStorage");
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
    <>
      <style>{`
        .dropdown {
          position: relative;
          display: inline-block;
        }
        .dropbtn {
          cursor: pointer;
          font-weight: 500;
        }
        .dropdown-content {
          display: none;
          position: absolute;
          background-color: #fff;
          min-width: 150px;
          box-shadow: 0px 2px 5px rgba(0,0,0,0.15);
          border-radius: 6px;
          z-index: 999;
        }
        .dropdown-content a {
          display: block;
          padding: 8px 12px;
          text-decoration: none;
          color: #333;
        }
        .dropdown-content a:hover {
          background: #f1f1f1;
        }
        .dropdown:hover .dropdown-content {
          display: block;
        }
      `}</style>

      <header style={styles.header}>
        {/* IZQUIERDA: Logo + Navegación */}
        <div style={styles.left}>
          <Link to="/" style={styles.logo}>
            🍣 Carta Digital
          </Link>

          <nav style={styles.nav}>
            {/* 🧍‍♂️ COMENSAL */}
            <div className="dropdown">
              <span className="dropbtn">Comensal ▾</span>
              <div className="dropdown-content">
                <Link
                  to={
                    localStorage.getItem("comensal")
                      ? (() => {
                          const c = JSON.parse(
                            localStorage.getItem("comensal")
                          );
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
                          const c = JSON.parse(
                            localStorage.getItem("comensal")
                          );
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

        {/* DERECHA: Estado de sesión */}
        <div style={styles.right}>
          {camarero ? (
            <div style={styles.box}>
              👨‍🍳 <strong>{camarero.nombre}</strong> (ID {camarero.id})
              <button style={styles.logout} onClick={handleLogoutCamarero}>
                Logout
              </button>
            </div>
          ) : (
            <button
              style={styles.login}
              onClick={() => navigate("/camarero/login")}
            >
              Login Camarero
            </button>
          )}
        </div>
      </header>
    </>
  );
}

// 🎨 Estilos globales
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
    background: "#f5f5f5",
  },
  left: { display: "flex", alignItems: "center", gap: "20px" },
  logo: { fontWeight: "bold", color: "#222", textDecoration: "none" },
  nav: { display: "flex", gap: "20px" },
  box: { display: "flex", alignItems: "center", gap: "10px" },
  right: { display: "flex", alignItems: "center" },
  logout: {
    background: "#d9534f",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  login: {
    background: "#0275d8",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Header;
