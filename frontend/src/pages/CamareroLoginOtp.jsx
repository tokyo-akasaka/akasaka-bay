import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function CamareroLoginOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request"); // "request" o "verify"
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Paso 1: pedir OTP al correo
  const sendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // evita crear usuario si no existe
      },
    });

    if (error) {
      setMessage("❌ Error enviando OTP: " + error.message);
    } else {
      setMessage("✅ Revisa tu correo, te hemos enviado un código.");
      setStep("verify");
    }
  };

  // Paso 2: verificar OTP introducido
  const verifyOtp = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email", // OTP por email
    });

    if (error) {
      setMessage("❌ OTP incorrecto o caducado.");
      return;
    }

    const authUser = session.user;

    // Buscar camarero en tu tabla
    const { data: camarero, error: camError } = await supabase
      .from("camareros")
      .select("id, nombre, email")
      .eq("email", authUser.email)
      .single();

    if (camError || !camarero) {
      setMessage("⚠️ No existe un camarero con ese email en la base de datos");
      return;
    }

    // Guardamos el camarero real en localStorage
    localStorage.setItem("camarero", JSON.stringify(camarero));

    setMessage(`🎉 Bienvenido ${camarero.nombre} (ID ${camarero.id})`);
    navigate("/camarero/mesas");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🔑 Login Camarero</h1>

      {step === "request" && (
        <>
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Enviar código</button>
        </>
      )}

      {step === "verify" && (
        <>
          <input
            type="text"
            placeholder="Introduce el código recibido"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verificar</button>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default CamareroLoginOtp;
