import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const HMAC_SECRET = Deno.env.get("HMAC_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type"
};

async function verifyHMAC(token: string, secret: string): Promise<{ valid: boolean; payload?: any }> {
  // token = payload + "." + signature
  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false };
  }
  const [payloadBase64, sigHex] = parts;
  // Recalcular firma
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(secret);

  // Reconstruir payload
  // payloadBase64 es una string base64
  const payloadJson = decodeURIComponent(escape(atob(payloadBase64)));
  let payloadObj;
  try {
    payloadObj = JSON.parse(payloadJson);
  } catch {
    return { valid: false };
  }

  // Generar firma esperada
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign(
    { name: "HMAC", hash: "SHA-256" },
    cryptoKey,
    encoder.encode(payloadBase64)
  );
  const sigBytes = new Uint8Array(sigBuffer);
  const sigHexExpected = Array.from(sigBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (sigHexExpected !== sigHex) {
    return { valid: false };
  }
  return { valid: true, payload: payloadObj };
}

serve(async (req) => {
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

    const { token } = await req.json();
    if (!token) {
      return new Response("Falta token", {
        status: 400,
        headers: corsHeaders
      });
    }

    const { valid, payload } = await verifyHMAC(token, HMAC_SECRET);
    if (!valid || !payload) {
      return new Response("Token inválido", {
        status: 401,
        headers: corsHeaders
      });
    }

    // Opcional: aquí podrías verificar que payload.mesa_id y payload.comensal_id sigan vigentes, sesión activa, etc.

    return new Response(JSON.stringify({ payload }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Error en verifyToken:", err);
    return new Response("Error interno", {
      status: 500,
      headers: corsHeaders
    });
  }
});
