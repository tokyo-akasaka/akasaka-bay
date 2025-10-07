import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import QRCode from "react-qr-code";

function MesaDetalle() {
  const { numero } = useParams();
  const navigate = useNavigate();

  const [mesa, setMesa] = useState(null);
  const [comensales, setComensales] = useState([]);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [loading, setLoading] = useState(true);

  /** 1️⃣ Cargar mesa desde la vista completa */
  useEffect(() => {
    const fetchMesa = async () => {
      try {
        const { data, error } = await supabase
          .from("mesas_con_comensales")
          .select("*")
          .eq("numero", numero)
          .single();

        if (error) throw error;
        setMesa(data);
      } catch (err) {
        console.error("Error cargando mesa:", err);
        alert("❌ No se pudo cargar la información de la mesa.");
        navigate("/camarero/mesas");
      } finally {
        setLoading(false);
      }
    };

    fetchMesa();
  }, [numero, navigate]);

  /** 2️⃣ Cargar comensales asociados a la mesa + suscripción en tiempo real */
  useEffect(() => {
    if (!mesa?.id) return;

    const fetchComensales = async () => {
      try {
        const { data, error } = await supabase
          .from("comensales")
          .select("id, nombre, activo, pagado, subtotal")
          .eq("mesa_id", mesa.id);

        if (error) throw error;
        setComensales(data);
      } catch (err) {
        console.error("Error cargando comensales:", err);
      }
    };

    fetchComensales();

    // Suscripción en tiempo real a los cambios en comensales
    const channel = supabase
      .channel(`mesa-${mesa.id}-comensales`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comensales" },
        fetchComensales
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mesa?.id]);

  /** 3️⃣ Generar token QR dinámico */
  const qrValue = useMemo(() => {
    if (!mesa) return "";
    const payload = {
      mesa: mesa.numero,
      camarero_id: mesa.camarero_id,
      num_comensales: mesa.num_comensales,
      session_id: mesa.session_id,
      ts: Date.now(),
    };
    const token = btoa(JSON.stringify(payload));
    return `${window.location.origin}/comensal/apertura-comensal?token=${token}`;
  }, [mesa]);

  /** 4️⃣ Renderizado condicional */
  if (loading) return <p style={styles.msg}>⏳ Cargando mesa...</p>;
  if (!mesa) return <p style={styles.msg}>❌ No se encontró la mesa.</p>;

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate(-1)}>
        ⬅ Volver
      </button>

      <h1>🍽️ Mesa {mesa.numero}</h1>
      <p>
        Estado:{" "}
        <strong style={{ color: mesa.estado ? "#28a745" : "#d9534f" }}>
          {mesa.estado ? "abierta" : "cerrada"}
        </strong>
      </p>
      <p>
        Camarero: <strong>{mesa.nombre_camarero ?? "Sin asignar"}</strong>
      </p>
      <p>
        Comensales activos:{" "}
        <strong>
          {mesa.comensales_activos ?? comensales.filter((c) => c.activo).length}
        </strong>{" "}
        / {mesa.num_comensales}
      </p>

      <h2>👥 Lista de comensales</h2>
      {comensales.length > 0 ? (
        <ul style={styles.list}>
          {comensales.map((c) => (
            <li key={c.id} style={styles.listItem}>
              <span>{c.nombre}</span>
              <span style={{ color: c.activo ? "#28a745" : "#6c757d" }}>
                {c.activo ? "🟢 Activo" : "⚪ Inactivo"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay comensales registrados todavía.</p>
      )}

      {/* 🔹 Botón para mostrar QR */}
      <button style={styles.qrButton} onClick={() => setMostrarQR(!mostrarQR)}>
        {mostrarQR ? "Ocultar QR" : "Mostrar QR para comensales"}
      </button>

      {mostrarQR && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <QRCode value={qrValue} size={200} />
          <p style={{ marginTop: "10px" }}>
            📱 Escanea para unirte a la mesa #{mesa.numero}
          </p>
        </div>
      )}
    </div>
  );
}

/** 🎨 Estilos */
const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  msg: {
    textAlign: "center",
    fontSize: "18px",
    padding: "30px",
    color: "#555",
  },
  back: {
    marginBottom: "20px",
    background: "#ddd",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "10px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 12px",
    background: "#f9f9f9",
    borderRadius: "6px",
    marginBottom: "6px",
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
