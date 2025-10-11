// frontend/src/pages/camarero/useCamareroMesas.js

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function useCamareroMesas() {
  const navigate = useNavigate();
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("camarero");
    if (!stored) {
      navigate("/camarero/login");
      return;
    }

    let camareroId;
    try {
      const parsed = JSON.parse(stored);
      camareroId = parsed.id;
    } catch (err) {
      console.error("Error leyendo camarero:", err);
      navigate("/camarero/login");
      return;
    }

    if (!camareroId) {
      navigate("/camarero/login");
      return;
    }

    const loadMesas = async () => {
      const { data, error } = await supabase
        .from("mesas_con_comensales")
        .select(
          "id, numero, estado, num_comensales, comensales_activos, platos_pendientes"
        )
        .eq("camarero_id", camareroId)
        .order("numero", { ascending: true });

      if (error) {
        console.error("Error cargando mesas:", error);
      } else {
        setMesas(data || []);
      }
    };

    loadMesas();

    const channel = supabase
      .channel("camarero-mesas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas" },
        () => loadMesas()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const verMesa = (numero) => {
    navigate(`/camarero/mesas/${numero}`);
  };

  return { mesas, verMesa };
}
