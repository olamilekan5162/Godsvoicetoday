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
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:scale-105 active:scale-95 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Share devotion"
      >
        <Share2 size={18} />
        <span className="text-sm font-medium">Share</span>
      </button>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check size={18} className="text-secondary" />
            <span className="text-sm font-medium text-secondary">Copied!</span>
          </>
        ) : (
          <>
            <Copy size={18} />
            <span className="text-sm font-medium">Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ShareButtons;
