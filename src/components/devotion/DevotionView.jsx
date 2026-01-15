import { format } from "date-fns";
import { Calendar, BookOpen } from "lucide-react";
import ShareButtons from "../shared/ShareButtons";

/**
 * DevotionView component
 * Full devotion display with all content
 *
 * @param {Object} props - Component props
 * @param {Object} props.devotion - Devotion data
 */
const DevotionView = ({ devotion }) => {
  // Convert Firestore timestamp to Date
  const devotionDate = devotion.publishDate?.toDate
    ? devotion.publishDate.toDate()
    : new Date(devotion.publishDate);

  // Generate share URL
  const shareUrl = window.location.href;
  const shareTitle = `${devotion.title} - Manna Daily`;
  const shareText = `${devotion.bibleVerse}\n\n${
    devotion.excerpt || devotion.content.substring(0, 150)
  }...`;

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} />
          <time
            dateTime={format(devotionDate, "yyyy-MM-dd")}
            className="text-sm font-medium opacity-90"
          >
            {format(devotionDate, "EEEE, MMMM d, yyyy")}
          </time>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {devotion.title}
        </h1>

        <div className="flex items-start gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <BookOpen size={20} className="mt-1 flex-shrink-0" />
          <p className="text-lg font-medium">{devotion.bibleVerse}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 md:p-12">
        <div className="prose prose-lg max-w-none">
          {devotion.content.split("\n").map(
            (paragraph, index) =>
              paragraph.trim() && (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              )
          )}
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Share this devotion
          </h3>
          <ShareButtons title={shareTitle} text={shareText} url={shareUrl} />
        </div>
      </div>
    </article>
  );
};

export default DevotionView;
