// src/services/ProtectedRouteCamarero.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRouteCamarero({ children }) {
  try {
    const stored = localStorage.getItem("camarero");
    if (!stored) throw new Error("No camarero");
    const parsed = JSON.parse(stored);
    if (!parsed?.id) throw new Error("Camarero inválido");
    // Pasó las validaciones: renderiza la ruta
    return children;
  } catch (err) {
    // Si no está autenticado o es inválido: redirige
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRouteCamarero;
