// ✅ useHeader.js — estructura fija y segura
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export function useHeader(navigate) {
  const location = useLocation();
  const [camarero, setCamarero] = useState(null);
  const [comensal, setComensal] = useState(null);

  const loadCamarero = useCallback(() => {
    try {
      const stored = localStorage.getItem("camarero");
      if (!stored) return setCamarero(null);
      const parsed = JSON.parse(stored);
      if (parsed?.id && parsed?.nombre) setCamarero(parsed);
      else {
        localStorage.removeItem("camarero");
        setCamarero(null);
      }
    } catch {
      localStorage.removeItem("camarero");
      setCamarero(null);
    }
  }, []);

  const loadComensal = useCallback(() => {
    try {
      const stored = localStorage.getItem("comensal");
      if (!stored) return setComensal(null);
      const parsed = JSON.parse(stored);
      if (parsed.id && parsed.nombre && parsed.token && parsed.mesa_id)
        setComensal(parsed);
      else {
        localStorage.removeItem("comensal");
        setComensal(null);
      }
    } catch {
      localStorage.removeItem("comensal");
      setComensal(null);
    }
  }, []);

  useEffect(() => {
    loadCamarero();
    loadComensal();

    const handleStorage = (e) => {
      if (["camarero", "comensal"].includes(e.key)) {
        loadCamarero();
        loadComensal();
      }
    };
    window.addEventListener("storage", handleStorage);

    const handleVisible = () => {
      if (document.visibilityState === "visible") {
        loadCamarero();
        loadComensal();
      }
    };
    document.addEventListener("visibilitychange", handleVisible);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, [location.pathname, loadCamarero, loadComensal]);

  const handleLogoutCamarero = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("camarero");
    setCamarero(null);
    navigate("/");
  };

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

  return {
    camarero,
    comensal,
    menuComidaLink,
    misPedidosLink,
    handleLogoutCamarero,
  };
}
