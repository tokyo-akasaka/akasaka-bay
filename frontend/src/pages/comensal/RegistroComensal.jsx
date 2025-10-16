// frontend/src/pages/comensal/RegistroComensal.jsx
import { useTranslation } from "react-i18next";
import useRegistroComensal from "./useRegistroComensal";
import "./RegistroComensal.css";

function RegistroComensal() {
  const { t } = useTranslation();
  const { tokenData, nombre, setNombre, loading, handleRegistro, tokenError } =
    useRegistroComensal();

  if (tokenError) {
    return (
      <p className="registro-error">{t("guest_register.invalid_token")}</p>
    );
  }

  if (!tokenData) {
    return <p className="registro-loading">{t("guest_register.loading")}</p>;
  }

  return (
    <div className="registro-minimal-container">
      <h1 className="registro-title">
        {t("guest_register.join_table")} {tokenData.mesa_numero}
      </h1>
      <label htmlFor="nombre">{t("guest_register.your_name")}</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder={t("guest_register.name_placeholder")}
        className="registro-minimal-input"
      />

      <button
        className="registro-minimal-button"
        onClick={handleRegistro}
        disabled={loading || nombre.trim().length === 0}
      >
        {t("guest_register.join")} →
      </button>
    </div>
  );
}

export default RegistroComensal;
