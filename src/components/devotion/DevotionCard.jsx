import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, BookOpen } from "lucide-react";

/**
 * DevotionCard component
 * Card display for devotion in gallery view
 *
 * @param {Object} props - Component props
 * @param {Object} props.devotion - Devotion data
 */
const DevotionCard = ({ devotion }) => {
  // Convert Firestore timestamp to Date
  const devotionDate = devotion.publishDate?.toDate
    ? devotion.publishDate.toDate()
    : new Date(devotion.publishDate);

  return (
    <Link
      to={`/devotion/${devotion.id}`}
      className="block bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-105 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {/* Card Header with Date */}
      <div className="bg-primary p-4">
        <div className="flex items-center gap-2 text-white">
          <Calendar size={18} />
          <time
            dateTime={format(devotionDate, "yyyy-MM-dd")}
            className="text-sm font-medium"
          >
            {format(devotionDate, "MMMM d, yyyy")}
          </time>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {devotion.title}
        </h3>

        {/* Bible Verse */}
        <div className="flex items-start gap-2 mb-4">
          <BookOpen size={16} className="text-secondary mt-1 flex-shrink-0" />
          <p className="text-sm font-medium text-secondary">
            {devotion.bibleVerse}
          </p>
        </div>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {devotion.excerpt || devotion.content?.substring(0, 150) + "..."}
        </p>

        {/* Read More Link */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-smooth">
            Read More
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DevotionCard;
