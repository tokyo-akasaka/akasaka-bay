// 📁 components/header/LanguageSelector.jsx
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
  };

  return (
    <div className="language-selector">
      <button onClick={() => changeLanguage("es")}>🇪🇸</button>
      <button onClick={() => changeLanguage("en")}>🇬🇧</button>
      <button onClick={() => changeLanguage("cn")}>🇨🇳</button>
    </div>
  );
}
