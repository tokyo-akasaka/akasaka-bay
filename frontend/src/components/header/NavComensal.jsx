// 📁 components/header/NavComensal.jsx

import { Link } from "react-router-dom";
import {
  getComensalFromStorage,
  generarURIsComensal,
} from "../../services/comensalLinks";

function NavComensal() {
  const comensal = getComensalFromStorage();
  const { menuComida, misPedidos } = generarURIsComensal(comensal);

  return (
    <div className="dropdown">
      <span className="dropbtn">Comensal ▾</span>
      <div className="dropdown-content">
        <Link to={menuComida}>Menú comida</Link>
        <Link to={misPedidos}>Mis pedidos</Link>
      </div>
    </div>
  );
}

export default NavComensal;
