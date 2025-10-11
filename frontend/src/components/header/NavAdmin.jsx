// 📁 components/header/NavAdmin.jsx

import { Link } from "react-router-dom";

function NavAdmin() {
  return (
    <div className="dropdown">
      <span className="dropbtn">Admin ▾</span>
      <div className="dropdown-content">
        <Link to="/admin/mesas">Mesas</Link>
      </div>
    </div>
  );
}

export default NavAdmin;
