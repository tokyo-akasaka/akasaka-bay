// frontend/src/pages/comensal/RegistroComensal.jsx

import { useSearchParams, useNavigate } from "react-router-dom";
import useRegistroComensal from "./useRegistroComensal";
import "./RegistroComensal.css";

function RegistroComensal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tokenData, nombre, setNombre, loading, handleRegistro, tokenError } =
    useRegistroComensal();

  // Si el token es inválido, mostrar error
  if (tokenError) {
    return <p className="registro-error">❌ Token inválido o faltante.</p>;
  }

  // Mientras carga datos
  if (!tokenData) {
    return <p className="registro-loading">Cargando...</p>;
  }

  return (
    <div className="registro-container">
      <h1>Unirse a la Mesa #{tokenData.mesa_numero}</h1>
      <p>
        Camarero: <strong>{tokenData.camarero_id}</strong>
      </p>
      <p>
        Plazas permitidas: <strong>{tokenData.num_comensales}</strong>
      </p>

      <div className="registro-field">
        <label>Tu nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Ana"
          className="registro-input"
        />
      </div>

      <button
        className="registro-button"
        onClick={handleRegistro}
        disabled={loading}
      >
        {loading ? "Registrando..." : "Unirme"}
      </button>
    </div>
  );
}

export default RegistroComensal;
