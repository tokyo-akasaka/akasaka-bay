import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NavCamarero() {
  const { t } = useTranslation();

  return (
    <div className="dropdown">
      <span className="dropbtn">{t("waiter.menu_title")} ▾</span>
      <div className="dropdown-content">
        <Link to="/camarero/setup">{t("waiter.open_table")}</Link>
        <Link to="/camarero/mesas">{t("waiter.my_tables")}</Link>
      </div>
    </div>
  );
}

export default NavCamarero;
