// src/main.jsx

import "./i18n";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/resetAllCSS.css";
import "./styles/main.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./services/authRoutes/routers";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
