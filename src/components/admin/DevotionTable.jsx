import { useState } from "react";
import { format } from "date-fns";
import { Edit2, Trash2, Eye, EyeOff, Calendar, BookOpen } from "lucide-react";
import LoadingSpinner from "../shared/LoadingSpinner";

/**
 * DevotionTable component
 * Table view of all devotions with admin actions
 *
 * @param {Object} props - Component props
 * @param {Array} props.devotions - Array of devotions
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @param {Function} props.onTogglePublish - Toggle publish callback
 * @param {boolean} props.loading - Loading state
 */
const DevotionTable = ({
  devotions = [],
  onEdit,
  onDelete,
  onTogglePublish,
  loading = false,
}) => {
  const [filter, setFilter] = useState("all"); // 'all', 'published', 'unpublished'

  const filteredDevotions = devotions.filter((devotion) => {
    if (filter === "published") return devotion.isPublished;
    if (filter === "unpublished") return !devotion.isPublished;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100/50 rounded-xl w-fit">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
            filter === "all"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          All ({devotions.length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
            filter === "published"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          Published ({devotions.filter((d) => d.isPublished).length})
        </button>
        <button
          onClick={() => setFilter("unpublished")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
            filter === "unpublished"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          Unpublished ({devotions.filter((d) => !d.isPublished).length})
        </button>
      </div>

      {/* Table */}
      {filteredDevotions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No devotions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden w-full max-w-[calc(100vw-2rem)] sm:max-w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Title & Verse
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-400">
                {filteredDevotions.map((devotion) => {
                  const devotionDate = devotion.publishDate?.toDate
                    ? devotion.publishDate.toDate()
                    : new Date(devotion.publishDate);

                  return (
                    <tr
                      key={devotion.id}
                      className="hover:bg-indigo-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Calendar size={16} className="text-indigo-400" />
                          {format(devotionDate, "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900 line-clamp-1 mb-0.5">
                          {devotion.title}
                        </div>
                        <div className="text-xs font-medium text-gray-500 line-clamp-1 bg-gray-100 inline-block px-2 py-0.5 rounded-full">
                          {devotion.bibleVerse}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            onTogglePublish(devotion.id, !devotion.isPublished)
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            devotion.isPublished
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {devotion.isPublished ? (
                            <>
                              <Eye size={14} />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} />
                              Unpublished
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(devotion)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            aria-label="Edit devotion"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(devotion.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            aria-label="Delete devotion"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevotionTable;
