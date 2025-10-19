// /src/services/authRoutes/roles.js
import { supabase } from "../../lib/supabaseClient";

/**
 * Determina el rol actual del usuario.
 * - Si hay datos del comensal en localStorage → "comensal"
 * - Si hay sesión Supabase → rol según JWT (app_metadata.role)
 * - Si no hay nada → null
 */
export async function getCurrentUserRole() {
  // 1️⃣ Comprobación inmediata: comensal local
  try {
    const comensalData = localStorage.getItem("comensal");
    if (comensalData) return "comensal";
  } catch (e) {
    console.warn("⚠️ Error leyendo comensal en localStorage:", e);
  }

  // 2️⃣ Consultar sesión Supabase (para camarero/admin)
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("❌ Error obteniendo sesión Supabase:", error.message);
    return null;
  }

  const session = data?.session;
  if (!session?.user) return null;

  // 3️⃣ Leer rol desde JWT (app_metadata)
  const role = session.user.app_metadata?.role;
  if (role) return role;

  // 4️⃣ Sin rol reconocido
  return null;
}
