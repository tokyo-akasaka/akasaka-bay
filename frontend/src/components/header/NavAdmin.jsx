// <span className="dropbtn">⚙️ {t("admin.menu_title")} ▾</span>

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminIcon from "../iconosBotones/AdminIcon";

function NavAdmin() {
  const { t } = useTranslation();

  return (
    <div className="dropdown">
      <span className="dropbtn">
        <AdminIcon width="28" height="28" />
      </span>

      <div className="dropdown-content">
        <Link to="/admin/mesas">{t("admin.tables")}</Link>
        {/* Puedes agregar más rutas admin aquí */}
      </div>
    </div>
  );
}

export default NavAdmin;
