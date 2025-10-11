// 📁 frontend/src/pages/comensal/useLineasPedidos.js

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { getComensalFromStorage } from "../../services/comensalLinks";

/**
 * Hook que gestiona las líneas de pedido del comensal.
 * Compatible con el formato unificado:
 * /comensal/mesa/:mesa?comensal=<id>&token=<token_base64>
 */
export function useLineasPedidos() {
  const { numero: mesa } = useParams(); // viene de /comensal/mesa/:numero
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [comensal, setComensal] = useState(null);
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mesaId = mesa;
    const comensalId = searchParams.get("comensal");
    const tokenEncoded = searchParams.get("token");

    if (!mesaId || !comensalId || !tokenEncoded) {
      alert(
        "⚠️ Faltan datos en la URL. Escanea nuevamente el QR del comensal."
      );
      setLoading(false);
      return;
    }

    let payload = null;
    try {
      payload = JSON.parse(atob(tokenEncoded));
      console.log("🟢 Token decodificado:", payload);
    } catch (err) {
      console.error("❌ Error al decodificar token:", err);
      alert("El QR no es válido o está corrupto.");
      setLoading(false);
      return;
    }

    const loadPedidos = async () => {
      try {
        const { data: comensalData, error: comErr } = await supabase
          .from("comensales")
          .select("id, nombre, mesa_id, subtotal, activo, pagado")
          .eq("id", comensalId)
          .eq("mesa_id", mesaId)
          .eq("token", payload.token)
          .maybeSingle();

        if (comErr || !comensalData) {
          console.error("❌ Comensal no encontrado o token inválido:", comErr);
          alert("Tu sesión no se pudo recuperar.");
          setLoading(false);
          return;
        }

        if (!comensalData.activo) {
          alert("⚠️ Tu sesión fue cerrada. Solicita un nuevo QR.");
          setLoading(false);
          return;
        }

        // ✅ Enriquecer comensal con token y session_id del payload
        const enriched = {
          ...comensalData,
          token: payload.token,
          session_id: payload.session_id ?? "fake-session",
        };
        setComensal(enriched);

        // 🍽️ Cargar líneas de pedido
        const { data: lineasData, error: lineasErr } = await supabase
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

        if (lineasErr) throw lineasErr;
        setLineas(lineasData || []);
      } catch (err) {
        console.error("💥 Error cargando pedidos:", err);
        alert("Error al cargar tus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();

    // 🔄 Suscripción en tiempo real
    const channel = supabase
      .channel(`lineas_pedido_comensal_${comensalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lineas_pedido",
          filter: `comensal_id=eq.${comensalId}`,
        },
        () => {
          loadPedidos(); // recargar pedidos al cambiar
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchParams, mesa, navigate]);

  return { mesa, comensal, lineas, loading };
}
