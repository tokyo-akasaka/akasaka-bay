// frontend/src/pages/admin/AdminMesas.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAdminMesas from "./useAdminMesas";
import AdminComensalCard from "./AdminComensalCard";
import "./AdminMesas.css";

function AdminMesas() {
  const { t } = useTranslation();
  const { mesas } = useAdminMesas();
  const [expandedMesaId, setExpandedMesaId] = useState(null);

  const toggleMesa = (mesaId) => {
    setExpandedMesaId((prev) => (prev === mesaId ? null : mesaId));
  };

  const calcularDatosComensal = (comensalesDetalle) => {
    let totalPendientes = 0;
    let totalSubtotal = 0;

    comensalesDetalle.forEach((comensal) => {
      const platosPendientes = (comensal.platos || []).filter(
        (p) => p.estado === "pendiente"
      ).length;
      totalPendientes += platosPendientes;
      totalSubtotal += comensal.subtotal || 0;
    });

    return { totalPendientes, totalSubtotal };
  };

  return (
    <div className="admin-mesas-container">
      <h1 className="admin-title">{t("admin_tables.all_tables")}</h1>
      <div className="admin-header-row">
        <div>{t("admin_tables.status")}</div>
        <div>{t("admin_tables.table_number")}</div>
        <div>{t("admin_tables.waiter_name")}</div>
        <div>
          {t("admin_tables.active_guests")}/{t("admin_tables.total_guests")}
        </div>
        <div>{t("admin_tables.pending_confirmations")}</div>
        <div>{t("admin_tables.total_amount")}</div>
      </div>
      <div className="admin-mesas-list">
        {mesas.map((mesa) => {
          const isExpanded = mesa.id === expandedMesaId;
          const comensalesDetalle = mesa.comensales_detalle || [];
          const { totalPendientes, totalSubtotal } =
            calcularDatosComensal(comensalesDetalle);
          const hasPending = totalPendientes > 0;

          return (
            <div
              key={mesa.id}
              className={`admin-mesa-row ${hasPending ? "alerta" : ""}`}
            >
              <div
                className="mesa-row-header"
                onClick={() => toggleMesa(mesa.id)}
              >
                <div className="col estado-dot">
                  {mesa.estado
                    ? t("admin_tables.status_open")
                    : t("admin_tables.status_closed")}
                </div>
                <div className="col mesa-numero">{mesa.numero}</div>
                <div className="col camarero-nombre">
                  {mesa.nombre_camarero}
                </div>
                <div className="col comensales-count">
                  {mesa.comensales_activos}/{mesa.num_comensales}
                </div>
                <div className="col pendientes-count">{totalPendientes}</div>
                <div className="col mesa-total">
                  {totalSubtotal.toFixed(2)} €
                </div>
              </div>

              {isExpanded && (
                <div className="mesa-row-content">
                  {comensalesDetalle.length > 0 ? (
                    comensalesDetalle.map((comensal) => (
                      <AdminComensalCard
                        key={comensal.id}
                        comensal={comensal}
                      />
                    ))
                  ) : (
                    <p className="sin-comensales">
                      {t("admin_tables.no_guests")}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminMesas;
