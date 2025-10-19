//  <span className="dropbtn">{t("guest.menu_title")} ▾</span>

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getComensalFromStorage,
  generarURIsComensal,
} from "../../services/comensalLinks";
import ComensalIcon from "../iconosBotones/ComensalIcon";

function NavComensal() {
  const { t } = useTranslation();
  const comensal = getComensalFromStorage();
  const { menuComida, misPedidos } = generarURIsComensal(comensal);

  return (
    <div className="dropdown">
      <span className="dropbtn">
        <ComensalIcon width="26" height="26" />
      </span>

      <div className="dropdown-content">
        <Link to={menuComida}>{t("guest.food_menu")}</Link>
        <Link to={misPedidos}>{t("guest.my_orders")}</Link>
        {/* Mostrar nombre del comensal si existe */}
        {comensal && <span className="comensal-name">{comensal.nombre}</span>}
      </div>
    </div>
  );
}

export default NavComensal;
