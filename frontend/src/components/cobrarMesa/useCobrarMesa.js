import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function useCobrarMesa(mesaId) {
  const [mesa, setMesa] = useState(null);
  const [comensales, setComensales] = useState([]);
  const [totalMesa, setTotalMesa] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);

  const loadData = async () => {
    if (!mesaId) return;

    setCargando(true);
    setError(null);

    try {
      // 1. Obtener datos de la mesa y comensales
      const { data: mesaData, error: mesaErr } = await supabase
        .from("mesas_con_comensales")
        .select("*, comensales_detalle")
        .eq("id", mesaId)
        .single();

      if (mesaErr) throw mesaErr;
      if (!mesaData) throw new Error("Mesa no encontrada");

      setMesa(mesaData);
      const detalle = mesaData.comensales_detalle || [];

      // 2. Calcular total y pendientes
      const totalCalc = detalle.reduce((acc, c) => acc + (c.subtotal || 0), 0);
      let totalPend = 0;

      detalle.forEach((c) => {
        if (c.platos && Array.isArray(c.platos)) {
          totalPend += c.platos.filter((p) => p.estado === "pendiente").length;
        }
      });

      setComensales(detalle);
      setTotalMesa(totalCalc);
      setPendientes(totalPend);
    } catch (err) {
      console.error("💥 Error en carga de mesa:", err.message);
      setError(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!mesaId) return;

    loadData();

    // Suscripción a cambios en tiempo real
    channelRef.current = supabase
      .channel(`realtime-cobrar-mesa-${mesaId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lineas_pedido",
          filter: `mesa_id=eq.${mesaId}`,
        },
        (payload) => {
          console.log("📡 Cambio detectado en lineas_pedido:", payload);
          loadData();
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [mesaId]);

  return {
    mesa,
    comensales,
    totalMesa,
    pendientes,
    cargando,
    error,
    reload: loadData,
  };
}
