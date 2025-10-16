// 📁 frontend/src/components/useMenuComida.js

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getComensalFromStorage } from "../services/comensalLinks";

export default function useMenuComida() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [comensal, setComensal] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [platos, setPlatos] = useState([]);

  useEffect(() => {
    const mesaId = searchParams.get("mesa");
    const comensalId = searchParams.get("comensal");
    const tokenEncoded = searchParams.get("token");

    if (!mesaId || !comensalId || !tokenEncoded) {
      alert(
        "⚠️ Falta información en el enlace. Escanea nuevamente el QR de tu mesa."
      );
      setLoading(false);
      return;
    }

    let payload = null;
    try {
      payload = JSON.parse(atob(tokenEncoded)); // Decodificar token
      console.log("🟢 Token decodificado:", payload);
    } catch (err) {
      console.error("❌ Error al decodificar token:", err);
      alert("El QR no es válido o está corrupto.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      console.log("⚙️ loadData iniciado con token:", tokenEncoded);
      try {
        const { data: comensalData, error: comErr } = await supabase
          .from("comensales")
          .select(
            "id, nombre, mesa_id, subtotal, activo, pagado, mesa:comensales_mesa_id_fkey ( numero )"
          )
          .eq("id", comensalId)
          .eq("mesa_id", mesaId)
          .eq("token", payload.token)
          .maybeSingle();

        if (comErr || !comensalData) {
          console.error("❌ Comensal no encontrado o token inválido:", comErr);
          alert(
            "Tu sesión no se pudo recuperar. Pide al camarero que escanee nuevamente el QR."
          );
          setLoading(false);
          return;
        }

        if (!comensalData.activo) {
          alert("⚠️ Tu sesión fue cerrada. Solicita al camarero un nuevo QR.");
          setLoading(false);
          return;
        }

        // ✅ Combinar datos con token y session_id antes de guardar
        const enrichedComensal = {
          ...comensalData,
          token: payload.token,
          session_id: payload.session_id || "fake-session", // fallback
        };

        console.log("✅ comensalData enriquecido:", enrichedComensal);

        setComensal(enrichedComensal);

        // 🍱 Cargar categorías y platos
        const { data: categoriasData } = await supabase
          .from("categorias_menu")
          .select("id, title_es, title_en, title_cn")
          .order("id", { ascending: true });
        setCategorias(categoriasData || []);

        const { data: platosData } = await supabase
          .from("platos")
          .select(
            "id, categoria_id, code, name_es, name_en, name_cn, descripcion_es, precio, price_descript, imagen, activo"
          )
          .eq("activo", true)
          .order("id", { ascending: true });
        setPlatos(platosData || []);
      } catch (err) {
        console.error("💥 Error general en useMenuComida:", err);
        alert("Error al cargar los datos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // 🔹 Guardar el comensal en localStorage cuando cambie
  useEffect(() => {
    if (comensal) {
      try {
        localStorage.setItem("comensal", JSON.stringify(comensal));
        const storedComensal = localStorage.getItem("comensal");
        console.log(
          "📦 LocalStorage después de guardar:",
          storedComensal ? JSON.parse(storedComensal) : null
        );
      } catch (err) {
        console.error("❌ Error guardando comensal:", err);
      }
    }
  }, [comensal]);

  // 🔍 Debug opcional para inspeccionar estado actual del localStorage
  const storedComensal = localStorage.getItem("comensal");
  console.log(
    "📦 LocalStorage fuera de hooks:",
    storedComensal ? JSON.parse(storedComensal) : null
  );

  // 🔹 Agrupar platos por categoría
  const platosPorCategoria = categorias.map((cat) => ({
    ...cat,
    platos: platos.filter((p) => p.categoria_id === cat.id),
  }));
  //----------------------------------------------------------

  const handleAddToOrder = async (plato) => {
    const comensal = getComensalFromStorage();

    if (!comensal) {
      alert("⚠️ No se encontró tu sesión de comensal.");
      return;
    }

    try {
      const { error } = await supabase.from("lineas_pedido").insert([
        {
          comensal_id: comensal.id,
          plato_id: plato.id,
          cantidad: 1,
          precio_unitario: plato.precio,
        },
      ]);

      if (error) {
        console.error("❌ Error al añadir plato:", error);
        alert("No se pudo añadir el plato. Intenta nuevamente.");
      } else {
        alert(`✅ Plato añadido: ${plato.name_es} 🍽️`);
      }
    } catch (err) {
      console.error("💥 Error inesperado al añadir plato:", err);
      alert("Ocurrió un error al añadir el plato.");
    }
  };

  //----------------------------------------------------------
  return {
    loading,
    comensal,
    categorias,
    platos,
    platosPorCategoria,
    handleAddToOrder,
  };
}
