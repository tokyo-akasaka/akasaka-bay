// /src/services/authRoutes/RequireAuth.jsx
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "./auth";
import { getCurrentUserRole } from "./roles";

export function RequireAuth({ allowed, children }) {
  const [status, setStatus] = useState("loading");
  const loc = useLocation();

  useEffect(() => {
    let active = true;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        if (active) setStatus("denied");
        return;
      }
      const role = await getCurrentUserRole();
      if (active) {
        setStatus(role && allowed.includes(role) ? "ok" : "denied");
      }
    })();
    return () => {
      active = false;
    };
  }, [allowed]);

  if (status === "loading")
    return <p className="p-4 text-center">Comprobando acceso...</p>;
  if (status === "denied")
    return <Navigate to="/login" replace state={{ from: loc }} />;

  return children;
}
