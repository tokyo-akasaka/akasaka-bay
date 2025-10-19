// /src/services/authRoutes/roles.js
import { supabase } from "../../lib/supabaseClient";

export async function getCurrentUserRole() {
  // 1️⃣ Obtener la sesión actual
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 2️⃣ Intentar leer el rol del token JWT (app_metadata)
  const role = session?.user?.app_metadata?.role;
  if (role) return role;

  // 3️⃣ Si no hay sesión válida
  if (!session?.user?.id) return null;

  // 4️⃣ Buscar el rol en la tabla "profiles" (según tu esquema real)
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error obteniendo rol desde profiles:", error.message);
    return null;
  }

  return data?.role ?? null;
}
