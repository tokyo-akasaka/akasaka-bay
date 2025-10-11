// frontend/src/pages/comensal/useLineasPedidos.js

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export function useLineasPedidos() {
  const { numero: mesa } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [comensal, setComensal] = useState(null);
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id");
    const comensalTokenParam = searchParams.get("comensal_token");
    const comensalIdParam = searchParams.get("comensal");
    const mesaId = mesa; // viene de useParams()

    // 🧩 Recuperar datos guardados en localStorage (fallback)
    const localComensal = JSON.parse(localStorage.getItem("comensal") || "{}");

    const sessionId = sessionIdParam || localComensal.session_id || null;
    const comensalToken = comensalTokenParam || localComensal.token || null;
    const comensalId = comensalIdParam || localComensal.id || null;

    if (!mesaId || !sessionId || !comensalToken || !comensalId) {
      alert("❌ Faltan datos en la URL o sesión. Escanea el QR nuevamente.");
      navigate("/");
      return;
    }

    const loadPedidos = async () => {
      try {
        // 1️⃣ Buscar comensal con validación completa
        const { data: comensalData, error: comensalError } = await supabase
          .from("comensales")
          .select("id, nombre, mesa_id, subtotal, activo, pagado")
          .eq("id", comensalId)
          .eq("mesa_id", mesaId)
          .eq("session_id", sessionId)
          .eq("token", comensalToken)
          .single();

        if (comensalError || !comensalData) {
          alert("❌ No se pudo validar tu sesión. Vuelve a escanear el QR.");
          navigate("/");
          return;
        }

        setComensal(comensalData);

        // 2️⃣ Cargar líneas de pedido
        const { data: lineasData, error: lineasError } = await supabase
          .from("lineas_pedido")
          .select(
            `
          id,
          cantidad,
          precio_unitario,
          subtotal,
          estado,
          creado_en,
          platos ( name_es, imagen )
        `
          )
          .eq("comensal_id", comensalData.id)
          .order("creado_en", { ascending: true });

        if (lineasError) throw lineasError;

        setLineas(lineasData || []);
      } catch (err) {
        console.error("Error cargando pedido:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();

    // 🔄 Suscripción en tiempo real
    const channel = supabase
      .channel("lineas_pedido_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lineas_pedido" },
        () => loadPedidos()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchParams, navigate, mesa]);

  return { mesa, comensal, lineas, loading };
}
