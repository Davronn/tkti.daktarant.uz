import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaFileAlt } from "react-icons/fa";
import "../styles/Header.css";

function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Agar sahifa `/login` bo'lsa, Header ko'rsatilmaydi
  if (location.pathname === "/login") {
    return <Outlet />; // Faqatgina sahifa kontenti chiqadi
  }

  return (
    <div className="headerflex">
      <div className={`dashboard ${isOpen ? "open" : ""}`}>
        <div className="toggle-btn-container">
          <button className="togglee-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="sidebar">
          <nav>
            <Link to="/" className="nav-link">
              <FaHome />
              <span>Bosh sahifa</span>
            </Link>
            <Link to="/addReport" className="nav-link">
              <FaFileAlt />
              <span>Hisobot qo'shish</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-[80px]">
        <Outlet /> {/* Bu joyda sahifalar almashadi */}
      </div>
    </div>
  );
}

export default Header;
