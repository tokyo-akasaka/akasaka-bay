import { supabase } from "../../lib/supabaseClient";

export async function getCurrentUserRole() {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user) return null;

    // En tu estado actual, si hay sesión Supabase → es camarero.
    return "camarero";
  } catch {
    return null;
  }
}
