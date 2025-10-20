import React from "react";
import { useParams } from "react-router-dom";
import useCobrarMesa from "./useCobrarMesa";
import "./CobrarMesa.css";

function CobrarMesa() {
  const { mesaId } = useParams();
  const {
    mesa,
    comensales,
    totalMesa,
    pendientes,
    cargando,
    error,
    cobrarYcerrar,
  } = useCobrarMesa(mesaId);

  const handleCobrar = async () => {
    const result = await cobrarYcerrar();
    if (result.success) {
      alert("Mesa cobrada y cerrada correctamente");
    } else {
      alert(
        "Error al cerrar la mesa: " +
          (result.error?.message || "Error desconocido")
      );
    }
  };

  if (cargando) return <p className="msg">Cargando...</p>;
  if (error) return <p className="msg error">Error: {String(error)}</p>;
  if (!mesa) return <p className="msg">Mesa no encontrada</p>;

  return (
    <div className="cobrar-mesa-container">
      <h2>Cobrar Mesa #{mesa.numero}</h2>

      <div className="resumen-mesa">
        <p>
          <strong>Total mesa:</strong> {Number(totalMesa || 0).toFixed(2)} €
        </p>
        <p>
          <strong>Platos pendientes:</strong> {pendientes}
        </p>
      </div>

      <div className="lista-comensales">
        {comensales.map((c) => (
          <div key={c.id} className="comensal-section">
            <div className="comensal-line">
              <span>
                <strong>{c.nombre}</strong>
              </span>
              <span>{Number(c.subtotal ?? 0).toFixed(2)} €</span>
            </div>

            {/* Lista de platos del comensal */}
            {c.platos && c.platos.length > 0 ? (
              <div className="platos-list">
                {c.platos.map((plato, index) => (
                  <div key={index} className="plato-line">
                    <span>{plato.nombre}</span>
                    <span>
                      {Number(plato.precio ?? 0).toFixed(2)} €
                      {plato.estado === "pendiente" && (
                        <span className="pendiente-badge"> (Pendiente)</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sin-pedidos">No hay platos registrados.</p>
            )}
          </div>
        ))}
      </div>

      <div className="acciones-cobrar">
        <button
          className="btn-cobrar"
          onClick={handleCobrar}
          disabled={pendientes > 0}
        >
          {pendientes > 0 ? "No puede cobrar" : "Cobrar y cerrar mesa"}
        </button>
      </div>
    </div>
  );
}

export default CobrarMesa;
