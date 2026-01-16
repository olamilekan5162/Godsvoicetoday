import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

/**
 * ShareButtons component
 * Provides share functionality using Web Share API with clipboard fallback
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title to share
 * @param {string} props.text - Text content to share
 * @param {string} props.url - URL to share
 */
const ShareButtons = ({ title, text, url }) => {
  const [copied, setCopied] = useState(false);

  /**
   * Handle native share using Web Share API
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        // User cancelled share or error occurred
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback to copy to clipboard
      handleCopyLink();
    }
  };

  /**
   * Copy link to clipboard
   */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Native Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Share devotion"
      >
        <Share2 size={18} />
        <span>Share</span>
      </button>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
          copied
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-gray-100 text-gray-700 border border-transparent hover:bg-gray-200 hover:shadow-md"
        }`}
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check size={18} />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={18} />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ShareButtons;
