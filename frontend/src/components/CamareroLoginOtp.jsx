// frontend/src/components/CamareroLoginOtp.jsx

import "./CamareroLoginOtp.css";
import useCamareroLoginOtp from "./useCamareroLoginOtp";

function CamareroLoginOtp() {
  const { email, otp, step, message, setEmail, setOtp, sendOtp, verifyOtp } =
    useCamareroLoginOtp();

  return (
    <div className="login-container">
      <h1>🔑 Login Camarero</h1>

      {step === "request" && (
        <>
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <button onClick={sendOtp} className="login-button">
            Enviar código
          </button>
        </>
      )}

      {step === "verify" && (
        <>
          <input
            type="text"
            placeholder="Introduce el código recibido"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="login-input"
          />
          <button onClick={verifyOtp} className="login-button">
            Verificar
          </button>
        </>
      )}

      {message && <p className="login-message">{message}</p>}
    </div>
  );
}

export default CamareroLoginOtp;
