// frontend/src/pages/camarero/MesaDetalleCamarero.jsx

import { useTranslation } from "react-i18next";
import useMesaDetalle from "./useMesaDetalleCamarero";
import ComensalCard from "../comensal/ComensalCard";
import QRCode from "react-qr-code";
import "./MesaDetalleCamarero.css";

function MesaDetalleCamarero() {
  const { t } = useTranslation();

  const {
    mesa,
    comensales,
    mostrarQR,
    setMostrarQR,
    qrValue,
    loading,
    navigate,
  } = useMesaDetalle();

  if (loading) return <p className="msg">{t("table_detail_waiter.loading")}</p>;
  if (!mesa) return <p className="msg">{t("table_detail_waiter.not_found")}</p>;

  const comensalesActivos = comensales.filter((c) => c.activo).length;

  return (
    <div className="container">
      <header className="mesa-header">
        <button
          className="back-btn"
          onClick={() => navigate("/camarero/mesas")}
        >
          ⬅ {t("table_detail_waiter.back")}
        </button>
        <h1 className="mesa-titulo">
          🍽️ {t("table_detail_waiter.table")} {mesa.numero}
        </h1>
        <button
          className="qr-btn small"
          onClick={() => setMostrarQR(!mostrarQR)}
        >
          {mostrarQR
            ? t("table_detail_waiter.hide_qr")
            : t("table_detail_waiter.show_qr")}
        </button>
      </header>

      {mostrarQR && qrValue && (
        <section className="qr-section">
          <QRCode value={qrValue} size={200} />
          <p>
            {t("table_detail_waiter.scan_to_join")} {mesa.numero}
          </p>
        </section>
      )}

      <section className="mesa-info">
        <div>
          <strong>{t("table_detail_waiter.active_guests")}:</strong>{" "}
          {comensalesActivos} / {mesa.num_comensales}
        </div>
        <div>
          <strong>{t("table_detail_waiter.status")}:</strong>{" "}
          <span className={mesa.estado ? "open" : "closed"}>
            {mesa.estado
              ? t("table_detail_waiter.open")
              : t("table_detail_waiter.closed")}
          </span>
        </div>
      </section>

      <section className="mesa-comensales">
        <h2>{t("table_detail_waiter.guest_list")}</h2>
        {comensales.length > 0 ? (
          <div className="comensales-grid">
            {comensales.map((c) => (
              <ComensalCard key={c.id} comensal={c} modoCamarero={true} />
            ))}
          </div>
        ) : (
          <p className="sin-comensales">
            {t("table_detail_waiter.no_guests_yet")}
          </p>
        )}
      </section>
    </div>
  );
}

export default MesaDetalleCamarero;
