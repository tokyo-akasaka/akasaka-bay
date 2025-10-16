// frontend/src/pages/comensal/useComensalCard.js

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";

export function useComensalCard(comensal) {
  const [mostrarPlatos, setMostrarPlatos] = useState(false);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [pendientes, setPendientes] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  const loadData = async () => {
    if (!comensal?.id) return;
    try {
      // Contar platos pendientes
      const { count } = await supabase
        .from("lineas_pedido")
        .select("id", { count: "exact" })
        .eq("comensal_id", comensal.id)
        .eq("estado", "pendiente");
      setPendientes(count || 0);

      // Cargar subtotal actual
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

  useEffect(() => {
    if (!comensal?.id) return;
    loadData();

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
        loadData
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
          const nuevoSubtotal = payload.new?.subtotal ?? 0;
          setSubtotal(nuevoSubtotal);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [comensal?.id]);

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
    const encoded = btoa(JSON.stringify(payload));
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
    loadData,
  };
}
