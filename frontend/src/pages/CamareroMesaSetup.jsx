import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid"; // ✅ importamos uuid

function CamareroMesaSetup() {
  const [camarero, setCamarero] = useState(null);
  const [numeroMesa, setNumeroMesa] = useState("");
  const [numComensales, setNumComensales] = useState("");
  const [token, setToken] = useState(null);

  // Cargar camarero logueado desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("camarero");
    if (stored) {
      try {
        setCamarero(JSON.parse(stored)); // { nombre, camareroId }
      } catch (e) {
        console.error("Error leyendo camarero:", e);
      }
    }
  }, []);

  const generarQR = () => {
    if (!camarero) {
      alert("⚠️ Debes iniciar sesión como camarero antes de continuar");
      return;
    }
    if (!numeroMesa || !numComensales) {
      alert("⚠️ Completa número de mesa y comensales");
      return;
    }

    const payload = {
      mesa: parseInt(numeroMesa, 10),
      camarero_id: camarero.id,
      num_comensales: parseInt(numComensales, 10),
      session_id: uuidv4(), // ✅ UUID seguro con la librería
      ts: Date.now(),
    };

    const tokenStr = btoa(JSON.stringify(payload));
    setToken(tokenStr);
  };

  const baseUrl = window.location.origin;
  const qrValue = token
    ? `${baseUrl}/comensal/apertura-comensal?token=${token}`
    : null;

  if (!camarero) {
    return (
      <div style={styles.container}>
        <h1>👨‍🍳 Asignación de mesa</h1>
        <p style={{ color: "red" }}>
          ⚠️ Debes hacer login como camarero antes de asignar una mesa
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>👨‍🍳 Asignación de mesa</h1>
      <p>
        Camarero activo: <strong>{camarero.nombre}</strong> (ID {camarero.id})
      </p>

      <div style={styles.field}>
        <label>Número de mesa:</label>
        <input
          type="number"
          value={numeroMesa}
          onChange={(e) => setNumeroMesa(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label>Número de comensales previstos:</label>
        <input
          type="number"
          value={numComensales}
          onChange={(e) => setNumComensales(e.target.value)}
        />
      </div>

      {!token ? (
        <button style={styles.button} onClick={generarQR}>
          Generar QR
        </button>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <QRCode value={qrValue} size={200} />
          <p>📱 QR listo para escanear por los comensales</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "Arial" },
  field: { marginBottom: "15px" },
  button: {
    marginTop: "20px",
    padding: "10px 15px",
    background: "#0077cc",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CamareroMesaSetup;
