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
    <div className="min-h-screen bg-gray-50/50 w-full overflow-x-hidden">
      {/* Admin Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm w-full">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[100vw]">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md hidden sm:block">
                <BookOpen size={24} className="text-white" />
              </div>
              {/* Mobile Logo Simplified */}
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md sm:hidden">
                <BookOpen size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none sm:leading-normal">
                  God's Voice Today
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex w-full max-w-[100vw] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white min-h-[calc(100vh-5rem)] hidden md:block shadow-sm flex-shrink-0">
          <nav className="p-6 space-y-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">
              Menu
            </div>

            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                isActive("/admin/dashboard")
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/devotion/new"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                isActive("/admin/devotion/new")
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
              }`}
            >
              <PlusCircle size={20} />
              <span>Create New</span>
            </Link>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">
                Shortcut
              </div>
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all"
              >
                <BookOpen size={20} />
                <span>View Public Site</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 pb-32 md:pb-8 transition-all min-w-0 w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 ring-1 ring-black/5 z-50 max-w-[calc(100vw-2rem)] mx-auto">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/admin/dashboard"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              isActive("/admin/dashboard") ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            <LayoutDashboard
              size={24}
              className={isActive("/admin/dashboard") ? "fill-current" : ""}
            />
          </Link>

          <Link
            to="/admin/devotion/new"
            className={`flex items-center justify-center -mt-8 w-14 h-14 rounded-full shadow-lg transition-transform active:scale-95 ${
              isActive("/admin/devotion/new")
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                : "bg-white text-gray-400 border border-gray-100"
            }`}
          >
            <PlusCircle size={28} />
          </Link>

          <Link
            to="/"
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-400 transition-all"
          >
            <BookOpen size={24} />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default AdminLayout;
