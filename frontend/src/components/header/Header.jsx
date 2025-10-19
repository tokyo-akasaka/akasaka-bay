//     <button className="logout-btn" onClick={handleLogoutCamarero}> Cerrar sesión</button>
import { useLocation, Link } from "react-router-dom";
import { useHeader } from "./useHeader";
import { useHeaderContext } from "./useHeaderContext";
import NavCamarero from "./NavCamarero";
import NavComensal from "./NavComensal";
import NavAdmin from "./NavAdmin";
import { useTranslation } from "react-i18next";
import "./Header.css";
import LoginIcon from "../iconosBotones/LoginIcon.jsx";
import LogoutIcon from "../iconosBotones/LogoutIcon.jsx";

function Header({ navigate }) {
  const { camarero, comensal, handleLogoutCamarero } = useHeader(navigate);
  const context = useHeaderContext();
  const { i18n } = useTranslation();
  const location = useLocation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isComensalRoute = location.pathname.startsWith("/comensal");

  return (
    <header className="header-bar">
      {/* Fila 1: Logo */}
      <div className="logo-btn">
        <a href="/">Carta Digital</a>
      </div>

      {/* Fila 2: nav + sesión a la izquierda, idiomas a la derecha */}
      <div className="main-row">
        <div className="left-col">
          <nav className="nav">
            {!isComensalRoute && <NavCamarero />}
            <NavComensal />
            {!isComensalRoute && <NavAdmin />}
          </nav>

          <div className="session-box">
            {isComensalRoute && comensal ? (
              <span>🍴 {comensal.nombre}</span>
            ) : camarero ? (
              <>
                <span>🧑‍🍳 {camarero.nombre}</span>
                <button className="logout-btn" onClick={handleLogoutCamarero}>
                  <LogoutIcon width="26" height="26" />
                </button>
              </>
            ) : (
              !isComensalRoute && (
                <Link to="/camarero/login" className="login-btn">
                  <LoginIcon width="26" height="26" />
                </Link>
              )
            )}
          </div>
        </div>

        <div className="language-selector">
          <button onClick={() => changeLang("es")}>🇪🇸</button>
          <button onClick={() => changeLang("en")}>🇬🇧</button>
          <button onClick={() => changeLang("cn")}>🇨🇳</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
