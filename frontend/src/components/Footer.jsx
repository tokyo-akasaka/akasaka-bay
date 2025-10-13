// 📁 frontend/src/components/Footer.jsx

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer-content">
      <p>
        © {new Date().getFullYear()} {t("footer.brand")}
      </p>
    </footer>
  );
}
