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

  useEffect(() => {
    const loadMesa = async () => {
      setLoading(true);
      try {
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

        // Cargar comensales
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

        // Preparar token
        const payload = {
          mesa_id: mesaData.id,
          mesa_numero: mesaData.numero,
          camarero_id: mesaData.camarero_id,
          num_comensales: mesaData.num_comensales,
          session_id: mesaData.session_id,
        };
        console.log("DEBUG payload QR:", payload);

        const encoded = btoa(JSON.stringify(payload));
        console.log("DEBUG encoded token:", encoded);

        setQrToken(
          `${window.location.origin}/comensal/registro?token=${encoded}`
        );
      } catch (err) {
        console.error("Error en useMesaDetalle:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMesa();
  }, [id]);

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
