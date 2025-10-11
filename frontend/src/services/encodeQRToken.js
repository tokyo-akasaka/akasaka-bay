// frontend/src/services/encodeQRToken.js
/**
 * 🔐 encodeQRToken
 *
 * Codifica un objeto JSON en formato base64 para generar un token
 * que puede ser incluido en un código QR.
 *
 * Este token será utilizado por el cliente comensal para unirse a una mesa
 * a través del flujo de apertura inicial (/comensal/apertura-comensal?token=...).
 *
 * Ejemplo de datos codificados:
 * {
 *   mesa_id: 42,
 *   mesa_numero: 5,
 *   camarero_id: 9,
 *   num_comensales: 4,
 *   session_id: "uuid-1234..."
 * }
 *
 * @param {Object} data - Objeto con información de la mesa y sesión
 * @returns {string|null} - Cadena codificada en base64 o null si hay error
 */

export function encodeQRToken(data) {
  try {
    return btoa(JSON.stringify(data));
  } catch (err) {
    console.error("❌ Error codificando token QR:", err);
    return null;
  }
}
