import { Link, useLocation } from "react-router-dom";
import { BookOpen, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

/**
 * AdminLayout component
 * Layout wrapper for admin pages with sidebar navigation
 */
const AdminLayout = ({ children }) => {
  const { signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">
                  Manna Daily
                </span>
                <span className="text-xs text-gray-500">Admin Panel</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-2">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-smooth ${
                isActive("/admin/dashboard")
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/devotion/new"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-smooth ${
                isActive("/admin/devotion/new")
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <PlusCircle size={20} />
              <span>Create New</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-smooth"
              >
                <BookOpen size={20} />
                <span>View Public Site</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/admin/dashboard"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-smooth ${
              isActive("/admin/dashboard") ? "text-primary" : "text-gray-600"
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/devotion/new"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-smooth ${
              isActive("/admin/devotion/new") ? "text-primary" : "text-gray-600"
            }`}
          >
            <PlusCircle size={20} />
            <span className="text-xs font-medium">Create</span>
          </Link>

          <Link
            to="/"
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-gray-600 transition-smooth"
          >
            <BookOpen size={20} />
            <span className="text-xs font-medium">Public</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default AdminLayout;
