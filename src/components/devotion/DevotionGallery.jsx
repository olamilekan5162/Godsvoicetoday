import { useState } from "react";
import DevotionCard from "./DevotionCard";
import LoadingSpinner from "../shared/LoadingSpinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * DevotionGallery component
 * Grid display of devotion cards with pagination
 *
 * @param {Object} props - Component props
 * @param {Array} props.devotions - Array of devotions to display
 * @param {boolean} props.loading - Loading state
 * @param {number} props.itemsPerPage - Number of items per page (default: 12)
 */
const DevotionGallery = ({
  devotions = [],
  loading = false,
  itemsPerPage = 12,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(devotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDevotions = devotions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Empty state
  if (!devotions || devotions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <BookOpen size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No devotions found
        </h3>
        <p className="text-gray-600">
          Check back soon for new daily devotions.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentDevotions.map((devotion) => (
          <DevotionCard key={devotion.id} devotion={devotion} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
            }`}
            aria-label="Next page"
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DevotionGallery;
