// src/components/header/useHeaderContext.js
import { useLocation } from "react-router-dom";

export function useHeaderContext() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/comensal")) return "comensal";
  if (pathname.startsWith("/camarero")) return "camarero";
  if (pathname.startsWith("/admin")) return "admin";
  return "public";
}
