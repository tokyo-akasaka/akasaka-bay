import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function AperturaComensal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState(null);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token)); // decodificar Base64 → JSON

      // 🔹 limpiar y normalizar número de mesa (por si venía como ":3")
      decoded.mesa = parseInt(String(decoded.mesa).replace(":", ""), 10);

      setTokenData(decoded);
    } catch (err) {
      console.error("Error decodificando token:", err);
    }
  }, [searchParams]);

  const handleRegistro = async () => {
    if (!nombre.trim()) {
      alert("Introduce tu nombre");
      return;
    }

    if (!tokenData) return;

    setLoading(true);

    // 1. Buscar mesa en la vista (para saber si existe y estado actual)
    const { data: mesaVista, error: mesaError } = await supabase
      .from("mesas_con_comensales")
      .select("id, estado, comensales_activos, num_comensales")
      .eq("numero", tokenData.mesa)
      .single();

    let mesaId;

    if (!mesaVista) {
      // 🔹 Crear mesa nueva porque no existe aún
      const { data: nuevaMesa, error: insertMesaError } = await supabase
        .from("mesas")
        .insert([
          {
            numero: tokenData.mesa,
            estado: true, // la abrimos directamente
            fecha_apertura: new Date().toISOString(),
            session_id: tokenData.session_id,
            camarero_id: tokenData.camarero_id,
            num_comensales: tokenData.num_comensales,
          },
        ])
        .select("id")
        .single();

      if (insertMesaError) {
        console.error("Error creando mesa:", insertMesaError);
        alert("No se pudo crear la mesa");
        setLoading(false);
        return;
      }

      mesaId = nuevaMesa.id;
    } else {
      mesaId = mesaVista.id;

      // 2. Si existe pero está cerrada → abrirla
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

        if (updateError) {
          console.error("Error abriendo mesa:", updateError);
          alert("No se pudo abrir la mesa");
          setLoading(false);
          return;
        }
      }
    }

    // 3. Insertar comensal
    const { error: insertError } = await supabase.from("comensales").insert([
      {
        mesa_id: mesaId,
        nombre: nombre,
        activo: true,
      },
    ]);

    if (insertError) {
      console.error("Error insertando comensal:", insertError);
      alert("No se pudo registrar el comensal");
      setLoading(false);
      return;
    }

    setLoading(false);
    alert(
      `Bienvenido ${nombre}, estás registrado en la mesa ${tokenData.mesa}`
    );

    // Redirigir al componente de mesa (comensal)
    navigate(`/mesa/${tokenData.mesa}?session_id=${tokenData.session_id}`);
  };

  if (!tokenData) {
    return <p>Token inválido o faltante</p>;
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
        />
      </div>

      <button style={styles.button} onClick={handleRegistro} disabled={loading}>
        {loading ? "Registrando..." : "Unirme a la mesa"}
      </button>
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "Arial" },
  field: { marginBottom: "15px" },
  button: {
    marginTop: "20px",
    padding: "10px 15px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AperturaComensal;
