// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/main.css";
import "./styles/layout.css";

import App from "./App";
import Header from "./components/header/Header";
import Footer from "./components/Footer";

// 🧍‍♂️ Comensal
import RegistroComensal from "./pages/comensal/RegistroComensal";
import MenuComida from "./components/MenuComida";
import LineasPedidos from "./pages/comensal/LineasPedidos";

// 👨‍🍳 Camarero
import CamareroLoginOtp from "./components/CamareroLoginOtp";
import CamareroMesaSetup from "./pages/camarero/CamareroMesaSetup";
import CamareroMesas from "./pages/camarero/CamareroMesas";
import MesaDetalle from "./pages/camarero/MesaDetalleCamarero";

// 🧑‍💼 Admin
import AdminMesas from "./pages/admin/AdminMesas";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<App />} />
        {/* === 🧍‍♂️ COMENSAL === */}
        <Route path="/comensal/menu-comida" element={<MenuComida />} />
        <Route path="/comensal/mesa/:numero" element={<LineasPedidos />} />
        <Route path="/comensal/registro" element={<RegistroComensal />} />
        {/* === 👨‍🍳 CAMARERO === */}
        <Route path="/camarero/login" element={<CamareroLoginOtp />} />
        <Route path="/camarero/setup" element={<CamareroMesaSetup />} />
        <Route path="/camarero/mesas" element={<CamareroMesas />} />
        <Route path="/camarero/mesas/:id" element={<MesaDetalle />} />
        {/* === 🧑‍💼 ADMIN === */}
        <Route path="/admin/mesas" element={<AdminMesas />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
);
