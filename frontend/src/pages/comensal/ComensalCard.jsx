// frontend/src/pages/comensal/ComensalCard.jsx

import QRCode from "react-qr-code";
import AprobarPlatos from "../camarero/AprobarPlatos";
import { useComensalCard } from "./useComensalCard";
import { useTranslation } from "react-i18next";
import "./ComensalCard.css";

function ComensalCard({ comensal }) {
  const { t } = useTranslation();

  const {
    mostrarPlatos,
    setMostrarPlatos,
    mostrarQR,
    setMostrarQR,
    pendientes,
    subtotal,
    qrValue,
  } = useComensalCard(comensal);

  return (
    <div className="comensal-card">
      <div className="comensal-header">
        <div className="comensal-status">
          <span className={comensal.activo ? "activo" : "inactivo"}>
            {comensal.activo ? "🟢" : "⚪"}
          </span>
        </div>
        <strong>{comensal.nombre}</strong>
        <div
          className={`pendientes-count ${
            pendientes > 0 ? "alerta" : "sin-pendientes"
          }`}
        >
          🍽️ {t("card.pending")}: {pendientes}
        </div>

        <div className="subtotal">💰 {Number(subtotal ?? 0).toFixed(2)} €</div>
      </div>

      <div className="comensal-actions">
        <button
          className="btn-toggle"
          onClick={() => setMostrarPlatos((prev) => !prev)}
        >
          {mostrarPlatos ? t("card.hide_dishes") : t("card.show_dishes")}
        </button>

        <button
          className="btn-qr"
          onClick={() => setMostrarQR((prev) => !prev)}
        >
          {mostrarQR ? t("card.hide_qr") : t("card.my_qr")}
        </button>
      </div>

      {mostrarQR && (
        <div className="qr-individual">
          <QRCode value={qrValue} size={130} />
          <p>{t("card.rejoin_table")}</p>
        </div>
      )}

      {mostrarPlatos && (
        <div className="grupo-platos">
          <AprobarPlatos comensalId={comensal.id} />
        </div>
      )}
    </div>
  );
}

export default ComensalCard;
