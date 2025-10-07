import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function MenuComida() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [comensal, setComensal] = useState(null);
  const [platos, setPlatos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mesa = searchParams.get("mesa");
    const sessionId = searchParams.get("session_id");
    const comensalToken = searchParams.get("comensal_token");

    if (!mesa || !sessionId || !comensalToken) {
      alert("❌ Faltan datos en la URL. Escanea el QR de la mesa nuevamente.");
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        // 1️⃣ Buscar comensal
        const { data: comensalData, error: comensalError } = await supabase
          .from("comensales")
          .select("id, nombre, mesa_id, subtotal, activo, pagado")
          .eq("token", comensalToken)
          .single();

        if (comensalError || !comensalData) {
          console.error("Error recuperando comensal:", comensalError);
          alert("No se pudo encontrar tu sesión. Vuelve a escanear el QR.");
          navigate("/");
          return;
        }

        setComensal(comensalData);

        // 2️⃣ Cargar categorías
        const { data: categoriasData, error: catError } = await supabase
          .from("categorias_menu")
          .select("id, title_es, title_en, title_cn")
          .order("id", { ascending: true });

        if (catError) throw catError;
        setCategorias(categoriasData);

        // 3️⃣ Cargar platos activos
        const { data: platosData, error: platosError } = await supabase
          .from("platos")
          .select(
            "id, categoria_id, code, name_es, name_en, name_cn, descripcion_es, precio, price_descript, imagen, activo"
          )
          .eq("activo", true)
          .order("id", { ascending: true });

        if (platosError) throw platosError;
        setPlatos(platosData);
      } catch (err) {
        console.error("Error general en MenuComida:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams, navigate]);

  // 🔹 Añadir plato al pedido
  async function handleAddToOrder(plato) {
    try {
      const { data, error } = await supabase
        .from("lineas_pedido")
        .insert([
          {
            comensal_id: comensal.id,
            plato_id: plato.id,
            cantidad: 1,
            precio_unitario: plato.precio,
          },
        ])
        .select("id, subtotal")
        .single();

      if (error) throw error;

      alert(`🛒 ${plato.name_es} añadido a tu pedido.`);
      console.log("✅ Pedido registrado:", data);
    } catch (err) {
      console.error("Error añadiendo pedido:", err);
      alert("❌ No se pudo añadir el plato. Inténtalo de nuevo.");
    }
  }

  // 🔸 Render
  if (loading) return <p style={styles.msg}>⏳ Cargando menú...</p>;
  if (!comensal)
    return <p style={styles.msg}>❌ No se encontró tu información.</p>;

  // 🔹 Agrupar platos por categoría
  const platosPorCategoria = categorias.map((cat) => ({
    ...cat,
    items: platos.filter((p) => p.categoria_id === cat.id),
  }));

  return (
    <div style={styles.container}>
      <h1>🍽️ Menú de la Mesa {comensal.mesa_id}</h1>
      <p>
        Bienvenido, <strong>{comensal.nombre}</strong> 👋
      </p>

      {platosPorCategoria.map((cat) => (
        <div key={cat.id} style={styles.section}>
          <h2 style={styles.sectionTitle}>{cat.title_es}</h2>

          <div style={styles.menuGrid}>
            {cat.items.length === 0 ? (
              <p style={styles.empty}>
                No hay platos disponibles en esta categoría.
              </p>
            ) : (
              cat.items.map((plato) => (
                <div key={plato.id} style={styles.card}>
                  {plato.imagen && (
                    <img
                      src={plato.imagen}
                      alt={plato.name_es}
                      style={styles.img}
                    />
                  )}
                  <h3>{plato.name_es}</h3>
                  {plato.descripcion_es && (
                    <p style={styles.desc}>{plato.descripcion_es}</p>
                  )}
                  <p style={styles.price}>
                    {plato.precio.toFixed(2)} €{" "}
                    {plato.price_descript ? `(${plato.price_descript})` : ""}
                  </p>
                  <button
                    style={styles.btnAdd}
                    onClick={() => handleAddToOrder(plato)}
                  >
                    Añadir al pedido
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
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
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    borderBottom: "2px solid #ddd",
    paddingBottom: "5px",
    marginBottom: "15px",
  },
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    padding: "15px",
    textAlign: "center",
  },
  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  desc: {
    color: "#555",
    fontSize: "14px",
    marginBottom: "8px",
  },
  price: {
    fontWeight: "bold",
    color: "#28a745",
  },
  btnAdd: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  empty: {
    color: "#999",
  },
};

export default MenuComida;
