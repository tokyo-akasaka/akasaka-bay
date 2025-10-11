// frontend/src/components/MenuComida.jsx

import "./MenuComida.css";
import useMenuComida from "./useMenuComida";

function MenuComida() {
  const {
    comensal,
    categorias,
    platosPorCategoria,
    loading,
    handleAddToOrder,
  } = useMenuComida();

  if (loading) return <p className="menu-msg">⏳ Cargando menú...</p>;
  if (!comensal)
    return <p className="menu-msg">❌ No se encontró tu información.</p>;

  return (
    <div className="menu-container">
      <h1>🍽️ Menú de la Mesa {comensal.mesas?.numero ?? comensal.mesa_id}</h1>

      <p>
        Bienvenido, <strong>{comensal.nombre}</strong> 👋
      </p>

      {platosPorCategoria.map((cat) => (
        <div key={cat.id} className="menu-section">
          <h2 className="menu-section-title">{cat.title_es}</h2>

          <div className="menu-grid">
            {!Array.isArray(cat.platos) || cat.platos.length === 0 ? ( // ← aquí antes decía .items
              <p className="menu-empty">
                No hay platos disponibles en esta categoría.
              </p>
            ) : (
              cat.platos.map((plato) => (
                <div key={plato.id} className="menu-card">
                  {plato.imagen && (
                    <img
                      src={plato.imagen}
                      alt={plato.name_es}
                      className="menu-img"
                    />
                  )}
                  <h3>{plato.name_es}</h3>
                  {plato.descripcion_es && (
                    <p className="menu-desc">{plato.descripcion_es}</p>
                  )}
                  <p className="menu-price">
                    {plato.precio.toFixed(2)} €{" "}
                    {plato.price_descript ? `(${plato.price_descript})` : ""}
                  </p>
                  <button
                    className="menu-btn-add"
                    onClick={() => handleAddToOrder(plato)}
                  >
                    Añadir al pedido
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuComida;
