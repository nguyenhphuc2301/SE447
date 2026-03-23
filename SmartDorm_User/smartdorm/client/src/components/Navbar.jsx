import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser, isLoggedIn, logout } from "../services/authService";
import { FiClipboard, FiCreditCard, FiUser, FiHelpCircle } from "react-icons/fi";

function ActionLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition"
    >
      <span className="text-[18px]">{icon}</span>
      <span className="text-[14px] font-medium">{label}</span>
    </Link>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState(null);

  const syncAuth = () => {
    const ok = isLoggedIn();
    setLogged(ok);
    setUser(ok ? getUser() : null);
  };

  useEffect(() => {
    syncAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    syncAuth();
    navigate("/");
  };

  return (
    <>
      {/* HEADER CHÍNH */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            SmartDorm
          </Link>

          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link to="/dorms" className="hover:text-blue-600">
              Danh sách KTX
            </Link>
            <Link to="/about" className="hover:text-blue-600">
              Giới thiệu
            </Link>
            <Link to="/contact" className="hover:text-blue-600">
              Liên hệ
            </Link>
          </nav>

          {!logged ? (
            <div className="space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-gray-700">
                Xin chào,{" "}
                <b className="text-blue-600">
                  {user?.ho_ten || user?.name || "User"}
                </b>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>
      {logged && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-2 flex flex-wrap items-center gap-2">
            <ActionLink
              to="/my-bookings"
              icon={<FiClipboard />}
              label="Đơn đặt phòng của tôi"
            />
          </div>
        </div>
      )}
    </>
  );
}
