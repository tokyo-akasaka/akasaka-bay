import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import CamareroMesaSetup from "./pages/CamareroMesaSetup";
import CamareroMesas from "./pages/CamareroMesas";
import AperturaComensal from "./pages/AperturaComensal";
import AdminMesas from "./pages/AdminMesas";
import MesaDetalle from "./pages/MesaDetalle"; // nueva vista
import Header from "./components/Header";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Header /> {/* 🔹 SIEMPRE ARRIBA */}
      <Routes>
        <Route path="/" element={<App />} />

        {/* Camarero */}
        <Route path="/camarero" element={<CamareroMesaSetup />} />
        <Route path="/camarero/mesas" element={<CamareroMesas />} />
        <Route path="/camarero/mesas/:numero" element={<MesaDetalle />} />

        {/* Comensal */}
        <Route path="/apertura-comensal" element={<AperturaComensal />} />

        {/* Admin */}
        <Route path="/admin/mesas" element={<AdminMesas />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
