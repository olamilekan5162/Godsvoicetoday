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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg border-0 p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Total Devotions
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {totalDevotions}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md text-white">
                <BookOpen size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-0 p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Published
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {publishedCount}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md text-white">
                <Eye size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-0 p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-100 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Unpublished
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {unpublishedCount}
                </p>
              </div>
              <div className="p-4 bg-gray-200 rounded-xl text-gray-600">
                <EyeOff size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Create New Button */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => navigate("/admin/devotion/new")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
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
