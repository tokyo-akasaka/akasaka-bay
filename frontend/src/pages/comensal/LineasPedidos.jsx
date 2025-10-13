// 📁 frontend/src/pages/comensal/LineasPedidos.jsx

import { useTranslation } from "react-i18next";
import { useLineasPedidos } from "./useLineasPedidos";
import "./LineasPedidos.css";

function LineasPedidos() {
  const { t } = useTranslation();
  const { comensal, lineas, loading } = useLineasPedidos();

  if (loading) return <p className="msg">{t("order_line.loading")}</p>;
  if (!comensal) return <p className="msg">{t("order_line.no_session")}</p>;

  return (
    <div className="container">
      <h1>
        🧾 {t("order_line.order_of_table")} {comensal.mesa_id}
      </h1>
      <p>
        {t("order_line.welcome")}, <strong>{comensal.nombre}</strong> 👋
      </p>

      {lineas.length === 0 ? (
        <p className="msg">{t("order_line.no_dishes")}</p>
      ) : (
        <div className="list">
          {lineas.map((linea) => (
            <div key={linea.id} className="card">
              {linea.platos?.imagen && (
                <img
                  src={linea.platos.imagen}
                  alt={linea.platos.name_es}
                  className="img"
                />
              )}
              <div className="info">
                <h3>{linea.platos?.name_es}</h3>
                <p>
                  {t("order_line.quantity")}: <strong>{linea.cantidad}</strong>
                </p>
                <p>
                  {t("order_line.price")}:{" "}
                  <strong>
                    {(linea.precio_unitario * linea.cantidad).toFixed(2)}€
                  </strong>
                </p>
                <p>
                  {t("order_line.status")}:{" "}
                  <span
                    className={`badge ${
                      linea.estado === "pendiente"
                        ? "pendiente"
                        : linea.estado === "confirmado"
                        ? "confirmado"
                        : "otro"
                    }`}
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

export default LineasPedidos;
