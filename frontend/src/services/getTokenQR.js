// frontend/src/services/getTokenQR.js
const URL =
  import.meta.env.VITE_SUPABASE_FUNCTION_URL ||
  "https://hzbhlfwgwdjsowgwejcq.supabase.co/functions/v1/tokenQR";
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function getTokenQR({ mesa_id, comensal_id }) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ mesa_id, comensal_id }),
  });

  if (!res.ok) {
    throw new Error("❌ No se pudo obtener el token");
  }

  const data = await res.json();
  return data.token;
}
