// /src/services/authRoutes/roles.js
import { supabase } from "./auth";

export async function getCurrentUserRole() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const role = session?.user?.app_metadata?.role;
  if (role) return role;

  if (!session?.user?.id) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  return data?.role ?? null;
}
