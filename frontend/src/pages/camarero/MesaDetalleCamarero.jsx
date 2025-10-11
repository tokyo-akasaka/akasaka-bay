// frontend/src/pages/camarero/MesaDetalleCamarero.jsx

import React from "react";
import useMesaDetalle from "./useMesaDetalleCamarero";
import ComensalCard from "../comensal/ComensalCard";
import QRCode from "react-qr-code";
import "./MesaDetalleCamarero.css";

function MesaDetalleCamarero() {
  const {
    mesa,
    comensales,
    mostrarQR,
    setMostrarQR,
    qrValue,
    loading,
    navigate,
  } = useMesaDetalle();

  console.log("DEBUG mostrarQR:", mostrarQR, "qrValue:", qrValue);

  if (loading) return <p className="msg">⏳ Cargando mesa...</p>;
  if (!mesa) return <p className="msg">❌ No se encontró la mesa activa.</p>;

  const comensalesActivos = comensales.filter((c) => c.activo).length;

  return (
    <div className="mesa-detalle-container">
      <header className="mesa-header">
        <div className="mesa-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ⬅ Volver
          </button>
          <h1 className="mesa-titulo">🍽️ Mesa {mesa.numero}</h1>
        </div>
        <button
          className="qr-btn small"
          onClick={() => setMostrarQR(!mostrarQR)}
        >
          {mostrarQR ? "Ocultar QR" : "Mostrar QR"}
        </button>
      </header>

      <section className="mesa-info">
        <div>
          <strong>Comensales activos:</strong> {comensalesActivos} /{" "}
          {mesa.num_comensales}
        </div>
        <div>
          <strong>Estado:</strong>{" "}
          <span className={mesa.estado ? "open" : "closed"}>
            {mesa.estado ? "Abierta" : "Cerrada"}
          </span>
        </div>
      </section>

      <section className="mesa-comensales">
        <h2>👥 Lista de comensales</h2>
        {comensales.length > 0 ? (
          <div className="comensales-grid">
            {comensales.map((c) => (
              <ComensalCard key={c.id} comensal={c} />
            ))}
          </div>
        ) : (
          <p className="sin-comensales">No hay comensales registrados aún.</p>
        )}
      </section>

      {mostrarQR && qrValue ? (
        <section className="qr-section">
          <QRCode value={qrValue} size={200} />
          <p>📱 Escanea para unirte a la mesa número: {mesa.numero}</p>
        </section>
      ) : null}
    </div>
  );
}

export default MesaDetalleCamarero;
