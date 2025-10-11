// frontend/src/pages/admin/useAdminMesas.js

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function useAdminMesas() {
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    const loadMesas = async () => {
      const { data, error } = await supabase
        .from("mesas_con_comensales")
        .select(
          "id, numero, nombre_camarero, estado, comensales_activos, num_comensales, platos_pendientes"
        )
        .order("numero", { ascending: true });

      if (error) {
        console.error("❌ Error cargando mesas:", error);
      } else {
        setMesas(data || []);
      }
    };

    loadMesas();

    // 🔄 Suscripción en tiempo real para reflejar cambios de mesas
    const channel = supabase
      .channel("admin-mesas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas" },
        () => loadMesas()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { mesas };
}
