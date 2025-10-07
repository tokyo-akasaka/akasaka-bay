import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function LineasPedidos() {
  const { numero: mesa } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [comensal, setComensal] = useState(null);
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const comensalToken = searchParams.get("comensal_token");
    if (!mesa || !sessionId || !comensalToken) {
      alert("❌ Faltan datos en la URL. Escanea el QR de nuevo.");
      navigate("/");
      return;
    }

    const loadPedidos = async () => {
      try {
        // 1️⃣ Buscar comensal
        const { data: comensalData, error: comensalError } = await supabase
          .from("comensales")
          .select("id, nombre, mesa_id, subtotal, activo, pagado")
          .eq("token", comensalToken)
          .single();

        if (comensalError || !comensalData) {
          alert("No se pudo cargar la información del comensal.");
          navigate("/");
          return;
        }

        setComensal(comensalData);

        // 2️⃣ Cargar sus líneas de pedido
        const { data: lineasData, error: lineasError } = await supabase
          .from("lineas_pedido")
          .select(
            `
            id,
            cantidad,
            precio_unitario,
            subtotal,
            estado,
            creado_en,
            platos ( name_es, imagen )
          `
          )
          .eq("comensal_id", comensalData.id)
          .order("creado_en", { ascending: true });

        if (lineasError) throw lineasError;

        setLineas(lineasData || []);
      } catch (err) {
        console.error("Error cargando pedido:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();

    // 3️⃣ Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel("lineas_pedido_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lineas_pedido" },
        (payload) => {
          console.log("🔄 Cambio detectado en pedidos:", payload);
          loadPedidos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchParams, navigate]);

  if (loading) return <p style={styles.msg}>⏳ Cargando tus pedidos...</p>;
  if (!comensal) return <p style={styles.msg}>❌ No se encontró tu sesión.</p>;

  return (
    <div style={styles.container}>
      <h1>🧾 Pedido de la Mesa {comensal.mesa_id}</h1>
      <p>
        Bienvenido, <strong>{comensal.nombre}</strong> 👋
      </p>

      {lineas.length === 0 ? (
        <p style={styles.msg}>Aún no has añadido ningún plato.</p>
      ) : (
        <div style={styles.list}>
          {lineas.map((linea) => (
            <div key={linea.id} style={styles.card}>
              {linea.platos?.imagen && (
                <img
                  src={linea.platos.imagen}
                  alt={linea.platos.name_es}
                  style={styles.img}
                />
              )}
              <div style={styles.info}>
                <h3>{linea.platos?.name_es}</h3>
                <p>
                  Cantidad: <strong>{linea.cantidad}</strong>
                </p>
                <p>
                  Precio:{" "}
                  <strong>
                    {(linea.precio_unitario * linea.cantidad).toFixed(2)}€
                  </strong>
                </p>
                <p>
                  Estado:{" "}
                  <span
                    style={{
                      ...styles.badge,
                      background:
                        linea.estado === "pendiente"
                          ? "#ffc107"
                          : linea.estado === "confirmado"
                          ? "#28a745"
                          : "#6c757d",
                    }}
                  >
                    {linea.estado}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 🎨 Estilos
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  msg: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    display: "flex",
    gap: "15px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    padding: "10px",
  },
  img: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  info: {
    flex: 1,
  },
  badge: {
    padding: "3px 8px",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
  },
};

export default LineasPedidos;
