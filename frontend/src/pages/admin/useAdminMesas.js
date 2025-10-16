// frontend/src/pages/admin/useAdminMesas.js

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function useAdminMesas() {
  const [mesas, setMesas] = useState([]);

  const loadMesas = async () => {
    console.log("🔄 Cargando mesas...");
    const { data, error } = await supabase
      .from("mesas_con_comensales") // Usamos la vista correcta
      .select("*")
      .order("numero", { ascending: true });

    if (error) {
      console.error("❌ Error cargando mesas:", error);
      setMesas([]);
    } else {
      // Parseamos los campos JSON y convertimos total_mesa a número
      const mesasParseadas = data.map((mesa) => ({
        ...mesa,
        comensales_detalle:
          typeof mesa.comensales_detalle === "string"
            ? JSON.parse(mesa.comensales_detalle)
            : mesa.comensales_detalle || [],
        total_mesa:
          typeof mesa.total_mesa === "string"
            ? parseFloat(mesa.total_mesa)
            : mesa.total_mesa || 0,
      }));
      setMesas(mesasParseadas);
      console.log("✅ Mesas actualizadas:", mesasParseadas);
    }
  };

  useEffect(() => {
    loadMesas(); // Carga inicial

    const channel = supabase
      .channel("realtime-admin-mesas", {
        config: {
          presence: {
            key: "admin-mesas-presence",
          },
        },
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comensales" },
        (payload) => {
          console.log(
            "🔄 Cambio en comensales:",
            payload.eventType,
            payload.new?.id
          );
          loadMesas();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lineas_pedido" },
        (payload) => {
          console.log(
            "🔄 Cambio en lineas_pedido:",
            payload.eventType,
            payload.new?.id
          );
          loadMesas();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas" },
        (payload) => {
          console.log(
            "🔄 Cambio en mesas:",
            payload.eventType,
            payload.new?.numero
          );
          loadMesas();
        }
      )
      .subscribe((status) => {
        console.log("📡 Suscripción:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { mesas };
}
