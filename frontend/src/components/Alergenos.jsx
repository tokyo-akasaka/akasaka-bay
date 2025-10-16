// 📁 frontend/src/components/Alergenos.jsx

import { useTranslation } from "react-i18next";
import alergenosData from "../data/alergenos.json";
import platoAlergenos from "../data/platoAlergenos.json";
import "./Alergenos.css";

function Alergenos({ code, iconsOnly = false }) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("en")
    ? "en"
    : i18n.language.startsWith("cn")
    ? "cn"
    : "es";

  const alergenosIds = platoAlergenos[code] || [];
  const { allergens } = alergenosData;

  if (!alergenosIds.length) return null;

  return (
    <div className={`alergenos ${iconsOnly ? "only-icons" : ""}`}>
      {alergenosIds.map((id) => {
        const alerg = allergens.find((a) => a.id === id);
        if (!alerg) return null;

        return (
          <div
            key={id}
            className="alergeno"
            title={iconsOnly ? "" : alerg[lang]}
          >
            <img src={alerg.slug} alt={alerg[lang]} />
            {!iconsOnly && <span>{alerg[lang]}</span>}
          </div>
        );
      })}
    </div>
  );
}

export default Alergenos;
