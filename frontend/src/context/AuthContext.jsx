import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getCurrentUserRole } from "../services/authRoutes/roles";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null); // "camarero" | "comensal" | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const path = window.location.pathname;
        const onComensalRegistro = path.startsWith("/comensal/registro");

        // 1) LS por ámbito de ruta
        if (path.startsWith("/comensal")) {
          // Comensal solo vive en LS, no usa Supabase
          const comensal = JSON.parse(localStorage.getItem("comensal"));
          if (comensal) setRole("comensal");
        } else if (!onComensalRegistro) {
          // En cualquier otra ruta (home, /camarero, /admin), prioriza camarero LS
          const camarero = JSON.parse(localStorage.getItem("camarero"));
          if (camarero) setRole("camarero");
        }

        // 2) Sesión Supabase (para camarero)
        const { data } = await supabase.auth.getSession();
        const currentSession = data?.session || null;
        if (mounted) setSession(currentSession);

        if (currentSession?.user) {
          const roleDB = await getCurrentUserRole(); // devolverá "camarero" o null
          if (mounted) setRole((prev) => prev || roleDB || "camarero");
        }

        // 3) Listener de cambios Supabase
        const { data: listener } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            if (!mounted) return;
            setSession(newSession || null);
            if (newSession?.user) {
              const r = await getCurrentUserRole();
              setRole((prev) => prev || r || "camarero");
            } else {
              setRole(null);
            }
          }
        );

        if (mounted) setLoading(false);
        return () => listener.subscription.unsubscribe();
      } catch {
        if (mounted) setLoading(false);
      }
    };

    initAuth();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, role, loading }}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
