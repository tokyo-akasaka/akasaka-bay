// 📁 components/header/NavCamarero.jsx

import { Link } from "react-router-dom";

function NavCamarero() {
  return (
    <div className="dropdown">
      <span className="dropbtn">Camarero ▾</span>
      <div className="dropdown-content">
        <Link to="/camarero/setup">Apertura Mesa</Link>
        <Link to="/camarero/mesas">Mis Mesas</Link>
      </div>
    </div>
  );
}

export default NavCamarero;
