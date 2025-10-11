// frontend/src/pages/camarero/ComensalCard.jsx

import { useState, useEffect, useMemo } from "react";
import QRCode from "react-qr-code";
import AprobarPlatos from "../AprobarPlatos";
import { supabase } from "../../lib/supabaseClient";
import "../comensal/ComensalCard.css";

function ComensalCard({ comensal }) {
  const [mostrarPlatos, setMostrarPlatos] = useState(false);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [pendientes, setPendientes] = useState(comensal.platos_pendientes ?? 0);

  /** 🔹 Si la vista no trae `platos_pendientes`, lo calculamos aquí */
  useEffect(() => {
    const fetchPendientes = async () => {
      const { count, error } = await supabase
        .from("lineas_pedido")
        .select("id", { count: "exact" })
        .eq("comensal_id", comensal.id)
        .eq("estado", "pendiente");

      if (!error) setPendientes(count || 0);
    };

    // Ejecuta al montar
    fetchPendientes();

    // Suscríbete a cambios en la tabla lineas_pedido de este comensal
    const channel = supabase
      .channel(`comensal-${comensal.id}-lineas`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lineas_pedido" },
        fetchPendientes
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [comensal.id]);

  /** 🔹 Generar QR individual del comensal */
  const qrValue = useMemo(() => {
    if (!comensal?.id || !comensal?.mesa_id) return "";

    const payload = {
      mesa_id: comensal.mesa_id,
      comensal_id: comensal.id,
      nombre: comensal.nombre,
      token: comensal.token, // 🔹 token real
      session_id: comensal.session_id, // 🔹 sesión real
      ts: Date.now(),
    };

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    return `${window.location.origin}/comensal/menu-comida?mesa=${comensal.mesa_id}&comensal=${comensal.id}&token=${encoded}`;
  }, [comensal]);

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
        <div className="subtotal">
          💰 {Number(comensal.subtotal ?? 0).toFixed(2)} €
        </div>
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
