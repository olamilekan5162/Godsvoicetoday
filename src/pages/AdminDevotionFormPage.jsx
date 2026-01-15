import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import DevotionForm from "../components/admin/DevotionForm";
import useDevotions from "../hooks/useDevotions";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { ArrowLeft } from "lucide-react";

/**
 * AdminDevotionForm component
 * Page for creating and editing devotions
 */
const AdminDevotionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [devotion, setDevotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { getDevotionById, createDevotion, updateDevotion } = useDevotions();

  useEffect(() => {
    if (isEditMode) {
      loadDevotion();
    }
  }, [id]);

  const loadDevotion = async () => {
    try {
      setLoading(true);
      const devotionData = await getDevotionById(id);
      setDevotion(devotionData);
    } catch (error) {
      console.error("Error loading devotion:", error);
      alert("Failed to load devotion");
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);

      if (isEditMode) {
        await updateDevotion(id, formData);
      } else {
        await createDevotion(formData);
      }

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error saving devotion:", error);
      alert("Failed to save devotion. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/dashboard");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-smooth mb-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 py-1"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? "Edit Devotion" : "Create New Devotion"}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? "Update the devotion details below"
              : "Fill in the details to create a new devotion"}
          </p>
        </div>

        {/* Form */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <DevotionForm
            devotion={devotion}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={saving}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDevotionFormPage;
