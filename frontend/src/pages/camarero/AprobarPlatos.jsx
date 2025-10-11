// frontend/src/pages/camarero/AprobarPlatos.jsx

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./AprobarPlatos.css";

/**
 * ✅ Muestra los platos pendientes del comensal y permite aprobar o eliminar
 */
function AprobarPlatos({ comensalId }) {
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);

  /** 🔹 Cargar platos pendientes del comensal */
  useEffect(() => {
    if (!comensalId) return;

    const fetchPendientes = async () => {
      setLoading(true);

      // 1️⃣ Traer las líneas pendientes o confirmadas
      const { data: lineas, error: err1 } = await supabase
        .from("lineas_pedido")
        .select("id, cantidad, estado, plato_id")
        .eq("comensal_id", comensalId)
        .in("estado", ["pendiente", "confirmado"]); // ahora traemos ambas

      if (err1) {
        console.error("❌ Error cargando lineas_pedido:", err1);
        setPlatos([]);
        setLoading(false);
        return;
      }

      // 2️⃣ Obtener los platos asociados
      const platoIds = [...new Set(lineas.map((l) => l.plato_id))];
      let platosMap = {};

      if (platoIds.length > 0) {
        const { data: platosData, error: err2 } = await supabase
          .from("platos")
          .select("id, code, name_es, name_en, name_cn")
          .in("id", platoIds);

        if (err2) {
          console.error("❌ Error cargando platos:", err2);
        } else {
          platosMap = Object.fromEntries(
            platosData.map((p) => [
              p.id,
              {
                code: p.code,
                name_es: p.name_es,
                name_en: p.name_en,
                name_cn: p.name_cn,
              },
            ])
          );
        }
      }

      // 3️⃣ Combinar resultados
      const enriched = lineas.map((l) => ({
        ...l,
        ...platosMap[l.plato_id],
      }));

      setPlatos(enriched);
      setLoading(false);
    };

    fetchPendientes();

    // 🔄 Escucha cambios en tiempo real
    const channel = supabase
      .channel(`comensal-${comensalId}-lineas-pedido`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lineas_pedido" },
        (payload) => {
          if (payload.new?.comensal_id === comensalId) fetchPendientes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [comensalId]);

  /** 🔹 Aprobar un plato individual */
  const aprobarPlato = async (lineaId) => {
    // Actualización optimista: marcar localmente
    setPlatos((prev) =>
      prev.map((p) => (p.id === lineaId ? { ...p, estado: "confirmado" } : p))
    );

    const { error } = await supabase
      .from("lineas_pedido")
      .update({ estado: "confirmado" })
      .eq("id", lineaId);

    if (error) console.error("❌ Error al aprobar plato:", error);
  };

  /** 🔹 Eliminar un plato individual */
  const eliminarPlato = async (lineaId) => {
    const { error } = await supabase
      .from("lineas_pedido")
      .delete()
      .eq("id", lineaId);

    if (error) {
      console.error("❌ Error eliminando plato:", error);
    } else {
      setPlatos((prev) => prev.filter((p) => p.id !== lineaId));
    }
  };

  /** 🔹 Aprobar todos los platos */
  const aprobarTodos = async () => {
    const { error } = await supabase
      .from("lineas_pedido")
      .update({ estado: "confirmado" })
      .eq("comensal_id", comensalId)
      .eq("estado", "pendiente");

    if (error) console.error("❌ Error al aprobar todos:", error);
  };

  if (loading) return <p>⏳ Cargando platos...</p>;

  return (
    <div className="platos-container">
      <h4>🍽️ Pendientes</h4>

      {platos.length > 0 ? (
        <>
          <button className="btn-aprobar-todos" onClick={aprobarTodos}>
            Aprobar todos (
            {platos.filter((p) => p.estado === "pendiente").length})
          </button>

          <ul className="platos-list">
            {platos.map((p) => (
              <li key={p.id} className="plato-item">
                <span className="plato-nombre">
                  {p.code ?? "??"} | {p.name_es ?? ""} | {p.name_en ?? ""} |{" "}
                  {p.name_cn ?? ""}
                </span>

                <div className="plato-actions">
                  {p.estado === "pendiente" ? (
                    <>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarPlato(p.id)}
                      >
                        ❌ Eliminar
                      </button>
                      <button
                        className="btn-aprobar"
                        onClick={() => aprobarPlato(p.id)}
                      >
                        ✅ Aprobar
                      </button>
                    </>
                  ) : (
                    <button className="btn-aprobado" disabled>
                      🩶 Aprobado
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>✅ No hay platos pendientes.</p>
      )}
    </div>
  );
}

export default AprobarPlatos;
