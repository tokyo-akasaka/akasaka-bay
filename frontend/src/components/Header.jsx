import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Header() {
  const navigate = useNavigate();
  const [camarero, setCamarero] = useState(null);

  useEffect(() => {
    const storedCamarero = localStorage.getItem("camarero");
    if (storedCamarero) {
      try {
        setCamarero(JSON.parse(storedCamarero)); // { nombre, camareroId }
      } catch (e) {
        console.error("Error leyendo camarero:", e);
      }
    }
  }, []);

  const handleLoginCamarero = async () => {
    const id = prompt("Introduce tu ID de camarero:");
    if (!id || id.trim() === "") return;

    // 🔹 Consultar en la BD
    const { data, error } = await supabase
      .from("camareros")
      .select("id, nombre")
      .eq("id", id)
      .single();

    if (error || !data) {
      alert("❌ Camarero no encontrado en la base de datos");
      return;
    }

    const dataToStore = { camareroId: data.id, nombre: data.nombre };
    localStorage.setItem("camarero", JSON.stringify(dataToStore));
    setCamarero(dataToStore);

    navigate("/camarero/mesas");
  };

  const handleLogoutCamarero = () => {
    localStorage.removeItem("camarero");
    setCamarero(null);
    navigate("/");
  };

  return (
    <div style={styles.header}>
      {/* CAMARERO */}
      {camarero ? (
        <div style={styles.box}>
          👨‍🍳 <strong>{camarero.nombre}</strong> (ID {camarero.camareroId})
          <button style={styles.logout} onClick={handleLogoutCamarero}>
            Logout
          </button>
        </div>
      ) : (
        <button style={styles.login} onClick={handleLoginCamarero}>
          Login Camarero
        </button>
      )}

      {/* MENÚ CENTRAL */}
      <div style={styles.menu}>
        <Link to="/">Inicio</Link>
        <Link to="/camarero">Apertura mesa</Link>
        <Link to="/camarero/mesas">Mesas Camarero</Link>
        <Link to="/admin/mesas">Mesas Admin</Link>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#f5f5f5",
    borderBottom: "1px solid #ddd",
    fontFamily: "Arial",
  },
  box: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  menu: {
    display: "flex",
    gap: "15px",
  },
  login: {
    background: "#0275d8",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
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
