import useAdminMesas from "./useAdminMesas";
import { useTranslation } from "react-i18next";
import "./AdminMesas.css";

function AdminMesas() {
  const { t } = useTranslation();
  const { mesas } = useAdminMesas();

  return (
    <div className="admin-container">
      <h1>📋 {t("admin_tables.all_tables")}</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{t("admin_tables.table_number")}</th>
            <th>{t("admin_tables.waiter_name")}</th>
            <th>{t("admin_tables.status")}</th>
            <th>{t("admin_tables.active_guests")}</th>
            <th>{t("admin_tables.total_guests")}</th>
            <th>{t("admin_tables.pending_confirmations")}</th>
          </tr>
        </thead>
        <tbody>
          {mesas.map((mesa) => (
            <tr key={mesa.id}>
              <td>{mesa.numero}</td>
              <td>{mesa.nombre_camarero || "—"}</td>
              <td>
                {mesa.estado
                  ? t("admin_tables.open")
                  : t("admin_tables.closed")}
              </td>
              <td>{mesa.comensales_activos}</td>
              <td>{mesa.num_comensales}</td>
              <td className={mesa.platos_pendientes > 0 ? "alerta" : ""}>
                {mesa.platos_pendientes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminMesas;
