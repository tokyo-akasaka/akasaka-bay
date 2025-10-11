// 📁 frontend/src/services/comensalLinks.js
// Servicio encargado de recuperar los datos del comensal desde localStorage
// y generar los enlaces seguros (URIs) con token codificado en base64.

export function getComensalFromStorage() {
  try {
    const stored = localStorage.getItem("comensal");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (err) {
    console.error("❌ Error leyendo comensal desde localStorage:", err);
    return null;
  }
}

/**
 * Genera los enlaces de Menú y Mis Pedidos para el comensal
 * utilizando los datos guardados en localStorage.
 */
export function generarURIsComensal(comensal) {
  if (
    !comensal?.id ||
    !comensal?.mesa_id ||
    !comensal?.token ||
    !comensal?.session_id
  ) {
    console.warn(
      "⚠️ Datos de comensal incompletos. No se pueden generar URIs."
    );
    return { menuComida: "#", misPedidos: "#" };
  }

  try {
    const payload = {
      mesa_id: comensal.mesa_id,
      comensal_id: comensal.id,
      nombre: comensal.nombre,
      token: comensal.token,
      session_id: comensal.session_id,
      ts: Date.now(),
    };

    const tokenEncoded = btoa(
      unescape(encodeURIComponent(JSON.stringify(payload)))
    );

    const menuComida = `/comensal/menu-comida?mesa=${comensal.mesa_id}&comensal=${comensal.id}&token=${tokenEncoded}`;
    const misPedidos = `/comensal/mesa/${comensal.mesa_id}?comensal=${comensal.id}&token=${tokenEncoded}`;

    return { menuComida, misPedidos };
  } catch (err) {
    console.error("💥 Error generando URIs del comensal:", err);
    return { menuComida: "#", misPedidos: "#" };
  }
}
