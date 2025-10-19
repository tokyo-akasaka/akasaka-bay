// /src/services/authRoutes/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function RequireAuth({ allowed, children }) {
  const { role, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // evita parpadeos

  // ✅ Autorizado
  if (role && allowed.includes(role)) return children;

  // 🚫 Solo usamos este guard para camarero
  return <Navigate to="/camarero/login" replace state={{ from: location }} />;
}
