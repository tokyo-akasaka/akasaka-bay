// frontend/src/pages/comensal/useComensalCard.js

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";

/**
 * Hook que gestiona la lógica del componente ComensalCard:
 * - Escucha en tiempo real los cambios de lineas_pedido y comensales.
 * - Actualiza el número de pendientes y subtotal sin refrescar manualmente.
 * - Genera el QR individual.
 */
export function useComensalCard(comensal) {
  const [mostrarPlatos, setMostrarPlatos] = useState(false);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [pendientes, setPendientes] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  /** 🔹 Función reutilizable para recargar datos */
  const loadData = async () => {
    if (!comensal?.id) return;
    try {
      // 1️⃣ Contar platos pendientes
      const { count } = await supabase
        .from("lineas_pedido")
        .select("id", { count: "exact" })
        .eq("comensal_id", comensal.id)
        .eq("estado", "pendiente");
      setPendientes(count || 0);

      // 2️⃣ Cargar subtotal actual
      const { data } = await supabase
        .from("comensales")
        .select("subtotal")
        .eq("id", comensal.id)
        .single();
      if (data) setSubtotal(data.subtotal ?? 0);
    } catch (err) {
      console.error("Error cargando datos del comensal:", err);
    }
  };

  /** 🟢 Efecto principal: carga inicial + suscripciones */
  useEffect(() => {
    if (!comensal?.id) return;
    loadData(); // inicial

    // 🧩 Canal único con ambas suscripciones
    const channel = supabase
      .channel(`comensal-${comensal.id}-listener`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lineas_pedido",
          filter: `comensal_id=eq.${comensal.id}`,
        },
        (payload) => {
          console.log("📡 Cambios en lineas_pedido:", payload.eventType);
          loadData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "comensales",
          filter: `id=eq.${comensal.id}`,
        },
        (payload) => {
          console.log("📡 Cambio en comensales:", payload.eventType);
          const nuevoSubtotal = payload.new?.subtotal ?? 0;
          setSubtotal(nuevoSubtotal);
        }
      )
      .subscribe((status) => {
        console.log("🧩 Canal comensal conectado:", status);
      });

    // 🧹 Limpieza al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [comensal?.id]);

  /** 🔹 QR individual */
  const qrValue = useMemo(() => {
    if (!comensal?.id || !comensal?.mesa_id) return "";
    const payload = {
      mesa_id: comensal.mesa_id,
      comensal_id: comensal.id,
      nombre: comensal.nombre,
      token: comensal.token,
      session_id: comensal.session_id,
      ts: Date.now(),
    };
    const encoded = btoa(JSON.stringify(payload)); // ← escape eliminado
    return `${window.location.origin}/comensal/menu-comida?mesa=${comensal.mesa_id}&comensal=${comensal.id}&token=${encoded}`;
  }, [comensal]);

  return {
    mostrarPlatos,
    setMostrarPlatos,
    mostrarQR,
    setMostrarQR,
    pendientes,
    subtotal,
    qrValue,
  };
}
