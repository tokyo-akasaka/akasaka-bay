// frontend/src/pages/comensal/useRegistroComensal.js

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

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
      const decoded = JSON.parse(atob(token));
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

      console.log("🟢 Datos del token:", {
        mesa_id,
        mesa_numero,
        camarero_id,
        session_id,
        num_comensales,
      });
      console.log("📦 Resultado Supabase (mesa):", mesa);
      console.log("🔍 Error Supabase:", mesaError);

      if (mesaError) {
        console.error("Error al consultar mesa:", mesaError);
        alert("Error interno consultando mesa.");
        setLoading(false);
        return;
      }

      if (!mesa) {
        console.warn("❌ Mesa no encontrada en Supabase");
        alert("Mesa no encontrada o sesión ya cerrada.");
        setLoading(false);
        return;
      }

      // 2️⃣ Validaciones individuales (más claras)
      if (!mesa.estado) {
        console.warn("⚠️ Mesa cerrada o inactiva");
        alert("La mesa ya no está activa.");
        setLoading(false);
        return;
      }

      if (mesa.session_id !== session_id) {
        console.warn("⚠️ Sesión no coincide");
        console.log("➡️ Token session_id:", session_id);
        console.log("➡️ Mesa session_id:", mesa.session_id);
        alert("El QR pertenece a una sesión anterior o distinta.");
        setLoading(false);
        return;
      }

      if (mesa.numero !== mesa_numero) {
        console.warn("⚠️ Número de mesa no coincide");
        alert("El QR no pertenece a esta mesa.");
        setLoading(false);
        return;
      }

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
          },
        ])
        .select("id, token")
        .single();

      if (comError || !nuevoComensal) {
        console.error("❌ Error al insertar comensal:", comError);
        alert("No se pudo registrarte. Intenta más tarde.");
        setLoading(false);
        return;
      }

      // 4️⃣ Guardar sesión del comensal en localStorage
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

      // 5️⃣ Redirigir al menú
      navigate(
        `/comensal/menu-comida?mesa=${mesa_id}&comensal=${nuevoComensal.id}&token=${nuevoComensal.token}`
      );
    } catch (err) {
      console.error("❌ Error general en registro comensal:", err);
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
