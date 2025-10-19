// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getCurrentUserRole } from "../services/authRoutes/roles";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1️⃣ Chequeo inmediato: comensal local
      const stored = localStorage.getItem("comensal");
      if (stored) {
        setRole("comensal");
        setLoading(false);
        return;
      }

      // 2️⃣ Supabase
      const { data } = await supabase.auth.getSession();
      setSession(data?.session || null);

      if (data?.session?.user) {
        const role = await getCurrentUserRole();
        setRole(role);
      }

      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ role, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
