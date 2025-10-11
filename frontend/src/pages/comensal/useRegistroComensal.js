// frontend/src/pages/comensal/useRegistroComensal.js

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function useRegistroComensal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tokenData, setTokenData] = useState(null);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  // 🔹 Decodificar token QR al iniciar
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setTokenError(true);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token)); // ← escape eliminado
      console.log("🟢 Token decodificado:", decoded);
      setTokenData(decoded);
    } catch (err) {
      console.error("❌ Error al decodificar token:", err);
      setTokenError(true);
    }
  }, [searchParams]);

  // 🔹 Registrar comensal
  const handleRegistro = async () => {
    if (!nombre.trim()) {
      alert("Introduce tu nombre para continuar.");
      return;
    }
    if (!tokenData) {
      alert("Token inválido.");
      return;
    }

    const { mesa_id, mesa_numero, camarero_id, session_id, num_comensales } =
      tokenData;

    setLoading(true);
    try {
      // 1️⃣ Buscar mesa por ID
      const { data: mesa, error: mesaError } = await supabase
        .from("mesas")
        .select("id, numero, estado, session_id, num_comensales, camarero_id")
        .eq("id", mesa_id)
        .maybeSingle();

      if (mesaError || !mesa) {
        alert("Mesa no encontrada o sesión cerrada.");
        setLoading(false);
        return;
      }

      if (!mesa.estado) {
        alert("⚠️ La mesa ya no está activa.");
        setLoading(false);
        return;
      }

      if (mesa.session_id !== session_id) {
        alert("⚠️ El QR pertenece a otra sesión.");
        setLoading(false);
        return;
      }

      // 2️⃣ Generar token único de comensal
      const token = uuidv4();

      // 3️⃣ Insertar comensal
      const { data: nuevoComensal, error: comError } = await supabase
        .from("comensales")
        .insert([
          {
            mesa_id,
            nombre,
            activo: true,
            camarero_id,
            session_id,
            token,
          },
        ])
        .select("id, token")
        .single();

      if (comError || !nuevoComensal) {
        console.error("❌ Error al insertar comensal:", comError);
        alert("No se pudo registrar el comensal. Intenta más tarde.");
        setLoading(false);
        return;
      }

      // 4️⃣ Guardar en localStorage
      localStorage.setItem(
        "comensal",
        JSON.stringify({
          id: nuevoComensal.id,
          nombre,
          token: nuevoComensal.token,
          mesa_id,
          session_id,
          camarero_id,
        })
      );

      // 5️⃣ Generar QR individual (recuperación futura)
      const payload = {
        mesa_id,
        comensal_id: nuevoComensal.id,
        nombre,
        token: nuevoComensal.token,
        session_id,
        ts: Date.now(),
      };
      const encoded = btoa(JSON.stringify(payload)); // ← escape eliminado

      // 6️⃣ Redirigir al menú del comensal
      navigate(
        `/comensal/menu-comida?mesa=${mesa_id}&comensal=${nuevoComensal.id}&token=${encoded}`
      );
    } catch (err) {
      console.error("💥 Error general en registro comensal:", err);
      alert("Error al registrarte. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return {
    tokenData,
    nombre,
    setNombre,
    loading,
    handleRegistro,
    tokenError,
  };
}
