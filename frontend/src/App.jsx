// src/App.jsx

// <TestTokenQR />
// <TestValidTokenQR />
//import TestTokenQR from "./components/TestTokenQR";
//import TestValidTokenQR from "./components/TestValidTokenQR";

import { useTranslation } from "react-i18next";

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <main>
        <h1 className="logo">
          <img src="/akasaka-bay-logo.png" alt={t("app.logo_alt")} />
        </h1>
        <section className="menus">
          <h2>{t("app.welcome")}</h2>
        </section>
      </main>
    </div>
  );
}
