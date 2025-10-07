import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function AperturaComensal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState(null);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Decodificar el token del QR
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    try {
      // Normaliza Base64URL → Base64 estándar y decodifica
      const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
      const jsonString = atob(base64);
      const decoded = JSON.parse(jsonString);

      // Limpiar número de mesa (por si venía como ":3")
      decoded.mesa = parseInt(String(decoded.mesa).replace(":", ""), 10);

      setTokenData(decoded);
    } catch (err) {
      console.error("Error decodificando token:", err);
    }
  }, [searchParams]);

  // 🔹 Registrar comensal
  const handleRegistro = async () => {
    if (!nombre.trim()) {
      alert("Introduce tu nombre");
      return;
    }

    if (!tokenData) return;

    setLoading(true);

    try {
      // 1️⃣ Buscar mesa existente
      const { data: mesaVista } = await supabase
        .from("mesas_con_comensales")
        .select("id, estado, comensales_activos, num_comensales")
        .eq("numero", tokenData.mesa)
        .maybeSingle();

      let mesaId;

      if (!mesaVista) {
        // 2️⃣ Crear mesa nueva si no existe
        const { data: nuevaMesa, error: insertMesaError } = await supabase
          .from("mesas")
          .insert([
            {
              numero: tokenData.mesa,
              estado: true,
              fecha_apertura: new Date().toISOString(),
              session_id: tokenData.session_id,
              camarero_id: tokenData.camarero_id,
              num_comensales: tokenData.num_comensales,
            },
          ])
          .select("id")
          .single();

        if (insertMesaError) throw insertMesaError;

        mesaId = nuevaMesa.id;
      } else {
        mesaId = mesaVista.id;

        // 3️⃣ Si existe pero está cerrada → abrirla
        if (mesaVista.estado === false) {
          const { error: updateError } = await supabase
            .from("mesas")
            .update({
              estado: true,
              fecha_apertura: new Date().toISOString(),
              session_id: tokenData.session_id,
              camarero_id: tokenData.camarero_id,
              num_comensales: tokenData.num_comensales,
            })
            .eq("id", mesaVista.id);

          if (updateError) throw updateError;
        }
      }

      // 4️⃣ Insertar comensal y recuperar su token
      const { data: nuevoComensal, error: insertError } = await supabase
        .from("comensales")
        .insert([
          {
            mesa_id: mesaId,
            nombre: nombre,
            activo: true,
            session_id: tokenData.session_id,
            camarero_id: tokenData.camarero_id,
          },
        ])
        .select("id, token")
        .single();

      if (insertError) throw insertError;

      // 5️⃣ Redirigir al menú del comensal
      alert(
        `✅ Bienvenido ${nombre}, estás registrado en la mesa ${tokenData.mesa}`
      );

      // 🧠 Guardar datos del comensal en localStorage
      const comensalData = {
        id: nuevoComensal.id,
        nombre: nombre,
        token: nuevoComensal.token,
        mesa_id: mesaId,
        session_id: tokenData.session_id,
        camarero_id: tokenData.camarero_id,
      };
      localStorage.setItem("comensal", JSON.stringify(comensalData));

      // 🔹 Redirigir al menú del comensal
      navigate(
        `/comensal/menu-comida?mesa=${tokenData.mesa}&session_id=${tokenData.session_id}&comensal_token=${nuevoComensal.token}`
      );
    } catch (err) {
      console.error("❌ Error en registro:", err);
      alert("Ocurrió un error al registrarte. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔸 Si el token no es válido
  if (!tokenData) {
    return <p style={styles.error}>❌ Token inválido o faltante</p>;
  }

  return (
    <div style={styles.container}>
      <h1>🍣 Bienvenido a la Mesa {tokenData.mesa}</h1>
      <p>
        Camarero asignado: <strong>{tokenData.camarero_id}</strong>
      </p>
      <p>
        Comensales previstos: <strong>{tokenData.num_comensales}</strong>
      </p>

      <div style={styles.field}>
        <label>Tu nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Sofía"
          style={styles.input}
        />
      </div>

      <button style={styles.button} onClick={handleRegistro} disabled={loading}>
        {loading ? "Registrando..." : "Unirme a la mesa"}
      </button>
    </div>
  );
}

// 🎨 Estilos
const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  field: { marginBottom: "15px" },
  input: {
    marginLeft: "10px",
    padding: "6px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "20px",
    padding: "10px 15px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "red",
  },
};

export default AperturaComensal;
