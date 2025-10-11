import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function useCamareroLoginOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request"); // "request" o "verify"
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Paso 1️⃣: Enviar OTP al correo
  const sendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (error) {
      setMessage("❌ Error enviando OTP: " + error.message);
    } else {
      setMessage("✅ Revisa tu correo, te hemos enviado un código.");
      setStep("verify");
    }
  };

  // Paso 2️⃣: Verificar OTP introducido
  const verifyOtp = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    console.log("DEBUG verifyOtp: session =", session, "error =", error);

    if (error || !session) {
      setMessage("❌ OTP incorrecto o caducado.");
      return;
    }

    const authUser = session.user;
    console.log("DEBUG authUser:", authUser);

    const { data: camarero, error: camError } = await supabase
      .from("camareros")
      .select("id, nombre, email")
      .eq("email", authUser.email)
      .single();

    console.log("DEBUG camarero:", camarero, "camError:", camError);

    if (camError || !camarero) {
      setMessage("⚠️ No existe un camarero con ese email en la base de datos");
      return;
    }

    try {
      localStorage.setItem("camarero", JSON.stringify(camarero));
      window.dispatchEvent(new Event("camarero-login")); // 🔔 Notificar al Header
      console.log(
        "DEBUG localStorage after set:",
        localStorage.getItem("camarero")
      );
    } catch (e) {
      console.error("ERROR al guardar en localStorage:", e);
    }

    setMessage(`🎉 Bienvenido ${camarero.nombre} (ID ${camarero.id})`);

    setTimeout(() => {
      navigate("/camarero/mesas");
    }, 50);
  };

  return {
    email,
    otp,
    step,
    message,
    setEmail,
    setOtp,
    sendOtp,
    verifyOtp,
  };
}
