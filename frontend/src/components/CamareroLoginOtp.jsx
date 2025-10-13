// frontend/src/components/CamareroLoginOtp.jsx

import "./CamareroLoginOtp.css";
import useCamareroLoginOtp from "./useCamareroLoginOtp";
import { useTranslation } from "react-i18next";

function CamareroLoginOtp() {
  const { t } = useTranslation();
  const { email, otp, step, message, setEmail, setOtp, sendOtp, verifyOtp } =
    useCamareroLoginOtp();

  return (
    <div className="login-container">
      <h1>🔑 {t("login_Otp.title")}</h1>

      {step === "request" && (
        <>
          <input
            type="email"
            placeholder={t("login_Otp.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <button onClick={sendOtp} className="login-button">
            {t("login_Otp.send_code")}
          </button>
        </>
      )}

      {step === "verify" && (
        <>
          <input
            type="text"
            placeholder={t("login_Otp.code_placeholder")}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="login-input"
          />
          <button onClick={verifyOtp} className="login-button">
            {t("login_Otp.verify")}
          </button>
        </>
      )}

      {message && <p className="login-message">{message}</p>}
    </div>
  );
}

export default CamareroLoginOtp;
