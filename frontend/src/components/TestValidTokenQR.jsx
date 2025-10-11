// frontend/src/components/TestValidTokenQR.jsx
import { useState } from "react";
import { verifyTokenQR } from "../services/verifyTokenQR";

export default function TestValidTokenQR() {
  const [token, setToken] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleVerificarToken() {
    setLoading(true);
    try {
      const data = await verifyTokenQR(token);
      setResultado(data);
      console.log("✅ Token válido:", data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>✅ Test de Verificación de Token</h2>
      <textarea
        rows={4}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Pega aquí el token generado"
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <button onClick={handleVerificarToken} disabled={loading || !token}>
        {loading ? "Verificando..." : "Verificar Token"}
      </button>

      {resultado && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Resultado:</strong>
          <pre style={{ background: "#eee", padding: "1rem" }}>
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
