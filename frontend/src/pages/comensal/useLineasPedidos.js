// frontend/src/pages/comensal/useLineasPedidos.js

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export function useLineasPedidos() {
  const { numero: mesa } = useParams();
  const [searchParams] = useSearchParams();

  const [comensal, setComensal] = useState(null);
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mesaId = mesa;
    const comensalId = searchParams.get("comensal");
    const tokenEncoded = searchParams.get("token");

    console.log(
      "useLineasPedidos: mesaId=",
      mesaId,
      " comensalId=",
      comensalId,
      " token=",
      tokenEncoded
    );

    if (!mesaId || !comensalId || !tokenEncoded) {
      console.warn("Faltan datos en URL");
      setLoading(false);
      return;
    }

    let payload = null;
    try {
      payload = JSON.parse(atob(tokenEncoded));
      console.log("Token decodificado:", payload);
    } catch (err) {
      console.error("Error decodificando token:", err);
      setLoading(false);
      return;
    }

    const loadPedidos = async () => {
      setLoading(true);
      try {
        const { data: comData, error: comErr } = await supabase
          .from("comensales")
          .select("id, nombre, mesa_id, subtotal, activo, pagado")
          .eq("id", comensalId)
          .eq("mesa_id", mesaId)
          .eq("token", payload.token)
          .maybeSingle();

        console.log("comData:", comData, " comErr:", comErr);

        if (comErr || !comData) {
          console.warn("Comensal no encontrado o error:", comErr);
          setComensal(null);
          setLineas([]);
          return;
        }

        if (!comData.activo) {
          console.warn("Comensal no activo");
          setComensal(null);
          setLineas([]);
          return;
        }

        setComensal(comData);

        const { data: linData, error: linErr } = await supabase
          .from("lineas_pedido")
          .select(
            `
            id,
            cantidad,
            precio_unitario,
            subtotal,
            estado,
            creado_en,
            platos (*)
          `
          )
          .eq("comensal_id", comData.id)
          .order("creado_en", { ascending: true });

        console.log("linData:", linData, " linErr:", linErr);

        if (linErr) {
          setLineas([]);
        } else {
          setLineas(linData || []);
        }
      } catch (err) {
        console.error("Error en loadPedidos:", err);
        setLineas([]);
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();

    const channel = supabase
      .channel(`lineas_pedido_comensal_${comensalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lineas_pedido",
        },
        (payload) => {
          console.log("Realtime event payload:", payload);
          const affectedId =
            payload.new?.comensal_id ?? payload.old?.comensal_id;
          if (parseInt(affectedId, 10) === parseInt(comensalId, 10)) {
            console.log("Refrescando pedidos porque afecta comensal");
            loadPedidos();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      console.log(
        "Suscripción removida:",
        `lineas_pedido_comensal_${comensalId}`
      );
    };
  }, [mesa, searchParams]);

  return { comensal, lineas, loading };
}
