import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import DevotionView from "../components/devotion/DevotionView";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import useDevotions from "../hooks/useDevotions";
import { ArrowLeft, BookOpen } from "lucide-react";

/**
 * DevotionPage component
 * Displays a single devotion by ID
 */
const DevotionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [devotion, setDevotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getDevotionById } = useDevotions();

  useEffect(() => {
    loadDevotion();
  }, [id]);

  const loadDevotion = async () => {
    try {
      setLoading(true);
      setError(null);
      const devotionData = await getDevotionById(id);

      if (!devotionData) {
        setError("Devotion not found");
      } else if (!devotionData.isPublished) {
        setError("This devotion is not yet published");
      } else {
        setDevotion(devotionData);
      }
    } catch (err) {
      console.error("Error loading devotion:", err);
      setError("Failed to load devotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/archive"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-smooth mb-8 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 py-1"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Archive</span>
        </Link>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <BookOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {error}
            </h3>
            <p className="text-gray-600 mb-6">
              The devotion you're looking for couldn't be found.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-smooth"
              >
                Go to Home
              </button>
              <button
                onClick={() => navigate("/archive")}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-primary hover:text-primary transition-smooth"
              >
                Browse Archive
              </button>
            </div>
          </div>
        ) : devotion ? (
          <DevotionView devotion={devotion} />
        ) : null}
      </section>
    </Layout>
  );
};

export default DevotionPage;
