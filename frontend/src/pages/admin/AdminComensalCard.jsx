import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminComensalCard } from "./useAdminComensalCard";
import "./AdminComensalCard.css";

function AdminComensalCard({ comensal }) {
  const { t, i18n } = useTranslation();
  const { expandido, toggleExpandido, platos, pendientes, subtotal } =
    useAdminComensalCard(comensal);

  const tienePendientes =
    comensal.platos?.some((p) => p.estado === "pendiente") || pendientes > 0;

  return (
    <div
      id={`admin-comensal-${comensal.id}`}
      className={`admin-comensal-card ${tienePendientes ? "alerta" : ""}`}
    >
      <div
        className="admin-comensal-header"
        onClick={toggleExpandido}
        style={{ cursor: "pointer" }}
      >
        <div className="admin-comensal-info">
          <span className="estado-dot">{comensal.activo ? "🟢" : "⚪"}</span>
          <span className="admin-comensal-nombre">{comensal.nombre}</span>
        </div>
        <div className="admin-comensal-pendientes">
          🍽️ {t("admin_comensal_card.pending")}: {pendientes}
        </div>
        <div className="admin-comensal-total">
          💰 {t("admin_comensal_card.subtotal")}:{" "}
          {Number(subtotal ?? 0).toFixed(2)} €
        </div>
      </div>

      <div
        className={`admin-comensal-expandible ${expandido ? "" : "collapsed"}`}
      >
        <div className="admin-grupo-platos">
          <h4>{t("admin_comensal_card.dishes_title")}</h4>
          {platos && platos.length > 0 ? (
            <ul className="platos-list">
              {platos.map((linea) => {
                const platoObj = linea.platos ?? {};
                const lang = i18n.language || "es";

                const nombre =
                  platoObj[`name_${lang}`] ??
                  platoObj.nombre ??
                  platoObj.code ??
                  `Plato ${platoObj.id}`;

                const precio = linea.precio_unitario ?? platoObj.precio ?? 0;

                const estadoTrad = t(
                  `admin_comensal_card.states.${linea.estado}`
                );

                return (
                  <li key={linea.id} className="plato-item">
                    <div className="plato-info">
                      <span className="plato-codigo">
                        🍽️ {platoObj.code ?? linea.plato_id}
                      </span>
                      <span className="plato-nombre">{nombre}</span>
                      <span className="plato-precio">
                        {Number(precio).toFixed(2)} €
                      </span>
                    </div>
                    <div className="plato-actions">
                      <span className={`badge ${linea.estado}`}>
                        {estadoTrad}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-platos">{t("admin_comensal_card.no_dishes")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminComensalCard;
