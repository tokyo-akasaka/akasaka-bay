// frontend/src/components/header/NavComensal.jsx

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getComensalFromStorage,
  generarURIsComensal,
} from "../../services/comensalLinks";

function NavComensal() {
  const { t } = useTranslation();
  const comensal = getComensalFromStorage();
  const { menuComida, misPedidos } = generarURIsComensal(comensal);

  return (
    <div className="dropdown">
      <span className="dropbtn">{t("guest.menu_title")} ▾</span>
      <div className="dropdown-content">
        <Link to={menuComida}>{t("guest.food_menu")}</Link>
        <Link to={misPedidos}>{t("guest.my_orders")}</Link>
      </div>
    </div>
  );
}

export default NavComensal;
