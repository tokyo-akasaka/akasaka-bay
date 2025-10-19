// /src/services/authRoutes/routers.jsx
import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";

import Header from "../../components/header/Header";
import Footer from "../../components/Footer";
import App from "../../App";

// 🧍‍♂️ COMENSAL
import RegistroComensal from "../../pages/comensal/RegistroComensal";
import LineasPedidos from "../../pages/comensal/LineasPedidos";
import MenuComida from "../../components/MenuComida";

// 👨‍🍳 CAMARERO
import CamareroLoginOtp from "../../components/CamareroLoginOtp";
import CamareroMesaSetup from "../../pages/camarero/CamareroMesaSetup";
import CamareroMesas from "../../pages/camarero/CamareroMesas";
import MesaDetalleCamarero from "../../pages/camarero/MesaDetalleCamarero";
import CobrarMesa from "../../components/cobrarMesa/CobrarMesa";

// 🧑‍💼 ADMIN
import AdminMesas from "../../pages/admin/AdminMesas";

// Layout principal
function LayoutGeneral({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export const router = createBrowserRouter([
  // 🏠 Página principal
  {
    path: "/",
    element: (
      <LayoutGeneral>
        <App />
      </LayoutGeneral>
    ),
  },

  // === 🧍‍♂️ COMENSAL ===
  {
    path: "/comensal/menu-comida",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["comensal", "camarero", "admin"]}>
          <MenuComida />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
  {
    path: "/comensal/mesa/:numero",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["comensal", "camarero", "admin"]}>
          <LineasPedidos />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
  {
    path: "/comensal/registro",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["comensal", "camarero", "admin"]}>
          <RegistroComensal />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },

  // === 👨‍🍳 CAMARERO ===
  {
    path: "/camarero/login",
    element: (
      <LayoutGeneral>
        <CamareroLoginOtp />
      </LayoutGeneral>
    ),
  },
  {
    path: "/camarero/setup",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["camarero", "admin"]}>
          <CamareroMesaSetup />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
  {
    path: "/camarero/mesas",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["camarero", "admin"]}>
          <CamareroMesas />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
  {
    path: "/camarero/mesas/:id",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["camarero", "admin"]}>
          <MesaDetalleCamarero />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
  {
    path: "/camarero/cobrar/:mesaId",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["camarero", "admin"]}>
          <CobrarMesa />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },

  // === 🧑‍💼 ADMIN ===
  {
    path: "/admin/mesas",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["admin"]}>
          <AdminMesas />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
]);
