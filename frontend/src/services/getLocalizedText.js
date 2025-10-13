// 📁 frontend/src/services/getLocalizedText.js

import i18n from "i18next";

/**
 * Devuelve el texto traducido según el idioma actual.
 * Ejemplo:
 *   getLocalizedText(plato, "name") → name_es / name_en / name_cn
 */
export function getLocalizedText(item, baseKey) {
  const lang = i18n.language || "es"; // fallback a español si no definido
  const key = `${baseKey}_${lang}`;
  return item?.[key] || item?.[`${baseKey}_es`] || "";
}
