import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { LogOut, LayoutDashboard, Package, PlusSquare, Tag, Menu } from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: "/admin/products", label: "Products", icon: <Package className="w-5 h-5" /> },
    { to: "/admin/products/create", label: "Create Product", icon: <PlusSquare className="w-5 h-5" /> },
    { to: "/admin/categories/create", label: "Create Category", icon: <Tag className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-20 top-0 left-0 h-full bg-white border-r shadow-sm transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out w-64`}
      >
        <div className="p-6 text-xl font-bold text-gray-800 border-b">
          🛍️ Admin Panel
        </div>
        <nav className="flex flex-col gap-1 p-4 text-gray-700">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 transition ${
                pathname === item.to ? "bg-blue-200 font-semibold text-blue-800" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full bg-red-100 text-red-600 px-4 py-2 rounded-full hover:bg-red-200 transition-colors duration-200 shadow-sm"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow-sm">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
