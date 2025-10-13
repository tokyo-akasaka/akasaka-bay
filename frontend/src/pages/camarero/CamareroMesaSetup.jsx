// frontend/src/pages/camarero/CamareroMesaSetup.jsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useCamareroMesaSetup from "./useCamareroMesaSetup";
import "./CamareroMesaSetup.css";

function CamareroMesaSetup() {
  const { t } = useTranslation();
  const { mesasFisicas, abrirMesa, loading } = useCamareroMesaSetup();
  const camarero = JSON.parse(localStorage.getItem("camarero"));

  const [comensalesPorMesa, setComensalesPorMesa] = useState({});

  const handleChange = (mesaNumero, valor) => {
    setComensalesPorMesa((prev) => ({
      ...prev,
      [mesaNumero]: valor,
    }));
  };

  return (
    <div className="setup-container">
      <h1>{t("w_tables_setup.open_table")}</h1>

      <div className="mesas-grid">
        {mesasFisicas
          .filter((mesa) => !mesa.esta_abierta)
          .map((mesa) => (
            <div key={mesa.numero} className="mesa-card">
              <h2>
                {t("w_tables_setup.table")} #{mesa.numero}
              </h2>
              <p>
                {t("w_tables_setup.status")}: {t("w_tables_setup.closed")}
              </p>

              <input
                type="number"
                placeholder={t("w_tables_setup.num_guests")}
                value={comensalesPorMesa[mesa.numero] || ""}
                onChange={(e) => handleChange(mesa.numero, e.target.value)}
                className="input-comensales"
              />

              <button
                onClick={() =>
                  abrirMesa(
                    mesa.numero,
                    camarero,
                    comensalesPorMesa[mesa.numero]
                  )
                }
                disabled={loading}
              >
                {loading
                  ? t("w_tables_setup.opening")
                  : t("w_tables_setup.open_button")}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CamareroMesaSetup;
