// 📁 frontend/src/i18n/index.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./es.json";
import en from "./en.json";
import cn from "./cn.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      cn: { translation: cn },
    },
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },

    // 🧩 Aquí añades el manejador de claves faltantes:
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`🈳 Missing i18n key: ${ns}.${key} in language ${lng}`);
    },

    // (opcional) para mostrar una clave por defecto si falta
    saveMissing: true,
  });

export default i18n;
