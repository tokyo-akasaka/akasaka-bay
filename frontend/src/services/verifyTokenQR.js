// src/services/verifyTokenQR.js
export async function verifyTokenQR(token) {
  const res = await fetch(
    "https://hzbhlfwgwdjsowgwejcq.supabase.co/functions/v1/verifyToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ❌ Elimina esta línea ↓↓↓
        // Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ token }),
    }
  );

  if (!res.ok) {
    throw new Error("❌ No se pudo verificar el token");
  }

  const data = await res.json();
  return data;
}
