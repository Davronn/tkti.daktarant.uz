import {  Outlet, useLocation } from "react-router-dom";
import "../styles/Header.css"

function Header() {
  const location = useLocation();

  // Agar sahifa `/login` bo‘lsa, Header ko‘rsatilmaydi
  if (location.pathname === "/login") {
    return <Outlet />; // Faqatgina sahifa kontenti chiqadi
  }

  return (
    <div className="headerflex">
      <h1>Header</h1>
      <div className="p-4">
        <Outlet /> {/* Bu joyda sahifalar almashadi */}
      </div>
    </div>
  );
}

export default Header;
