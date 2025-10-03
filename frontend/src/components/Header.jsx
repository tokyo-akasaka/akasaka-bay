import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Header() {
  const [camarero, setCamarero] = useState(null);
  const navigate = useNavigate();

  // Cargar camarero desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("camarero");
    if (stored) {
      try {
        setCamarero(JSON.parse(stored)); // {id, nombre, email}
      } catch (err) {
        console.error("Error parseando camarero:", err);
      }
    }
  }, []);

  // Logout camarero
  const handleLogoutCamarero = async () => {
    await supabase.auth.signOut(); // cerrar sesión de Supabase
    localStorage.removeItem("camarero"); // limpiar local
    setCamarero(null); // reset state
    navigate("/"); // redirigir al inicio
  };

  return (
    <div style={styles.header}>
      {camarero ? (
        <div style={styles.box}>
          👨‍🍳 {camarero.nombre} (ID {camarero.id})
          <button style={styles.logout} onClick={handleLogoutCamarero}>
            Logout
          </button>
        </div>
      ) : (
        <button style={styles.login} onClick={() => navigate("/login-otp")}>
          Login Camarero
        </button>
      )}

      <div style={styles.menu}>
        <Link to="/">Inicio</Link>
        <Link to="/camarero">Apertura mesa</Link>
        <Link to="/camarero/mesas">Mis Mesas</Link>
        <Link to="/admin/mesas">Admin</Link>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
    background: "#f5f5f5",
  },
  box: { display: "flex", alignItems: "center", gap: "10px" },
  menu: { display: "flex", gap: "15px" },
  logout: {
    background: "#d9534f",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Header;
