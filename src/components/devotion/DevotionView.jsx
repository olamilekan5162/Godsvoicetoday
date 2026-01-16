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
  const shareTitle = `${devotion.title} - God's Voice Today`;
  const shareText = `${devotion.bibleVerse}\n\n${
    devotion.excerpt || devotion.content.substring(0, 150)
  }...`;

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header Section */}
      {/* Header Section */}
      <div className="relative min-h-[300px] flex items-end p-8 md:p-12 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        {/* Background Image/Gradient */}
        <div className="absolute inset-0 z-0">
          {/* Abstract circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        </div>

        <div className="relative z-10 w-full">
          {/* Date Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-indigo-100 text-sm font-medium mb-6 border border-white/10">
            <Calendar size={14} />
            <time dateTime={format(devotionDate, "yyyy-MM-dd")}>
              {format(devotionDate, "EEEE, MMMM d, yyyy")}
            </time>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {devotion.title}
          </h1>

          <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
            <BookOpen
              size={24}
              className="text-indigo-200 mt-1 flex-shrink-0"
            />
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">
                Scripture Focus
              </span>
              <p className="text-lg md:text-xl font-medium text-white italic">
                "{devotion.bibleVerse}"
              </p>
            </div>
          </div>
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
        <div className="mt-12 pt-8 border-t border-gray-100">
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
