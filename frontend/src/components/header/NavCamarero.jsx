// <span className="dropbtn">{t("waiter.menu_title")} ▾</span>

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CamareroIcon from "../iconosBotones/CamareroIcon";

function NavCamarero() {
  const { t } = useTranslation();
  const location = useLocation();
  const isActive = location.pathname.startsWith("/camarero");

  // Construir enlace de "Cobrar mesa" si estás en /camarero/cobrar/:id
  let cobrarLink = null;
  const match = location.pathname.match(/^\/camarero\/cobrar\/(\d+)/);
  if (match) {
    cobrarLink = `/camarero/cobrar/${match[1]}`;
  }

  return (
    <div className={`dropdown ${isActive ? "active" : ""}`}>
      <span className="dropbtn">
        <CamareroIcon width="26" height="26" />
      </span>

      <div className="dropdown-content">
        <Link to="/camarero/setup">{t("waiter.open_table")}</Link>
        <Link to="/camarero/mesas">{t("waiter.my_tables")}</Link>
        {cobrarLink && <Link to={cobrarLink}>{t("waiter.charge_table")}</Link>}
      </div>
    </div>
  );
}

export default NavCamarero;
