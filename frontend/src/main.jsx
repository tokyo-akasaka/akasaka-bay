import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import Header from "./components/Header";

// 🧍‍♂️ Comensal
import AperturaComensal from "./pages/AperturaComensal";
import MenuComida from "./pages/MenuComida";
import LineasPedidos from "./pages/LineasPedidos";

// 👨‍🍳 Camarero
import CamareroLoginOtp from "./pages/CamareroLoginOtp";
import CamareroMesaSetup from "./pages/CamareroMesaSetup";
import CamareroMesas from "./pages/CamareroMesas";
import MesaDetalle from "./pages/MesaDetalle";

// 🧑‍💼 Admin
import AdminMesas from "./pages/AdminMesas";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        x{/* Página principal */}
        <Route path="/" element={<App />} />
        {/* === 🧍‍♂️ COMENSAL === */}
        <Route
          path="/comensal/apertura-comensal"
          element={<AperturaComensal />}
        />
        <Route path="/comensal/menu-comida" element={<MenuComida />} />
        <Route path="/comensal/mesa/:numero" element={<LineasPedidos />} />
        {/* === 👨‍🍳 CAMARERO === */}
        <Route path="/camarero/login" element={<CamareroLoginOtp />} />
        <Route path="/camarero/setup" element={<CamareroMesaSetup />} />
        <Route path="/camarero/mesas" element={<CamareroMesas />} />
        <Route path="/camarero/mesas/:numero" element={<MesaDetalle />} />
        {/* === 🧑‍💼 ADMIN === */}
        <Route path="/admin/mesas" element={<AdminMesas />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
