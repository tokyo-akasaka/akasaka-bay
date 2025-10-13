// frontend/src/pages/comensal/RegistroComensal.jsx

import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useRegistroComensal from "./useRegistroComensal";
import "./RegistroComensal.css";

function RegistroComensal() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
    <div className="registro-container">
      <h1>
        {t("guest_register.join_table")} #{tokenData.mesa_numero}
      </h1>
      <p>
        {t("guest_register.waiter")}: <strong>{tokenData.camarero_id}</strong>
      </p>
      <p>
        {t("guest_register.allowed_seats")}:{" "}
        <strong>{tokenData.num_comensales}</strong>
      </p>

      <div className="registro-field">
        <label>{t("guest_register.your_name")}:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={t("guest_register.name_placeholder")}
          className="registro-input"
        />
      </div>

      <button
        className="registro-button"
        onClick={handleRegistro}
        disabled={loading}
      >
        {loading ? t("guest_register.registering") : t("guest_register.join")}
      </button>
    </div>
  );
}

export default RegistroComensal;
