import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Save, X, Calendar } from "lucide-react";
import LoadingSpinner from "../shared/LoadingSpinner";

/**
 * DevotionForm component
 * Form for creating and editing devotions
 *
 * @param {Object} props - Component props
 * @param {Object} props.devotion - Existing devotion data (for edit mode)
 * @param {Function} props.onSave - Save callback
 * @param {Function} props.onCancel - Cancel callback
 * @param {boolean} props.loading - Loading state
 */
const DevotionForm = ({
  devotion = null,
  onSave,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    bibleVerse: "",
    content: "",
    excerpt: "",
    publishDate: format(new Date(), "yyyy-MM-dd"),
    isPublished: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (devotion) {
      const devotionDate = devotion.publishDate?.toDate
        ? devotion.publishDate.toDate()
        : new Date(devotion.publishDate);

      setFormData({
        title: devotion.title || "",
        bibleVerse: devotion.bibleVerse || "",
        content: devotion.content || "",
        excerpt: devotion.excerpt || "",
        publishDate: format(devotionDate, "yyyy-MM-dd"),
        isPublished: devotion.isPublished || false,
      });
    }
  }, [devotion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.bibleVerse.trim()) {
      newErrors.bibleVerse = "Bible verse is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.publishDate) {
      newErrors.publishDate = "Publish date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert date string to Date object
    const dataToSave = {
      ...formData,
      publishDate: new Date(formData.publishDate),
      excerpt: formData.excerpt || formData.content.substring(0, 150),
    };

    onSave(dataToSave);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-xl border-0 p-4 md:p-8 relative overflow-hidden w-full max-w-full"
    >
      <div className="space-y-6 md:space-y-8 relative z-10 w-full">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-bold text-gray-700 mb-2 ml-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={`block w-full px-5 py-3.5 bg-gray-50 border-1 border-gray-400 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-lg ${
              errors.title
                ? "border-red-100 focus:border-red-500"
                : "border-gray-200 focus:border-indigo-500"
            }`}
            placeholder="Enter devotion title"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-500 font-medium ml-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {errors.title}
            </p>
          )}
        </div>

        {/* Bible Verse */}
        <div>
          <label
            htmlFor="bibleVerse"
            className="block text-sm font-bold text-gray-700 mb-2 ml-1"
          >
            Bible Verse Reference <span className="text-red-500">*</span>
          </label>
          <input
            id="bibleVerse"
            name="bibleVerse"
            type="text"
            value={formData.bibleVerse}
            onChange={handleChange}
            className={`block w-full px-5 py-3.5 bg-gray-50 border-1 border-gray-400 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium ${
              errors.bibleVerse
                ? "border-red-100 focus:border-red-500"
                : "border-gray-200 focus:border-indigo-500"
            }`}
            placeholder="e.g., John 3:16"
          />
          {errors.bibleVerse && (
            <p className="mt-2 text-sm text-red-500 font-medium ml-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {errors.bibleVerse}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-bold text-gray-700 mb-2 ml-1"
          >
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            className={`block w-full px-5 py-4 bg-gray-50 border-1 border-gray-400 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all leading-relaxed ${
              errors.content
                ? "border-red-100 focus:border-red-500"
                : "border-gray-200 focus:border-indigo-500"
            }`}
            placeholder="Enter the full devotion content..."
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-500 font-medium ml-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {errors.content}
            </p>
          )}
          <p className="mt-2 text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">
            Separate paragraphs with line breaks
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-bold text-gray-700 mb-2 ml-1"
          >
            Excerpt (Optional)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="block w-full px-5 py-3.5 bg-gray-50 border-1 border-gray-400 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            placeholder="Brief summary for preview (will be auto-generated if left empty)"
          />
          <p className="mt-2 text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">
            {formData.excerpt.length}/150 characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Publish Date */}
          <div>
            <label
              htmlFor="publishDate"
              className="block text-sm font-bold text-gray-700 mb-2 ml-1"
            >
              Publish Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <input
                id="publishDate"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleChange}
                className={`block w-full pl-11 pr-5 py-3.5 bg-gray-50 border-1 border-gray-400 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium ${
                  errors.publishDate
                    ? "border-red-100 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-500"
                }`}
              />
            </div>
            {errors.publishDate && (
              <p className="mt-2 text-sm text-red-500 font-medium ml-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {errors.publishDate}
              </p>
            )}
          </div>

          {/* Publish Toggle */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Visibility Status
            </label>
            <div
              className={`flex items-center gap-4 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                formData.isPublished
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-transparent hover:bg-gray-100"
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  isPublished: !prev.isPublished,
                }))
              }
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center border-1 border-gray-400 transition-colors ${
                  formData.isPublished
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {formData.isPublished && (
                  <Save size={14} className="text-white" />
                )}
              </div>

              <div>
                <span
                  className={`block text-sm font-bold ${
                    formData.isPublished ? "text-green-800" : "text-gray-700"
                  }`}
                >
                  {formData.isPublished
                    ? "Published Immediately"
                    : "Save as Draft"}
                </span>
                <span className="text-xs text-gray-500">
                  {formData.isPublished
                    ? "Visible to all users"
                    : "Hidden from public view"}
                </span>
              </div>

              {/* Hidden Checkbox for form logic compatibility if needed */}
              <input
                id="isPublished"
                name="isPublished"
                type="checkbox"
                checked={formData.isPublished}
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-8 mt-4 border-t border-gray-400">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>{devotion ? "Update" : "Create"} Devotion</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-white text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:text-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default DevotionForm;
