import LanguageSelector from "./LanguageSelector";
import { useNavigate, Link } from "react-router-dom";
import { useHeader } from "./useHeader";
import { useHeaderContext } from "./useHeaderContext";
import NavComensal from "./NavComensal";
import NavCamarero from "./NavCamarero";
import NavAdmin from "./NavAdmin";
import { useTranslation } from "react-i18next";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    camarero,
    comensal,
    menuComidaLink,
    misPedidosLink,
    handleLogoutCamarero,
  } = useHeader(navigate);
  const context = useHeaderContext();

  return (
    <header className="header-bar fixed">
      {/* IZQUIERDA */}
      <div className="left">
        <Link to="/" className="logo-btn">
          🍣 {t("header.brand")}
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
              {t("header.logout")}
            </button>
          </div>
        ) : context === "camarero" ? (
          <button
            className="login-btn"
            onClick={() => navigate("/camarero/login")}
          >
            {t("header.login_waiter")}
          </button>
        ) : null}

        <LanguageSelector />
      </div>
    </header>
  );
}

export default Header;
