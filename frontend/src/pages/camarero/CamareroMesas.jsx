// frontend/src/pages/camarero/CamareroMesas.jsx

import useCamareroMesas from "./useCamareroMesas";
import { useTranslation } from "react-i18next";
import "./CamareroMesas.css";

function CamareroMesas() {
  const { t } = useTranslation();
  const { mesas, verMesa } = useCamareroMesas();

  return (
    <div className="camarero-container">
      <h1>👨‍🍳 {t("waiter_tables.my_tables")}</h1>
      <div className="camarero-grid">
        {mesas.map((mesa) => (
          <div
            key={mesa.numero}
            className="mesa-card"
            onClick={() => verMesa(mesa.numero)}
          >
            {mesa.platos_pendientes > 0 && (
              <p className="alerta">
                🍽️ {t("waiter_tables.pending_dishes")}: {mesa.platos_pendientes}
              </p>
            )}
            <h2>
              {t("waiter_tables.table")} {mesa.numero}
            </h2>
            <p>
              {t("waiter_tables.status")}:{" "}
              {mesa.estado
                ? t("waiter_tables.open")
                : t("waiter_tables.closed")}
            </p>

            <p>
              {t("waiter_tables.guests")}: {mesa.comensales_activos}/
              {mesa.num_comensales}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CamareroMesas;
