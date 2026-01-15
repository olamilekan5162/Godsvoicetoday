import { useState } from "react";
import { format } from "date-fns";
import { Edit2, Trash2, Eye, EyeOff, Calendar } from "lucide-react";
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
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-medium transition-smooth border-b-2 ${
            filter === "all"
              ? "border-primary text-primary"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          All ({devotions.length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-4 py-2 font-medium transition-smooth border-b-2 ${
            filter === "published"
              ? "border-primary text-primary"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Published ({devotions.filter((d) => d.isPublished).length})
        </button>
        <button
          onClick={() => setFilter("unpublished")}
          className={`px-4 py-2 font-medium transition-smooth border-b-2 ${
            filter === "unpublished"
              ? "border-primary text-primary"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Unpublished ({devotions.filter((d) => !d.isPublished).length})
        </button>
      </div>

      {/* Table */}
      {filteredDevotions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No devotions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDevotions.map((devotion) => {
                  const devotionDate = devotion.publishDate?.toDate
                    ? devotion.publishDate.toDate()
                    : new Date(devotion.publishDate);

                  return (
                    <tr
                      key={devotion.id}
                      className="hover:bg-gray-50 transition-smooth"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Calendar size={16} className="text-gray-400" />
                          {format(devotionDate, "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {devotion.title}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {devotion.bibleVerse}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            onTogglePublish(devotion.id, !devotion.isPublished)
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-smooth ${
                            devotion.isPublished
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {devotion.isPublished ? (
                            <>
                              <Eye size={12} />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} />
                              Unpublished
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(devotion)}
                            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label="Edit devotion"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(devotion.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-red-500"
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
