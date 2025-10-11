// 📁 frontend/src/pages/comensal/LineasPedidos.jsx

import { useLineasPedidos } from "./useLineasPedidos";
import "./LineasPedidos.css";

function LineasPedidos() {
  const { comensal, lineas, loading } = useLineasPedidos();

  if (loading) return <p className="msg">⏳ Cargando tus pedidos...</p>;
  if (!comensal) return <p className="msg">❌ No se encontró tu sesión.</p>;

  return (
    <div className="container">
      <h1>🧾 Pedido de la Mesa {comensal.mesa_id}</h1>
      <p>
        Bienvenido, <strong>{comensal.nombre}</strong> 👋
      </p>

      {lineas.length === 0 ? (
        <p className="msg">Aún no has añadido ningún plato.</p>
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
                  Cantidad: <strong>{linea.cantidad}</strong>
                </p>
                <p>
                  Precio:{" "}
                  <strong>
                    {(linea.precio_unitario * linea.cantidad).toFixed(2)}€
                  </strong>
                </p>
                <p>
                  Estado:{" "}
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
