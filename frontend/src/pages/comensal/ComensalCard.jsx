// frontend/src/pages/comensal/ComensalCard.jsx

import QRCode from "react-qr-code";
import AprobarPlatos from "../camarero/AprobarPlatos";
import { useComensalCard } from "./useComensalCard";
import "./ComensalCard.css";

function ComensalCard({ comensal }) {
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
      {/* --- Cabecera --- */}
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
          🍽️ Pendientes: {pendientes}
        </div>

        <div className="subtotal">💰 {Number(subtotal ?? 0).toFixed(2)} €</div>
      </div>

      {/* --- Botones --- */}
      <div className="comensal-actions">
        <button
          className="btn-toggle"
          onClick={() => setMostrarPlatos((prev) => !prev)}
        >
          {mostrarPlatos ? "Ocultar platos" : "Ver platos"}
        </button>

        <button
          className="btn-qr"
          onClick={() => setMostrarQR((prev) => !prev)}
        >
          {mostrarQR ? "Ocultar QR" : "📱 Mi QR"}
        </button>
      </div>

      {/* --- QR individual --- */}
      {mostrarQR && (
        <div className="qr-individual">
          <QRCode value={qrValue} size={130} />
          <p>Reincorporar a la mesa</p>
        </div>
      )}

      {/* --- Lista de platos --- */}
      {mostrarPlatos && (
        <div className="grupo-platos">
          <AprobarPlatos comensalId={comensal.id} />
        </div>
      )}
    </div>
  );
}

export default ComensalCard;
