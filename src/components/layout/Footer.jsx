import { Heart } from "lucide-react";

/**
 * Footer component
 * Application footer with branding and copyright
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-subtle mt-auto pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Tagline */}
          <p className="text-sm text-gray-600 italic">
            "Hear what God is saying to you today"
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>© {currentYear} God's Voice Today</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with{" "}
              <Heart size={14} className="text-secondary fill-secondary" /> for
              Christ
            </span>
          </div>

          {/* Bible Verse */}
          <p className="text-xs text-gray-400 text-center max-w-md">
            "My sheep hear my voice, and I know them, and they follow me." -
            John 10:27
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
