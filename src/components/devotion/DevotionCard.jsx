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
      className="group block bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-smooth transform hover:-translate-y-1"
    >
      {/* Card Header with Gradient */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-6 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative flex items-center gap-2 text-white/90 mb-2">
          <Calendar size={16} className="flex-shrink-0" />
          <time
            dateTime={format(devotionDate, "yyyy-MM-dd")}
            className="text-sm font-medium"
          >
            {format(devotionDate, "MMMM d, yyyy")}
          </time>
        </div>

        {/* Title */}
        <h3 className="relative text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
          {devotion.title}
        </h3>

        {/* Bible Verse Badge */}
        <div className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
          <BookOpen size={14} className="text-white flex-shrink-0" />
          <p className="text-sm font-semibold text-white">
            {devotion.bibleVerse}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
          {devotion.excerpt || devotion.content?.substring(0, 150) + "..."}
        </p>

        {/* Read More Link */}
        <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-smooth">
          <span>Read Full Devotion</span>
          <span className="text-lg" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DevotionCard;
