import { Heart } from "lucide-react";

/**
 * Footer component
 * Application footer with branding and copyright
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Tagline */}
          <p className="text-sm text-gray-600 italic">
            "Today's word for today's need"
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-gray-300"></div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>© {currentYear} Manna Daily</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with{" "}
              <Heart size={14} className="text-secondary fill-secondary" /> for
              Christ
            </span>
          </div>

          {/* Bible Verse */}
          <p className="text-xs text-gray-400 text-center max-w-md">
            "Man shall not live by bread alone, but by every word that comes
            from the mouth of God." - Matthew 4:4
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
