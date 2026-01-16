import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Header component
 * Main navigation header for the application
 */
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-lg py-2"
          : "bg-white/50 backdrop-blur-sm py-4 border-b border-white/10"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:scale-110 transition-smooth shadow-md">
              <BookOpen size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                God's Voice Today
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                Hear what God is saying
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-smooth ${
                isActive("/")
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              to="/archive"
              className={`text-sm font-medium transition-smooth ${
                isActive("/archive")
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Archive
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`text-sm font-medium transition-smooth ${
                    location.pathname.startsWith("/admin")
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Admin
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-smooth"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-smooth"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-auto left-4 right-4 p-4 mt-2 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 ring-1 ring-black/5 transform transition-all z-50">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                Home
              </Link>
              <Link
                to="/archive"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive("/archive")
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                Archive
              </Link>

              {isAdmin && (
                <>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      location.pathname.startsWith("/admin")
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-300 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
