// /src/services/authRoutes/routers.jsx
import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";

// Ejemplo de layouts y páginas
import CamareroLayout from "../../pages/camarero/Layout";
import AdminLayout from "../../pages/admin/Layout";
import ComensalLayout from "../../pages/comensal/Layout";

import Mesas from "../../pages/camarero/Mesas";
import MesaDetalle from "../../pages/camarero/MesaDetalle";
import Cobrar from "../../pages/camarero/Cobrar";
import SetupCamarero from "../../pages/camarero/Setup";
import AdminMesa from "../../pages/admin/Mesa";
import MenuComida from "../../pages/comensal/MenuComida";
import MesaComensal from "../../pages/comensal/Mesa";
import Registro from "../../pages/comensal/Registro";
import Login from "../../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/camarero",
    element: (
      <RequireAuth allowed={["camarero", "admin"]}>
        <CamareroLayout />
      </RequireAuth>
    ),
    children: [
      { path: "mesas", element: <Mesas /> },
      { path: "mesas/:id", element: <MesaDetalle /> },
      { path: "cobrar/:mesaId", element: <Cobrar /> },
      { path: "setup", element: <SetupCamarero /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAuth allowed={["admin"]}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [{ path: "mesa", element: <AdminMesa /> }],
  },
  {
    path: "/comensal",
    element: (
      <RequireAuth allowed={["comensal", "camarero", "admin"]}>
        <ComensalLayout />
      </RequireAuth>
    ),
    children: [
      { path: "menu-comida", element: <MenuComida /> },
      { path: "mesa/:numero", element: <MesaComensal /> },
      { path: "registro", element: <Registro /> },
    ],
  },
]);
