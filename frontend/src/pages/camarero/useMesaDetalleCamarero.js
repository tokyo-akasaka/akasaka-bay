// frontend/src/pages/camarero/useMesaDetalle.js

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function useMesaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mesa, setMesa] = useState(null);
  const [comensales, setComensales] = useState([]);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [qrToken, setQrToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Función común para cargar datos de la mesa
  const loadMesa = async () => {
    setLoading(true);
    try {
      // 📦 Consultar mesa activa
      const { data: mesaData, error: mesaError } = await supabase
        .from("mesas")
        .select("id, numero, estado, num_comensales, camarero_id, session_id")
        .eq("numero", id)
        .eq("estado", true)
        .single();

      if (mesaError || !mesaData) {
        console.error("No se encontró mesa activa:", mesaError);
        setMesa(null);
        setComensales([]);
        return;
      }

      setMesa(mesaData);

      // 👥 Cargar comensales actuales
      const { data: comData, error: comErr } = await supabase
        .from("comensales")
        .select("id, nombre, activo, token, mesa_id")
        .eq("mesa_id", mesaData.id);

      if (comErr) {
        console.error("Error cargando comensales:", comErr);
        setComensales([]);
      } else {
        setComensales(comData);
      }

      // 🎟️ Generar token QR para nuevos comensales (sin token de comensal)
      const payload = {
        mesa_id: mesaData.id,
        mesa_numero: mesaData.numero,
        camarero_id: mesaData.camarero_id,
        num_comensales: mesaData.num_comensales,
        session_id: mesaData.session_id,
        ts: Date.now(),
      };

      console.log("DEBUG payload QR:", payload);

      // ✅ Codificación robusta en UTF-8 → evita caracteres inválidos
      const encoded = btoa(
        unescape(encodeURIComponent(JSON.stringify(payload)))
      );

      // ✅ El QR apunta al registro de comensal (no a menú ni mesa)
      const qrUrl = `${window.location.origin}/comensal/registro?token=${encoded}`;

      console.log("DEBUG QR generado:", qrUrl);

      setQrToken(qrUrl);
    } catch (err) {
      console.error("Error en loadMesa:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 1️⃣ Cargar datos iniciales al montar o cambiar mesa
  useEffect(() => {
    loadMesa();
  }, [id]);

  // ✅ 2️⃣ Suscribirse a eventos en tiempo real (pedidos + comensales)
  useEffect(() => {
    const channelPedidos = supabase
      .channel("lineas_pedido_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lineas_pedido" },
        (payload) => {
          console.log("🧾 Cambio detectado en lineas_pedido:", payload);
          loadMesa();
        }
      )
      .subscribe();

    const channelComensales = supabase
      .channel("comensales_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comensales" },
        (payload) => {
          console.log("🧍‍♀️ Cambio detectado en comensales:", payload);
          loadMesa();
        }
      )
      .subscribe();

    // 🧹 Limpieza al desmontar
    return () => {
      supabase.removeChannel(channelPedidos);
      supabase.removeChannel(channelComensales);
    };
  }, []); // 👈 solo se crea una vez al montar

  return {
    mesa,
    comensales,
    mostrarQR,
    setMostrarQR,
    qrValue: qrToken,
    loading,
    navigate,
  };
}
