// frontend/src/components/MenuComida.jsx

import "./MenuComida.css";
import useMenuComida from "./useMenuComida";
import { useTranslation } from "react-i18next";
import { getLocalizedText } from "../services/getLocalizedText";

function MenuComida() {
  const {
    comensal,
    categorias,
    platosPorCategoria,
    loading,
    handleAddToOrder,
  } = useMenuComida();

  const { t } = useTranslation();

  if (loading) return <p className="menu-msg">{t("menu.loading_menu")}</p>;
  if (!comensal) return <p className="menu-msg">{t("menu.not_found")}</p>;

  return (
    <div className="menu-container">
      <h1>
        🍽️ {t("menu.menu_title")} {comensal.mesas?.numero ?? comensal.mesa_id}
      </h1>

      <p>
        {t("menu.welcome")}, <strong>{comensal.nombre}</strong> 👋
      </p>

      {platosPorCategoria.map((cat) => (
        <div key={cat.id} className="menu-section">
          <h2 className="menu-section-title">
            {getLocalizedText(cat, "title")}
          </h2>

          <div className="menu-grid">
            {!Array.isArray(cat.platos) || cat.platos.length === 0 ? (
              <p className="menu-empty">{t("menu.no_dishes_category")}</p>
            ) : (
              cat.platos.map((plato) => (
                <div key={plato.id} className="menu-card">
                  {plato.imagen && (
                    <img
                      src={plato.imagen}
                      alt={getLocalizedText(plato, "name")}
                      className="menu-img"
                    />
                  )}
                  <h3>{getLocalizedText(plato, "name")}</h3>
                  {plato[
                    `descripcion_${t("lang")}`
                  ] /* fallback if matches lang */ ||
                    (plato.descripcion_es && (
                      <p className="menu-desc">
                        {getLocalizedText(plato, "descripcion")}
                      </p>
                    ))}
                  <p className="menu-price">
                    {plato.precio.toFixed(2)} €{" "}
                    {plato.price_descript ? `(${plato.price_descript})` : ""}
                  </p>
                  <button
                    className="menu-btn-add"
                    onClick={() => handleAddToOrder(plato)}
                  >
                    {t("menu.add_to_order")}
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
