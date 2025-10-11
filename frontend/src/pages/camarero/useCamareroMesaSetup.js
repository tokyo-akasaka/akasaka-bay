// src/pages/camarero/useCamareroMesaSetup.js

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function useCamareroMesaSetup() {
  const [mesasFisicas, setMesasFisicas] = useState([]);
  const [comensalesPorMesa, setComensalesPorMesa] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 Cargar todas las mesas físicas al iniciar
  useEffect(() => {
    fetchMesasFisicas();
  }, []);

  const fetchMesasFisicas = async () => {
    const { data, error } = await supabase
      .from("mesas_fisicas")
      .select("numero, esta_abierta, session_id_activa, camarero_id");

    if (error) {
      console.error("Error al recuperar mesas físicas:", error);
      setError(error);
    } else {
      setMesasFisicas(data);
    }
  };

  const abrirMesa = async (numeroMesa, camarero, numComensales) => {
    if (!numeroMesa || isNaN(numeroMesa)) {
      alert("Número de mesa inválido");
      return;
    }
    if (!numComensales || isNaN(numComensales) || numComensales <= 0) {
      alert("Número de comensales inválido");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Verificar que la mesa no está ya abierta
      const { data: mesaFisica, error: errorMesaFisica } = await supabase
        .from("mesas_fisicas")
        .select("esta_abierta")
        .eq("numero", numeroMesa)
        .single();

      if (errorMesaFisica) throw errorMesaFisica;
      if (mesaFisica.esta_abierta) {
        alert("⚠️ La mesa ya está abierta.");
        return;
      }

      // 2️⃣ Insertar sesión en tabla "mesas"
      const { data: nuevaMesa, error: errorNuevaMesa } = await supabase
        .from("mesas")
        .insert([
          {
            numero: numeroMesa,
            camarero_id: camarero.id,
            num_comensales: numComensales,
            estado: true,
          },
        ])
        .select("id, session_id")
        .single();

      if (errorNuevaMesa) throw errorNuevaMesa;

      // 3️⃣ Actualizar estado en "mesas_fisicas"
      const { error: errorUpdate } = await supabase
        .from("mesas_fisicas")
        .update({
          esta_abierta: true,
          session_id_activa: nuevaMesa.session_id,
          camarero_id: camarero.id,
        })
        .eq("numero", numeroMesa);

      if (errorUpdate) throw errorUpdate;

      // ✅ Recargar mesas
      fetchMesasFisicas();
    } catch (err) {
      console.error("❌ Error abriendo mesa:", err);
      alert("No se pudo abrir la mesa. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return {
    mesasFisicas,
    comensalesPorMesa,
    setComensalesPorMesa,
    abrirMesa,
    loading,
    error,
  };
}
