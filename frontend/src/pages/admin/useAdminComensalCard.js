import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export function useAdminComensalCard(comensal) {
  const [expandido, setExpandido] = useState(false);
  const [platos, setPlatos] = useState([]);
  const [pendientes, setPendientes] = useState(0);
  const [subtotal, setSubtotal] = useState(comensal?.subtotal ?? 0);

  const toggleExpandido = () => setExpandido((prev) => !prev);

  const loadData = async () => {
    if (!comensal?.id) return;

    try {
      // 🔹 Cargar las líneas de pedido con datos del plato
      const { data: lineas, error } = await supabase
        .from("lineas_pedido")
        .select(
          `
          id,
          cantidad,
          precio_unitario,
          subtotal,
          estado,
          creado_en,
          platos(
            id,
            code,
            name_es,
            name_en,
            name_cn
          )
        `
        )
        .eq("comensal_id", comensal.id)
        .order("creado_en", { ascending: true });

      if (error) {
        console.error("❌ Error cargando líneas de pedido:", error);
        setPlatos([]);
      } else {
        setPlatos(lineas || []);
        const countPend = (lineas || []).filter(
          (l) => l.estado === "pendiente"
        ).length;
        setPendientes(countPend);
      }

      // 🔹 Cargar subtotal actualizado del comensal
      const { data: comData, error: comErr } = await supabase
        .from("comensales")
        .select("subtotal")
        .eq("id", comensal.id)
        .single();

      if (!comErr && comData) {
        setSubtotal(comData.subtotal ?? 0);
      }
    } catch (err) {
      console.error("⚠️ Error en loadData (admin):", err);
    }
  };

  // 🔹 Efecto para suscribirse a cambios en Supabase
  useEffect(() => {
    if (!comensal?.id) return;
    loadData();

    const channel = supabase
      .channel(`admin-comensal-${comensal.id}`)
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

  return {
    expandido,
    toggleExpandido,
    platos,
    pendientes,
    subtotal,
    loadData,
  };
}
