// frontend/src/components/CamareroLoginOtp.jsx
import React, { useEffect, useRef } from "react";
import "./CamareroLoginOtp.css";
import useCamareroLoginOtp from "./useCamareroLoginOtp";
import { useTranslation } from "react-i18next";

function CamareroLoginOtp() {
  const { t } = useTranslation();
  const { email, otp, step, message, setEmail, setOtp, sendOtp, verifyOtp } =
    useCamareroLoginOtp();

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  // Manejador del submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === "request") sendOtp();
    if (step === "verify") verifyOtp();
  };

  return (
    <div className="login-container">
      <h1>🔑 {t("login_Otp.title")}</h1>

      <form onSubmit={handleSubmit}>
        {step === "request" && (
          <>
            <input
              ref={inputRef}
              type="email"
              placeholder={t("login_Otp.email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="login-button">
              {t("login_Otp.send_code")}
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <input
              ref={inputRef}
              type="text"
              placeholder={t("login_Otp.code_placeholder")}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="login-input verifity-code"
            />
            <button type="submit" className="login-button">
              {t("login_Otp.verify")}
            </button>
          </>
        )}
      </form>

      {message && <p className="login-message">{message}</p>}
    </div>
  );
}

export default CamareroLoginOtp;
