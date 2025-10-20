import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function useAdminMesas() {
  const [mesas, setMesas] = useState([]);

  const parseMesa = (mesa) => ({
    ...mesa,
    comensales_detalle:
      typeof mesa.comensales_detalle === "string"
        ? JSON.parse(mesa.comensales_detalle)
        : mesa.comensales_detalle || [],
    total_mesa:
      typeof mesa.total_mesa === "string"
        ? parseFloat(mesa.total_mesa)
        : mesa.total_mesa || 0,
  });

  const loadMesas = async () => {
    const { data, error } = await supabase
      .from("mesas_con_comensales")
      .select("*")
      .order("numero", { ascending: true });

    if (error) {
      console.error("❌ Error cargando mesas:", error);
      return;
    }

    setMesas(data.map(parseMesa));
  };

  useEffect(() => {
    loadMesas(); // carga inicial

    const channel = supabase
      .channel("realtime-mesas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas" },
        (payload) => {
          console.log("📦 mesas:", payload.eventType, payload);
          loadMesas();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comensales" },
        (payload) => {
          console.log("👤 comensales:", payload.eventType, payload);
          loadMesas();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lineas_pedido" },
        (payload) => {
          console.log("🍽️ lineas_pedido:", payload.eventType, payload);
          loadMesas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { mesas };
}
