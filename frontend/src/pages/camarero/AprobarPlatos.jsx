import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useTranslation } from "react-i18next";
import { getLocalizedText } from "../../services/getLocalizedText";
import QRCode from "react-qr-code";
import { useComensalCard } from "../comensal/useComensalCard";
import "./AprobarPlatos.css";

function AprobarPlatos({ comensal, loadData }) {
  // Recibimos loadData como prop
  const { t } = useTranslation();
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { qrValue, mostrarQR, setMostrarQR } = useComensalCard(comensal);

  const fetchPendientes = async () => {
    setLoading(true);
    try {
      const { data: lineas, error: err1 } = await supabase
        .from("lineas_pedido")
        .select("id, cantidad, estado, plato_id")
        .eq("comensal_id", comensal.id)
        .in("estado", ["pendiente", "confirmado"]);
      if (err1) throw err1;

      const platoIds = [...new Set(lineas.map((l) => l.plato_id))];
      let platosMap = {};

      if (platoIds.length > 0) {
        const { data: platosData, error: err2 } = await supabase
          .from("platos")
          .select("id, code, name_es, name_en, name_cn, precio")
          .in("id", platoIds);
        if (err2) throw err2;
        platosMap = Object.fromEntries(
          platosData.map((p) => [
            p.id,
            {
              code: p.code,
              name_es: p.name_es,
              name_en: p.name_en,
              name_cn: p.name_cn,
              precio: p.precio,
            },
          ])
        );
      }

      const enriched = lineas.map((l) => ({
        ...l,
        ...platosMap[l.plato_id],
      }));
      setPlatos(enriched);
    } catch (err) {
      console.error("💥 Error cargando platos:", err);
      setPlatos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!comensal?.id) return;
    fetchPendientes();
    const channel = supabase
      .channel(`comensal-${comensal.id}-lineas-pedido`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lineas_pedido" },
        (payload) => {
          if (
            payload.new?.comensal_id === comensal.id ||
            payload.old?.comensal_id === comensal.id
          ) {
            fetchPendientes();
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [comensal]);

  const aprobarPlato = async (lineaId) => {
    setPlatos((prev) =>
      prev.map((p) => (p.id === lineaId ? { ...p, estado: "confirmado" } : p))
    );
    const { error } = await supabase
      .from("lineas_pedido")
      .update({ estado: "confirmado" })
      .eq("id", lineaId);
    if (error) console.error("❌ Error al aprobar plato:", error);
  };

  const eliminarPlato = async (lineaId) => {
    const { error } = await supabase
      .from("lineas_pedido")
      .delete()
      .eq("id", lineaId);
    if (error) {
      console.error("❌ Error eliminando plato:", error);
    } else {
      await fetchPendientes(); // Recargar platos localmente
      if (loadData) await loadData(); // Recargar datos del comensal si loadData está disponible
    }
  };

  const aprobarTodos = async () => {
    const { error } = await supabase
      .from("lineas_pedido")
      .update({ estado: "confirmado" })
      .eq("comensal_id", comensal.id)
      .eq("estado", "pendiente");
    if (error) console.error("❌ Error al aprobar todos:", error);
  };

  if (loading) return <p>{t("approve_dishes.loading")}</p>;

  return (
    <div className="platos-container">
      {platos.length > 0 ? (
        <>
          <div className="grupo-botones">
            {qrValue && (
              <button
                className="btn-qr"
                onClick={() => setMostrarQR((prev) => !prev)}
              >
                📲 {mostrarQR ? t("card.hide_qr") : t("card.my_qr")}
              </button>
            )}
            <button className="btn-aprobar-todos" onClick={aprobarTodos}>
              {t("approve_dishes.approve_all")} (
              {platos.filter((p) => p.estado === "pendiente").length})
            </button>
          </div>
          {mostrarQR && qrValue && (
            <div className="qr-individual">
              <QRCode value={qrValue} size={130} />
              <p>{t("card.rejoin_table")}</p>
            </div>
          )}
          <ul className="platos-list">
            {platos.map((p) => (
              <li key={p.id} className="plato-item">
                <div className="plato-info">
                  <span className="plato-codigo">{p.code}</span>
                  <span className="plato-nombre">
                    {getLocalizedText(p, "name")}
                  </span>
                  <span className="plato-precio">{p.precio} €</span>
                </div>
                <div className="plato-actions">
                  {p.estado === "pendiente" ? (
                    <>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarPlato(p.id)}
                      >
                        {t("approve_dishes.remove")}
                      </button>
                      <button
                        className="btn-aprobar"
                        onClick={() => aprobarPlato(p.id)}
                      >
                        {t("approve_dishes.approve")}
                      </button>
                    </>
                  ) : (
                    <span className="badge confirmado">
                      {t(`approve_dishes.state.${p.estado}`)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>{t("approve_dishes.none_pending")}</p>
      )}
    </div>
  );
}

export default AprobarPlatos;
