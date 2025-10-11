// frontend/src/pages/camarero/CamareroMesaSetup.jsx

import React, { useState } from "react";
import useCamareroMesaSetup from "./useCamareroMesaSetup";
import "./CamareroMesaSetup.css";

function CamareroMesaSetup() {
  const { mesasFisicas, abrirMesa, loading } = useCamareroMesaSetup();
  const camarero = JSON.parse(localStorage.getItem("camarero"));

  // Estado local por mesa para los comensales
  const [comensalesPorMesa, setComensalesPorMesa] = useState({});

  const handleChange = (mesaNumero, valor) => {
    setComensalesPorMesa((prev) => ({
      ...prev,
      [mesaNumero]: valor,
    }));
  };

  return (
    <div className="setup-container">
      <h1>Abrir Mesa</h1>

      <div className="mesas-grid">
        {mesasFisicas
          .filter((mesa) => !mesa.esta_abierta) // mostrar solo cerradas
          .map((mesa) => (
            <div key={mesa.numero} className="mesa-card">
              <h2>Mesa #{mesa.numero}</h2>
              <p>Estado: Cerrada</p>

              <input
                type="number"
                placeholder="Nº comensales"
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
                {loading ? "Abriendo..." : "Abrir Mesa"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CamareroMesaSetup;
