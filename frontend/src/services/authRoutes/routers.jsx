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

// 🧑‍💼 ADMIN (de momento lo suple el camarero)
import AdminMesas from "../../pages/admin/AdminMesas";

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
  // 🏠 Home
  {
    path: "/",
    element: (
      <LayoutGeneral>
        <App />
      </LayoutGeneral>
    ),
  },

  // === 🧍‍♂️ COMENSAL (SIN RequireAuth) ===
  {
    path: "/comensal/menu-comida",
    element: (
      <LayoutGeneral>
        <MenuComida />
      </LayoutGeneral>
    ),
  },
  {
    path: "/comensal/mesa/:numero",
    element: (
      <LayoutGeneral>
        <LineasPedidos />
      </LayoutGeneral>
    ),
  },
  {
    path: "/comensal/registro",
    element: (
      <LayoutGeneral>
        <RegistroComensal />
      </LayoutGeneral>
    ),
  },

  // === 👨‍🍳 CAMARERO (CON RequireAuth) ===
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
        <RequireAuth allowed={["camarero"]}>
          <CamareroMesaSetup />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
  {
    path: "/camarero/mesas",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["camarero"]}>
          <CamareroMesas />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
  {
    path: "/camarero/mesas/:id",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["camarero"]}>
          <MesaDetalleCamarero />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
  {
    path: "/camarero/cobrar/:mesaId",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["camarero"]}>
          <CobrarMesa />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },

  // === 🧑‍💼 ADMIN (temporal → camarero) ===
  {
    path: "/admin/mesas",
    element: (
      <LayoutGeneral>
        <RequireAuth allowed={["camarero"]}>
          <AdminMesas />
        </RequireAuth>
      </LayoutGeneral>
    ),
  },
]);
