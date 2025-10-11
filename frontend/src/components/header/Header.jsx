// 📁 components/header/Header.jsx

import { useNavigate, Link } from "react-router-dom";
import { useHeader } from "./useHeader";
import { useHeaderContext } from "./useHeaderContext";
import NavComensal from "./NavComensal";
import NavCamarero from "./NavCamarero";
import NavAdmin from "./NavAdmin";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const {
    camarero,
    comensal,
    menuComidaLink,
    misPedidosLink,
    handleLogoutCamarero,
  } = useHeader(navigate);
  const context = useHeaderContext();

  console.log("🧭 Header context:", context);
  console.log("👤 Comensal:", comensal);

  return (
    <header className="header-bar fixed">
      {/* IZQUIERDA */}
      <div className="left">
        <Link to="/" className="logo-btn">
          🍣 Carta Digital
        </Link>

        <nav className="nav">
          {context === "comensal" && (
            <NavComensal
              menuComidaLink={comensal ? menuComidaLink : "#"}
              misPedidosLink={comensal ? misPedidosLink : "#"}
            />
          )}
          {context === "camarero" && <NavCamarero />}
          {context === "admin" && <NavAdmin />}
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
        ) : context === "camarero" ? (
          <button
            className="login-btn"
            onClick={() => navigate("/camarero/login")}
          >
            Login Camarero
          </button>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
