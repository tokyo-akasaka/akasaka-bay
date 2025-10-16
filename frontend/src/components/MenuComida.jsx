// frontend/src/components/MenuComida.jsx

import { useState } from "react";
import "./MenuComida.css";
import useMenuComida from "./useMenuComida";
import { useTranslation } from "react-i18next";
import { getLocalizedText } from "../services/getLocalizedText";
import Alergenos from "./Alergenos";

function MenuComida() {
  const {
    comensal,
    categorias,
    platosPorCategoria,
    loading,
    handleAddToOrder,
  } = useMenuComida();
  const { t } = useTranslation();

  const [expandedCode, setExpandedCode] = useState(null);
  const [visibleAlergenos, setVisibleAlergenos] = useState(null);

  if (loading) return <p className="menu-msg">{t("menu.loading_menu")}</p>;
  if (!comensal) return <p className="menu-msg">{t("menu.not_found")}</p>;

  const toggleExpand = (plato) => {
    if (expandedCode === plato.code) {
      setExpandedCode(null);
      setVisibleAlergenos(null);
    } else {
      setExpandedCode(plato.code);
      setVisibleAlergenos(null);
    }
  };

  return (
    <div className="menu-container">
      <h1>
        🍽️ {t("menu.menu_title")} {comensal.mesa?.numero ?? comensal.mesa_id}
      </h1>
      <p>
        {t("menu.welcome")}, <strong>{comensal.nombre}</strong>
      </p>

      {platosPorCategoria.map((cat) => (
        <div key={cat.id} className="menu-section">
          <h2 className="menu-section-title">
            {getLocalizedText(cat, "title")}
          </h2>

          <div className="menu-list">
            {!Array.isArray(cat.platos) || cat.platos.length === 0 ? (
              <p className="menu-empty">{t("menu.no_dishes_category")}</p>
            ) : (
              cat.platos.map((plato) => {
                const isExpanded = expandedCode === plato.code;
                const showAlergenos = visibleAlergenos === plato.code;

                return (
                  <div
                    key={plato.id}
                    className={`menu-item ${isExpanded ? "expanded" : ""}`}
                  >
                    <div
                      className="menu-line"
                      onClick={() => toggleExpand(plato)}
                    >
                      <div className="menu-name">
                        {getLocalizedText(plato, "name")}
                      </div>
                      <div className="menu-price">
                        {plato.precio} €
                        {plato.price_descript && (
                          <span className="menu-desc">
                            {" "}
                            ({plato.price_descript})
                          </span>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        className="menu-details"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="menu-buttons-row">
                          <button
                            className="menu-btn-secondary"
                            onClick={() =>
                              setVisibleAlergenos((prev) =>
                                prev === plato.code ? null : plato.code
                              )
                            }
                          >
                            {t("menu.show_allergens")}
                          </button>

                          <button
                            className="menu-btn-add"
                            onClick={() => handleAddToOrder(plato)}
                          >
                            {t("menu.add_to_order")}
                          </button>
                        </div>

                        {showAlergenos && (
                          <Alergenos code={plato.code} iconsOnly />
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuComida;
