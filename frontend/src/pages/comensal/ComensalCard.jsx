// frontend/src/pages/comensal/ComensalCard.jsx

import { useState } from "react";
import QRCode from "react-qr-code";
import AprobarPlatos from "../camarero/AprobarPlatos";
import { useComensalCard } from "./useComensalCard";
import { useTranslation } from "react-i18next";
import "./ComensalCard.css";

function ComensalCard({ comensal, modoCamarero = false }) {
  const { t } = useTranslation();
  const [expandido, setExpandido] = useState(false);
  const {
    mostrarPlatos,
    setMostrarPlatos,
    mostrarQR,
    setMostrarQR,
    pendientes,
    subtotal,
    qrValue,
    loadData,
  } = useComensalCard(comensal);

  // Usar los platos de la vista mesas_con_comensales
  const tienePendientes =
    comensal.platos?.some((p) => p.estado === "pendiente") || pendientes > 0;
  console.log("Que hay en pendientes:", tienePendientes);

  return (
    <div className={`comensal-card ${tienePendientes ? "alerta" : ""}`}>
      <div
        className="comensal-header"
        onClick={() => setExpandido((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <div className="comensal-info">
          <span className="estado-dot">{comensal.activo ? "🟢" : "⚪"}</span>
          <span className="comensal-nombre">{comensal.nombre}</span>
        </div>
        <div className="comensal-pendientes">
          🍽️ {t("card.pending")}:<span>{pendientes}</span>
        </div>
        <div className="comensal-total">
          💰{Number(subtotal ?? 0).toFixed(2)} €
        </div>
      </div>
      <div className={`comensal-expandible ${expandido ? "" : "collapsed"}`}>
        {!modoCamarero && (
          <div className="comensal-actions">
            <button
              className="btn-qr"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarQR((prev) => !prev);
              }}
            >
              {mostrarQR ? t("card.hide_qr") : t("card.my_qr")}
            </button>
            <button
              className="btn-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarPlatos((prev) => !prev);
              }}
            >
              {mostrarPlatos ? t("card.hide_dishes") : t("card.show_dishes")}
            </button>
          </div>
        )}
        {!modoCamarero && mostrarQR && (
          <div className="qr-individual">
            <QRCode value={qrValue} size={130} />
            <p>{t("card.rejoin_table")}</p>
          </div>
        )}
        {(mostrarPlatos || modoCamarero) && (
          <div className="grupo-platos">
            <AprobarPlatos comensal={comensal} loadData={loadData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ComensalCard;
