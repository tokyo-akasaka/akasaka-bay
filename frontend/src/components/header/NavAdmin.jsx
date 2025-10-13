// 📁 components/header/NavAdmin.jsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NavAdmin() {
  const { t } = useTranslation();

  return (
    <div className="dropdown">
      <span className="dropbtn">{t("admin.menu_title")} ▾</span>
      <div className="dropdown-content">
        <Link to="/admin/mesas">{t("admin.tables")}</Link>
      </div>
    </div>
  );
}

export default NavAdmin;
