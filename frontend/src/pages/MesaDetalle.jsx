import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import QRCode from "react-qr-code";

function MesaDetalle() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const [mesa, setMesa] = useState(null);
  const [comensales, setComensales] = useState([]);
  const [mostrarQR, setMostrarQR] = useState(false);

  useEffect(() => {
    const loadMesa = async () => {
      const { data, error } = await supabase
        .from("mesas_con_comensales")
        .select("*")
        .eq("numero", numero)
        .single();

      if (!error) setMesa(data);
    };

    const loadComensales = async () => {
      if (!mesa?.id) return;
      const { data, error } = await supabase
        .from("comensales")
        .select("*")
        .eq("mesa_id", mesa.id);

      if (!error) setComensales(data);
    };

    loadMesa();
    loadComensales();

    // 🔹 suscripción a cambios en comensales
    const channel = supabase
      .channel("mesa-detalle")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comensales" },
        loadComensales
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [numero, mesa?.id]);

  if (!mesa) return <p>Cargando mesa...</p>;

  // 🔹 generar token Base64 con los datos de la mesa
  const generarToken = () => {
    const payload = {
      mesa: mesa.numero,
      camarero_id: mesa.camarero_id,
      num_comensales: mesa.num_comensales,
      session_id: mesa.session_id,
      ts: Date.now(),
    };
    return btoa(JSON.stringify(payload));
  };

  const baseUrl = window.location.origin;
  const qrValue = `${baseUrl}/apertura-comensal?token=${generarToken()}`;

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate(-1)}>
        ⬅ Volver
      </button>
      <h1>Mesa {mesa.numero}</h1>
      <p>Estado: {mesa.estado ? "abierta" : "cerrada"}</p>
      <p>
        Comensales: {mesa.comensales_activos}/{mesa.num_comensales}
      </p>

      <h2>👥 Lista de comensales</h2>
      <ul>
        {comensales.map((c) => (
          <li key={c.id}>
            {c.nombre} {c.activo ? "✅" : "❌"}
          </li>
        ))}
      </ul>

      {/* Botón para mostrar el QR */}
      <button style={styles.qrButton} onClick={() => setMostrarQR(!mostrarQR)}>
        {mostrarQR ? "Ocultar QR" : "Ver QR de la mesa"}
      </button>

      {mostrarQR && (
        <div style={{ marginTop: "20px" }}>
          <QRCode value={qrValue} size={200} />
          <p style={{ marginTop: "10px" }}>
            Escanea este código para unirte a la mesa
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "Arial" },
  back: {
    marginBottom: "20px",
    background: "#ddd",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  qrButton: {
    marginTop: "20px",
    padding: "10px 15px",
    background: "#0077cc",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default MesaDetalle;
