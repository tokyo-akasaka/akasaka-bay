import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";

export default function useCamareroLoginOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 🎯 Actualizar el mensaje si se cambia el idioma
  useEffect(() => {
    const handleLangChange = () => {
      setMessage((prev) => {
        if (prev.includes("✅")) return t("login_Otp.code_sent");
        if (prev.includes("❌") && prev.includes("OTP"))
          return t("login_Otp.invalid_code");
        if (prev.includes("⚠️")) return t("login_Otp.user_not_found");
        return prev;
      });
    };

    i18n.on("languageChanged", handleLangChange);
    return () => i18n.off("languageChanged", handleLangChange);
  }, [i18n, t]);

  const sendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (error) {
      setMessage(t("login_Otp.error_sending", { error: error.message }));
    } else {
      setMessage(t("login_Otp.code_sent"));
      setStep("verify");
    }
  };

  const verifyOtp = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error || !session) {
      setMessage(t("login_Otp.invalid_code"));
      return;
    }
    const authUser = session.user;
    const { data: camarero, error: camError } = await supabase
      .from("camareros")
      .select("id, nombre, email")
      .eq("email", authUser.email)
      .single();

    if (camError || !camarero) {
      setMessage(t("login_Otp.user_not_found"));
      return;
    }

    try {
      localStorage.setItem("camarero", JSON.stringify(camarero));
      window.dispatchEvent(new Event("camarero-login"));
    } catch (e) {
      console.error("ERROR al guardar en localStorage:", e);
    }

    setMessage(
      t("login_Otp.welcome", { name: camarero.nombre, id: camarero.id })
    );

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
