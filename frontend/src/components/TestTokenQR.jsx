// frontend/src/components/TestTokenQR.jsx
import { useState } from "react";
import { getTokenQR } from "../services/getTokenQR";

export default function TestTokenQR() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerarToken() {
    setLoading(true);
    setToken(""); // limpiar token previo
    try {
      const result = await getTokenQR({
        mesa_id: 34, // verificar que este ID coincida con el que usas
        comensal_id: 31,
      });
      setToken(result);
      console.log("🎟️ Token generado:", result);
    } catch (err) {
      console.error("Error en handleGenerarToken:", err);
      alert("Error generando token: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🔐 Test de generación de Token QR</h2>
      <button onClick={handleGenerarToken} disabled={loading}>
        {loading ? "Generando..." : "Generar Token"}
      </button>

      {token && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Token:</strong>
          <pre
            style={{
              background: "#eee",
              padding: "1rem",
              wordWrap: "break-word",
            }}
          >
            {token}
          </pre>
        </div>
      )}
    </div>
  );
}
