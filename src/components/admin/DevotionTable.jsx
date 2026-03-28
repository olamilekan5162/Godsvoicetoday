import { useState, useMemo } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import LoadingSpinner from "../shared/LoadingSpinner";

/**
 * DevotionTable component
 * Table view of all devotions with admin actions, search, filter and pagination.
 */
const DevotionTable = ({
  devotions = [],
  onEdit,
  onDelete,
  onTogglePublish,
  loading = false,
}) => {
  const [filter, setFilter] = useState("all"); // 'all', 'published', 'unpublished'
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const processedDevotions = useMemo(() => {
    let result = [...devotions];

    // 1. Filter by status
    if (filter === "published") result = result.filter((d) => d.isPublished);
    if (filter === "unpublished") result = result.filter((d) => !d.isPublished);

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          (d.title && d.title.toLowerCase().includes(query)) ||
          (d.bibleVerse && d.bibleVerse.toLowerCase().includes(query)),
      );
    }

    // 3. Filter by Date Range
    if (startDate || endDate) {
      result = result.filter((d) => {
        const dDate = d.publishDate?.toDate
          ? d.publishDate.toDate()
          : new Date(d.publishDate);

        if (startDate && new Date(dDate) < startOfDay(new Date(startDate)))
          return false;
        if (endDate && new Date(dDate) > endOfDay(new Date(endDate)))
          return false;
        return true;
      });
    }

    // 4. Sort by Date Descending
    result.sort((a, b) => {
      const dateA = a.publishDate?.toDate
        ? a.publishDate.toDate()
        : new Date(a.publishDate);
      const dateB = b.publishDate?.toDate
        ? b.publishDate.toDate()
        : new Date(b.publishDate);
      return dateB - dateA; // Descending
    });

    return result;
  }, [devotions, filter, searchQuery, startDate, endDate]);

  const totalPages = Math.ceil(processedDevotions.length / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const paginatedDevotions = processedDevotions.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage,
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls: Search & Date Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title or verse..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-11 pr-4 py-3 border border-gray-50 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
          />
        </div>

        {/* Date Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <Filter size={18} className="hidden sm:block" />
            <span className="sm:hidden">Filter by Date:</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full sm:w-auto text-gray-600"
            />
            <span className="text-gray-400 font-medium">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full sm:w-auto text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit overflow-x-auto max-w-full">
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
            filter === "all"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          All ({devotions.length})
        </button>
        <button
          onClick={() => handleFilterChange("published")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
            filter === "published"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          Published ({devotions.filter((d) => d.isPublished).length})
        </button>
        <button
          onClick={() => handleFilterChange("unpublished")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
            filter === "unpublished"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          Unpublished ({devotions.filter((d) => !d.isPublished).length})
        </button>
      </div>

      {/* Table */}
      {paginatedDevotions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
          <BookOpen size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-600 font-bold mb-2">No devotions found</p>
          <p className="text-gray-500 text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden w-full max-w-[calc(100vw-2rem)] sm:max-w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Title & Verse
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedDevotions.map((devotion) => {
                  const devotionDate = devotion.publishDate?.toDate
                    ? devotion.publishDate.toDate()
                    : new Date(devotion.publishDate);

                  return (
                    <tr
                      key={devotion.id}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Calendar
                            size={16}
                            className="text-indigo-400 group-hover:text-indigo-600 transition-colors"
                          />
                          {format(devotionDate, "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                          {devotion.title}
                        </div>
                        <div className="text-xs font-medium text-indigo-600 line-clamp-1 bg-indigo-50 inline-block px-2.5 py-1 rounded-md">
                          {devotion.bibleVerse}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            onTogglePublish(devotion.id, !devotion.isPublished)
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            devotion.isPublished
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white rounded-3xl shadow-sm mt-6">
          <div className="text-sm text-gray-500 font-medium text-center sm:text-left">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {(validCurrentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-900">
              {Math.min(
                validCurrentPage * itemsPerPage,
                processedDevotions.length,
              )}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-900">
              {processedDevotions.length}
            </span>{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage === 1}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                    validCurrentPage === i + 1
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="sm:hidden text-sm font-bold text-gray-700 px-4">
              {validCurrentPage} / {totalPages}
            </div>

            <button
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevotionTable;
