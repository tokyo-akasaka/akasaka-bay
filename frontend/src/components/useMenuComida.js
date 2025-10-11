// frontend/src/components/useMenuComida.js

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function useMenuComida() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [comensal, setComensal] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [platos, setPlatos] = useState([]);

  useEffect(() => {
    const mesaId = searchParams.get("mesa");
    const comensalId = searchParams.get("comensal");
    const token =
      searchParams.get("token") || searchParams.get("comensal_token");

    // 🧩 Recuperar también session_id de URL o localStorage
    const urlSessionId = searchParams.get("session_id");
    const localData = JSON.parse(localStorage.getItem("comensal") || "{}");
    const sessionId = urlSessionId || localData.session_id || null;

    if (!mesaId || !token) {
      alert("❌ Faltan datos en la URL. Escanea el QR nuevamente.");
      navigate("/");
      return;
    }

    let payload = null;

    try {
      if (/^[A-Za-z0-9+/=]+$/.test(token) && token.length % 4 === 0) {
        // Token de mesa (base64)
        payload = JSON.parse(decodeURIComponent(escape(atob(token))));
        console.log("🟢 Token decodificado:", payload);
      } else {
        // Token de comensal (UUID directo)
        console.log("⚠️ Token no codificado, usando UUID directo:", token);
        payload = {
          mesa_id: parseInt(mesaId),
          comensal_id: comensalId ? parseInt(comensalId) : null,
          session_id: sessionId,
          comensal_token: token,
        };
      }
    } catch (err) {
      console.error("❌ Token inválido:", err);
      alert("El QR no es válido o está corrupto.");
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        const { mesa_id, session_id, comensal_token } = payload;

        // 1️⃣ Validar comensal
        const { data: comensalData, error: comensalError } = await supabase
          .from("comensales")
          .select(
            "id, nombre, mesa_id, subtotal, activo, pagado, mesas(numero)"
          )
          .eq("mesa_id", mesa_id)
          .eq("session_id", session_id)
          .eq("token", comensal_token)
          .maybeSingle();

        if (comensalError || !comensalData) {
          console.error("❌ Error validando comensal:", comensalError);
          alert("❌ No se pudo validar tu sesión. Escanea el QR de nuevo.");
          navigate("/");
          return;
        }

        setComensal(comensalData);

        // 2️⃣ Cargar categorías
        const { data: categoriasData } = await supabase
          .from("categorias_menu")
          .select("id, title_es, title_en, title_cn")
          .order("id", { ascending: true });
        setCategorias(categoriasData || []);

        // 3️⃣ Cargar platos
        const { data: platosData } = await supabase
          .from("platos")
          .select(
            "id, categoria_id, code, name_es, name_en, name_cn, descripcion_es, precio, price_descript, imagen, activo"
          )
          .eq("activo", true)
          .order("id", { ascending: true });
        setPlatos(platosData || []);
      } catch (err) {
        console.error("💥 Error general en MenuComida:", err);
        alert("Ocurrió un error cargando los datos del menú.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams, navigate]);

  // 🧩 Agrupar platos por categoría (estructura que espera MenuComida.jsx)
  const platosPorCategoria = categorias.map((cat) => ({
    id: cat.id,
    title_es: cat.title_es,
    items: platos.filter((p) => p.categoria_id === cat.id),
  }));

  // Añadir dentro de useMenuComida()
  const handleAddToOrder = async (plato) => {
    try {
      const localComensal = JSON.parse(
        localStorage.getItem("comensal") || "{}"
      );

      if (!localComensal?.id || !localComensal?.session_id) {
        alert("❌ No se pudo identificar tu sesión. Escanea el QR nuevamente.");
        navigate("/");
        return;
      }

      // Insertar línea de pedido
      const { data, error } = await supabase
        .from("lineas_pedido")
        .insert([
          {
            comensal_id: localComensal.id,
            plato_id: plato.id,
            cantidad: 1,
            precio_unitario: plato.precio,
            estado: "pendiente",
            // subtotal se genera automáticamente
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error("❌ Error al añadir plato:", error);
        alert("Error al añadir el plato. Intenta de nuevo.");
        return;
      }

      console.log("🟢 Plato añadido al pedido:", data);
      alert(`✅ ${plato.name_es} añadido a tu pedido.`);
    } catch (err) {
      console.error("💥 Error general en handleAddToOrder:", err);
      alert("Error inesperado al añadir el plato.");
    }
  };

  // ✅ Retornar todos los valores esperados por MenuComida.jsx
  return {
    loading,
    comensal,
    categorias,
    platos,
    platosPorCategoria,
    handleAddToOrder,
  };
}
