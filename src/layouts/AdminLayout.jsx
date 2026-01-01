import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Detect modal routes or query params
  const modalOpen = location.state?.modal === true;

  /* 🔒 Lock body scroll */
  useEffect(() => {
    document.body.style.overflow =
      sidebarOpen || modalOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen, modalOpen]);

  return (
    <div className="min-h-screen flex bg-amber-50 relative">
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        disabled={modalOpen}   // 👈 NEW
      />

      {/* Overlay */}
      {(sidebarOpen || modalOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-amber-200 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-amber-100"
            disabled={modalOpen}   // 👈 BLOCK when modal open
          >
            <Menu size={22} />
          </button>
          <h1 className="font-semibold text-amber-700">
            Admin Panel
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
