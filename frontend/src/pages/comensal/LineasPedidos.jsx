// frontend/src/pages/comensal/LineasPedidos.jsx

import { useTranslation } from "react-i18next";
import { useLineasPedidos } from "./useLineasPedidos";
import { getLocalizedText } from "../../services/getLocalizedText";
import "./LineasPedidos.css";

function LineasPedidos() {
  const { t } = useTranslation();
  const { comensal, lineas, loading } = useLineasPedidos();

  if (loading) return <p className="msg">{t("order_line.loading")}</p>;
  if (!comensal) return <p className="msg">{t("order_line.no_session")}</p>;

  const mesaNumero = comensal.mesa?.numero ?? comensal.mesa_id;

  return (
    <div className="container">
      <h1>
        🧾 {t("order_line.order_of_table")} {mesaNumero}
      </h1>
      <p>
        {t("order_line.welcome")}, <strong>{comensal.nombre}</strong> 👋
      </p>

      {lineas.length === 0 ? (
        <p className="msg">{t("order_line.no_dishes")}</p>
      ) : (
        <div className="list">
          {lineas.map((linea) => {
            const nombre = linea.platos
              ? getLocalizedText(linea.platos, "name")
              : "🥣 Plato desconocido";
            const precioTotal = (
              linea.precio_unitario * linea.cantidad
            ).toFixed(2);

            return (
              <div key={linea.id} className="linea-card">
                <div className="linea-top">
                  <h3 className="linea-nombre">
                    <strong>{linea.platos?.code || "—"}</strong>: {nombre}
                  </h3>
                  <span className="linea-precio">{precioTotal} €</span>
                </div>
                <div className="linea-bot">
                  <span className={`badge ${linea.estado} linea-estado`}>
                    {t(`order_line.states.${linea.estado}`)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LineasPedidos;
