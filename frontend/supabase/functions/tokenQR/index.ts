import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const HMAC_SECRET = Deno.env.get("HMAC_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

async function signHMAC(data: object, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const algo = { name: "HMAC", hash: "SHA-256" };
  const cryptoKey = await crypto.subtle.importKey("raw", keyData, algo, false, ["sign"]);
  const signatureBuffer = await crypto.subtle.sign(algo, cryptoKey, encoder.encode(payload));
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${payload}.${signature}`;
}

serve(async (req) => {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Solo POST permitido", {
        status: 405,
        headers: corsHeaders
      });
    }

    // Verifica JWT si la función lo requiere (opcional, dependiendo de configuración)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Missing authorization header", {
        status: 401,
        headers: corsHeaders
      });
    }

    // Aquí podrías verificar el JWT si quieres
    // Por ahora asumimos que está bien

    const { comensal_id, mesa_id } = await req.json();

    if (!comensal_id || !mesa_id) {
      return new Response("Faltan datos", {
        status: 400,
        headers: corsHeaders
      });
    }

    const { data, error } = await supabase
      .from("comensales")
      .select("session_id")
      .eq("id", comensal_id)
      .eq("mesa_id", mesa_id)
      .single();

    if (error || !data?.session_id) {
      return new Response("Comensal no encontrado", {
        status: 404,
        headers: corsHeaders
      });
    }

    const payload = { mesa_id, comensal_id, session_id: data.session_id };
    const token = await signHMAC(payload, HMAC_SECRET);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });

  } catch (err) {
    console.error("Error interno:", err);
    return new Response("Error interno", {
      status: 500,
      headers: corsHeaders
    });
  }
});
