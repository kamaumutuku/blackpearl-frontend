// frontend/src/components/admin/AdminSidebar.jsx
import { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../context/UserAuthContext";

export default function AdminSidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* =========================
     Close on route change (mobile)
  ========================= */
  useEffect(() => {
    if (open && window.innerWidth < 768) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* =========================
     ESC key close
  ========================= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150";

  return (
    <aside
      role="navigation"
      aria-label="Admin Sidebar"
      className={`
        fixed md:static top-0 left-0 h-screen w-64
        bg-white border-r border-amber-200
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        z-50
        flex flex-col
        overflow-y-auto
        shadow-lg md:shadow-none
      `}
    >
      {/* =========================
         Header
      ========================= */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-amber-200 shrink-0">
        <h2 className="text-lg font-bold text-amber-700 truncate">
          Black Pearl Admin
        </h2>

        {/* Mobile close */}
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="md:hidden p-2 rounded-lg hover:bg-amber-100 active:scale-95 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* =========================
         Navigation
      ========================= */}
      <nav className="p-4 space-y-2 flex-1">
        <SidebarLink to="/admin/dashboard" icon={LayoutDashboard}>
          Dashboard
        </SidebarLink>

        <SidebarLink to="/admin/products" icon={Package}>
          Products
        </SidebarLink>

        <SidebarLink to="/admin/orders" icon={ShoppingCart}>
          Orders
        </SidebarLink>
      </nav>

      {/* =========================
         Footer
      ========================= */}
      <div className="p-4 border-t border-amber-200 shrink-0">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

/* =========================
   Reusable Sidebar Link
========================= */
function SidebarLink({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-amber-100 text-amber-800 shadow-sm"
            : "text-gray-600 hover:bg-amber-50"
        }
      `
      }
      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
    >
      <Icon size={18} />
      {children}
    </NavLink>
  );
}
