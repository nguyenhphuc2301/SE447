import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  Bed,
  Calendar,
  Users,
  FileText,
  Star,
  Settings,
  Bell,
  Menu,
  Search,
  CreditCard,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";

import { fetchUnresolvedReports } from "../services/report.service.js";
import { getAuth, logout } from "../services/auth.service.js";

const menuItems = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
  { name: "Buildings", icon: <Building2 size={18} />, path: "/buildings" },
  { name: "Rooms", icon: <Bed size={18} />, path: "/rooms" },
  { name: "Bookings", icon: <Calendar size={18} />, path: "/bookings" },
  { name: "Users", icon: <Users size={18} />, path: "/users" },
  { name: "Reports", icon: <FileText size={18} />, path: "/reports" },
  { name: "Reviews", icon: <Star size={18} />, path: "/reviews" },
  { name: "Payments", icon: <CreditCard size={18} />, path: "/payments" },
  { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [openBell, setOpenBell] = useState(false);
  const [unresolved, setUnresolved] = useState([]);
  const [loadingBell, setLoadingBell] = useState(false);
  const bellRef = useRef(null);

  const [openUser, setOpenUser] = useState(false);
  const userRef = useRef(null);

  const auth = getAuth();
  const displayName = auth?.user?.ho_ten || "Admin";
  const avatarChar = (displayName || "A").trim().slice(0, 1).toUpperCase();

  const isActive = (path) => pathname === path || pathname.startsWith(path + "/");

  const pageTitle = useMemo(() => {
    const current = menuItems.find((m) => isActive(m.path));
    return current?.name || "Dashboard";
  }, [pathname]);

  const loadUnresolved = async () => {
    try {
      setLoadingBell(true);
      const items = await fetchUnresolvedReports(5);
      setUnresolved(items || []);
    } catch (e) {
      console.error("fetchUnresolvedReports error:", e);
      setUnresolved([]);
    } finally {
      setLoadingBell(false);
    }
  };

  useEffect(() => {
    loadUnresolved();
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpenBell(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleLogout = () => {
    logout();
    setOpenUser(false);
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-sky-100">
            <Building2 size={20} className="text-sky-700" />
          </div>
          <h1 className="text-xl font-semibold text-sky-700">DormManager</h1>
        </div>

        <div className="px-6 py-3 text-xs font-semibold text-gray-400 tracking-wide">
          MENU
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                isActive(item.path)
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 md:hidden">
              <Menu size={18} />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>
              <p className="text-xs text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-gray-50 border px-3 py-1.5 rounded-lg shadow-inner text-sm">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none w-40 text-gray-700"
              />
            </div>
            <div className="relative" ref={bellRef}>
              <button
                onClick={async () => {
                  const next = !openBell;
                  setOpenBell(next);
                  if (next) await loadUnresolved();
                  if (next) setOpenUser(false); 
                }}
                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 relative"
                title="Unresolved reports"
              >
                <Bell size={18} className="text-gray-600" />

                {unresolved.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {unresolved.length > 9 ? "9+" : unresolved.length}
                  </span>
                )}
              </button>

              {openBell && (
                <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b font-semibold text-gray-700 flex items-center justify-between">
                    <span>Unresolved Reports</span>
                    <button
                      onClick={loadUnresolved}
                      className="text-xs text-sky-600 hover:underline"
                    >
                      Refresh
                    </button>
                  </div>

                  {loadingBell ? (
                    <div className="px-4 py-6 text-sm text-gray-400 text-center">
                      Loading...
                    </div>
                  ) : unresolved.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-gray-400 text-center">
                      No unresolved reports
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-auto">
                      {unresolved.map((r) => (
                        <Link
                          key={r.id}
                          to={`/reports/${r.id}`}
                          onClick={() => setOpenBell(false)}
                          className="block px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <p className="text-sm font-medium text-gray-700 line-clamp-1">
                            {r.noi_dung}
                          </p>
                          <p className="text-xs text-gray-400">
                            {r.ten_sinh_vien ? `${r.ten_sinh_vien} • ` : ""}
                            Room {r.so_phong} – {r.ten_toa}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="px-4 py-2 text-center">
                    <Link
                      to="/reports"
                      onClick={() => setOpenBell(false)}
                      className="text-sm text-sky-600 hover:underline"
                    >
                      View all reports
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setOpenUser((v) => !v);
                  setOpenBell(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50"
                title="Account"
              >
                <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-semibold text-sm">
                  {avatarChar}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {displayName}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {openUser && (
                <div className="absolute right-0 mt-3 w-56 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {auth?.user?.email || "admin"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setOpenUser(false);
                      navigate("/settings");
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User size={16} className="text-gray-500" />
                    Profile / Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
