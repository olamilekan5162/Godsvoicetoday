import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import DevotionTable from "../components/admin/DevotionTable";
import useDevotions from "../hooks/useDevotions";
import { PlusCircle, BookOpen, Eye, EyeOff } from "lucide-react";

/**
 * AdminDashboard component
 * Main admin dashboard with devotion management
 */
const AdminDashboard = () => {
  const [devotions, setDevotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { subscribeToAllDevotions, deleteDevotion, togglePublishStatus } =
    useDevotions();

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToAllDevotions((updatedDevotions) => {
      setDevotions(updatedDevotions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (devotion) => {
    navigate(`/admin/devotion/edit/${devotion.id}`);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this devotion? This action cannot be undone."
      )
    ) {
      try {
        await deleteDevotion(id);
      } catch (error) {
        console.error("Error deleting devotion:", error);
        alert("Failed to delete devotion. Please try again.");
      }
    }
  };

  const handleTogglePublish = async (id, isPublished) => {
    try {
      await togglePublishStatus(id, isPublished);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update publish status. Please try again.");
    }
  };

  // Calculate statistics
  const totalDevotions = devotions.length;
  const publishedCount = devotions.filter((d) => d.isPublished).length;
  const unpublishedCount = totalDevotions - publishedCount;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your daily devotions</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Devotions
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalDevotions}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BookOpen size={24} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Published
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {publishedCount}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Unpublished
                </p>
                <p className="text-3xl font-bold text-gray-600">
                  {unpublishedCount}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <EyeOff size={24} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Create New Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/devotion/new")}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <PlusCircle size={20} />
            <span>Create New Devotion</span>
          </button>
        </div>

        {/* Devotions Table */}
        <DevotionTable
          devotions={devotions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
