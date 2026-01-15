import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout component
 * Main layout wrapper with header and footer
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
