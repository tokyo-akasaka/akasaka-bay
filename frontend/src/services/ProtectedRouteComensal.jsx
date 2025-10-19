// src/services/ProtectedRouteComensal.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRouteComensal({ children }) {
  const stored = localStorage.getItem("comensal");

  if (!stored) {
    console.warn("🔒 No hay comensal en localStorage");
    return <Navigate to="/" replace />;
  }

  try {
    const parsed = JSON.parse(stored);

    const { id, mesa_id, token, session_id } = parsed;

    const datosValidos = id && mesa_id && token && session_id;

    if (!datosValidos) {
      console.warn("🚫 Datos del comensal inválidos:", parsed);
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    console.error("❌ Error leyendo comensal desde localStorage:", err);
    return <Navigate to="/" replace />;
  }
}
