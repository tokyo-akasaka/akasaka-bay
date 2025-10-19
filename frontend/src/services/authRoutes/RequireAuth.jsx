// /src/services/authRoutes/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function RequireAuth({ allowed, children }) {
  const { role, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // ✅ Autorizado
  if (role && allowed.includes(role)) return children;

  // 🚫 Sin acceso
  if (allowed.includes("comensal")) {
    return (
      <Navigate to="/comensal/registro" replace state={{ from: location }} />
    );
  }

  return <Navigate to="/camarero/login" replace state={{ from: location }} />;
}
