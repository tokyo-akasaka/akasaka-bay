import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AdminMesas() {
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    const loadMesas = async () => {
      const { data, error } = await supabase
        .from("mesas_con_comensales")
        .select("*")
        .order("numero", { ascending: true });

      if (error) {
        console.error("Error cargando mesas:", error);
      } else {
        setMesas(data);
      }
    };

    loadMesas();

    const channel = supabase
      .channel("admin-mesas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas" },
        () => loadMesas()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1>📋 Todas las Mesas</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Camarero</th>
            <th>Estado</th>
            <th>Comensales activos</th>
            <th>Total comensales</th>
          </tr>
        </thead>
        <tbody>
          {mesas.map((mesa) => (
            <tr key={mesa.id}>
              <td>{mesa.numero}</td>
              <td>{mesa.camarero_id}</td>
              <td>{mesa.estado ? "abierta" : "cerrada"}</td>
              <td>{mesa.comensales_activos}</td>
              <td>{mesa.num_comensales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "Arial" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: { borderBottom: "1px solid #ddd", padding: "8px" },
  td: { borderBottom: "1px solid #eee", padding: "8px" },
};

export default AdminMesas;
