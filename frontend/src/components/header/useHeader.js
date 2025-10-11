// 📁 components/header/useHeader.js

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export function useHeader(navigate) {
  const location = useLocation();
  const [camarero, setCamarero] = useState(null);
  const [comensal, setComensal] = useState(null);

  // Cargar camarero
  useEffect(() => {
    const stored = localStorage.getItem("camarero");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.id && parsed?.nombre) {
        setCamarero(parsed);
      } else {
        localStorage.removeItem("camarero");
      }
    } catch {
      localStorage.removeItem("camarero");
    }
  }, []);

  // Cargar comensal al cambiar de ruta
  useEffect(() => {
    const loadComensal = () => {
      const stored = localStorage.getItem("comensal");
      if (!stored) {
        console.log("🟢 useHeader: no hay comensal en storage");
        return setComensal(null);
      }
      try {
        const parsed = JSON.parse(stored);
        console.log("🔍 useHeader: parsed:", parsed);

        // Verifica campos mínimos
        if (parsed.id && parsed.nombre && parsed.token && parsed.mesa_id) {
          // No requiere session_id para mantener
          if (!parsed.session_id) {
            console.warn(
              "⚠ useHeader: comensal sin session_id, pero lo mantengo:",
              parsed
            );
          }
          setComensal(parsed);
        } else {
          console.warn(
            "🧨 useHeader: datos incompletos del comensal, eliminando:",
            parsed
          );
          localStorage.removeItem("comensal");
          setComensal(null);
        }
      } catch (err) {
        console.error("❌ useHeader: error parseando comensal:", err);
        localStorage.removeItem("comensal");
        setComensal(null);
      }
    };

    loadComensal();

    window.addEventListener("storage", loadComensal);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") loadComensal();
    });

    return () => {
      window.removeEventListener("storage", loadComensal);
      document.removeEventListener("visibilitychange", loadComensal);
    };
  }, [location.pathname]);

  const generarTokenComensal = (c) => {
    try {
      const payload = {
        mesa_id: c.mesa_id,
        comensal_id: c.id,
        nombre: c.nombre,
        token: c.token,
        session_id: c.session_id,
        ts: Date.now(),
      };
      return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    } catch {
      return null;
    }
  };

  const menuComidaLink = comensal
    ? `/comensal/menu-comida?mesa=${comensal.mesa_id}&comensal=${
        comensal.id
      }&token=${generarTokenComensal(comensal)}`
    : "#";

  const misPedidosLink = comensal
    ? `/comensal/mesa/${comensal.mesa_id}?comensal=${
        comensal.id
      }&token=${generarTokenComensal(comensal)}`
    : "#";

  const handleLogoutCamarero = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("camarero");
    setCamarero(null);
    navigate("/");
  };

  return {
    camarero,
    comensal,
    menuComidaLink,
    misPedidosLink,
    handleLogoutCamarero,
  };
}
