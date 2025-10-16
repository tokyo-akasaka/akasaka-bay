// frontend/src/pages/camarero/CamareroMesas.jsx

import useCamareroMesas from "./useCamareroMesas";
import { useTranslation } from "react-i18next";
import "./CamareroMesas.css";

function CamareroMesas() {
  const { t } = useTranslation();
  const { mesas, verMesa } = useCamareroMesas();

  return (
    <div className="container">
      <h1>👨‍🍳 {t("waiter_tables.my_tables")}</h1>
      <div className="camarero-grid">
        {mesas.map((mesa) => {
          const hayPendientes = mesa.platos_pendientes > 0;
          return (
            <div
              key={mesa.numero}
              className={`mesa-card ${hayPendientes ? "highlight" : ""}`}
              onClick={() => verMesa(mesa.numero)}
            >
              <div className="mesa-row">
                <div className="col estado-dot">
                  {mesa.estado ? "🟢" : "⚪"}
                </div>
                <div className="col mesa-numero">
                  {t("waiter_tables.table")} {mesa.numero}
                </div>
                <div className="col comensales">
                  {mesa.comensales_activos}/{mesa.num_comensales}
                </div>
                <div className="col pendientes-count">
                  {mesa.platos_pendientes > 0
                    ? `🍽️ ${mesa.platos_pendientes}`
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CamareroMesas;
