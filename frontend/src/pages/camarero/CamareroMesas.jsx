// frontend/src/pages/camarero/CamareroMesas.jsx

import useCamareroMesas from "./useCamareroMesas";
import "./CamareroMesas.css";

function CamareroMesas() {
  const { mesas, verMesa } = useCamareroMesas();

  return (
    <div className="camarero-container">
      <h1>👨‍🍳 Mis Mesas</h1>
      <div className="camarero-grid">
        {mesas.map((mesa) => (
          <div
            key={mesa.numero}
            className="mesa-card"
            onClick={() => verMesa(mesa.numero)}
          >
            {mesa.platos_pendientes > 0 && (
              <p className="alerta">
                🍽️ Platos pendientes: {mesa.platos_pendientes}
              </p>
            )}
            <h2>Mesa {mesa.numero}</h2>
            <p>Estado: {mesa.estado ? "Abierta" : "Cerrada"}</p>

            <p>
              Comensales: {mesa.comensales_activos}/{mesa.num_comensales}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CamareroMesas;
