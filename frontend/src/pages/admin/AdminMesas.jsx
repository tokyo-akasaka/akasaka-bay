// frontend/src/pages/admin/AdminMesas.jsx

import useAdminMesas from "./useAdminMesas";
import "./AdminMesas.css";

function AdminMesas() {
  const { mesas } = useAdminMesas();

  return (
    <div className="admin-container">
      <h1>📋 Todas las Mesas</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Número de mesa</th>
            <th>Nombre de camarero</th>
            <th>Estado</th>
            <th>Comensales activos</th>
            <th>Total comensales</th>
            <th>Platos pendientes de confirmar</th>
          </tr>
        </thead>
        <tbody>
          {mesas.map((mesa) => (
            <tr key={mesa.id}>
              <td>{mesa.numero}</td>
              <td>{mesa.nombre_camarero || "—"}</td>
              <td>{mesa.estado ? "Abierta" : "Cerrada"}</td>
              <td>{mesa.comensales_activos}</td>
              <td>{mesa.num_comensales}</td>
              <td className={mesa.platos_pendientes > 0 ? "alerta" : ""}>
                {mesa.platos_pendientes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminMesas;
