// /src/services/authRoutes/RequireAuth.jsx
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { getCurrentUserRole } from "./roles";

export function RequireAuth({ allowed, children }) {
  const [status, setStatus] = useState("loading");
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 🔹 Obtener sesión activa
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) console.error("Error obteniendo sesión:", error);

        if (!session) {
          if (mounted) setStatus("denied");
          return;
        }

        // 🔹 Verificar rol del usuario
        const role = await getCurrentUserRole();
        if (mounted) {
          const hasAccess = role && allowed.includes(role);
          setStatus(hasAccess ? "ok" : "denied");
        }
      } catch (err) {
        console.error("Error en RequireAuth:", err);
        if (mounted) setStatus("denied");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [allowed]);

  // 🔸 Estado de carga
  if (status === "loading") {
    return <p className="p-4 text-center">Comprobando acceso...</p>;
  }

  // 🔸 Sin permiso o sin sesión → redirigir
  if (status === "denied") {
    return <Navigate to="/camarero/login" replace state={{ from: location }} />;
  }

  // 🔸 Autorizado → renderizar contenido
  return children;
}
