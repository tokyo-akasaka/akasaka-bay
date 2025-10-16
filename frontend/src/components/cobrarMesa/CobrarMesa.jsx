// src/components/cobrarMesa/CobrarMesa.jsx

import React from "react";
import { useParams } from "react-router-dom";
import { useCobrarMesa } from "./useCobrarMesa";
import "./CobrarMesa.css";

function CobrarMesa() {
  const { mesaId } = useParams(); // si usas ruta /cobrar/:mesaId
  const {
    mesa,
    comensales,
    totalMesa,
    pendientes,
    cargando,
    error,
    cobrarYcerrar,
  } = useCobrarMesa(mesaId);

  const handleCobrar = async () => {
    const result = await cobrarYcerrar();
    if (result.success) {
      alert("Mesa cobrada y cerrada correctamente");
      // opcional: navegar o refrescar vista
    } else {
      alert("Error al cerrar la mesa: " + (result.error?.message || ""));
    }
  };

  if (cargando) return <p className="msg">Cargando...</p>;
  if (error) return <p className="msg error">Error: {String(error)}</p>;
  if (!mesa) return <p className="msg">Mesa no encontrada</p>;

  return (
    <div className="cobrar-mesa-container">
      <h2>Cobrar Mesa #{mesa.numero}</h2>

      <div className="resumen-mesa">
        <p>
          <strong>Total mesa:</strong> {Number(totalMesa).toFixed(2)} €
        </p>
        <p>
          <strong>Platos pendientes:</strong> {pendientes}
        </p>
      </div>

      <div className="lista-comensales">
        {comensales.map((c) => (
          <div key={c.id} className="comensal-line">
            <span>{c.nombre}</span>
            <span>{Number(c.subtotal ?? 0).toFixed(2)} €</span>
          </div>
        ))}
      </div>

      <div className="acciones-cobrar">
        <button
          className="btn-cobrar"
          onClick={handleCobrar}
          disabled={pendientes > 0}
        >
          {pendientes > 0 ? "No puede cobrar" : "Cobrar y cerrar mesa"}
        </button>
      </div>
    </div>
  );
}

export default CobrarMesa;
