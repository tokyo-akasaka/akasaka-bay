import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function CamareroMesas() {
  const navigate = useNavigate();
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("camarero");
    if (!stored) {
      navigate("/camarero");
      return;
    }

    let camareroId;
    try {
      const parsed = JSON.parse(stored);
      camareroId = parsed.camareroId;
    } catch (err) {
      console.error("Error leyendo camarero:", err);
      navigate("/camarero");
      return;
    }

    if (!camareroId) {
      navigate("/camarero");
      return;
    }

    const loadMesas = async () => {
      const { data, error } = await supabase
        .from("mesas_con_comensales")
        .select("id, numero, estado, num_comensales, comensales_activos")
        .eq("camarero_id", camareroId)
        .order("numero", { ascending: true });

      if (error) {
        console.error("Error cargando mesas:", error);
      } else {
        setMesas(data);
      }
    };

    loadMesas();

    const channel = supabase
      .channel("camarero-mesas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas" },
        () => loadMesas()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const verMesa = (numero) => {
    navigate(`/camarero/mesas/${numero}`);
  };

  return (
    <div style={styles.container}>
      <h1>👨‍🍳 Mis Mesas</h1>
      <div style={styles.grid}>
        {mesas.map((mesa) => (
          <div
            key={mesa.id}
            style={styles.card}
            onClick={() => verMesa(mesa.numero)}
          >
            <h2>Mesa {mesa.numero}</h2>
            <p>Estado: {mesa.estado ? "abierta" : "cerrada"}</p>
            <p>
              Comensales: {mesa.comensales_activos}/{mesa.num_comensales}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "Arial" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    background: "white",
    cursor: "pointer",
    transition: "0.2s",
  },
};

export default CamareroMesas;
