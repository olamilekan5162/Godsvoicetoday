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
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8"
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={`block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter devotion title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Bible Verse */}
        <div>
          <label
            htmlFor="bibleVerse"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Bible Verse Reference <span className="text-red-500">*</span>
          </label>
          <input
            id="bibleVerse"
            name="bibleVerse"
            type="text"
            value={formData.bibleVerse}
            onChange={handleChange}
            className={`block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.bibleVerse ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., John 3:16"
          />
          {errors.bibleVerse && (
            <p className="mt-1 text-sm text-red-600">{errors.bibleVerse}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            className={`block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter the full devotion content..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Separate paragraphs with line breaks
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Excerpt (Optional)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            placeholder="Brief summary for preview (auto-generated if left empty)"
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.excerpt.length}/150 characters
          </p>
        </div>

        {/* Publish Date */}
        <div>
          <label
            htmlFor="publishDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Publish Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              id="publishDate"
              name="publishDate"
              type="date"
              value={formData.publishDate}
              onChange={handleChange}
              className={`block w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                errors.publishDate ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.publishDate && (
            <p className="mt-1 text-sm text-red-600">{errors.publishDate}</p>
          )}
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            checked={formData.isPublished}
            onChange={handleChange}
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="isPublished"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Publish immediately (visible to users)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{devotion ? "Update" : "Create"} Devotion</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-smooth focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default DevotionForm;
