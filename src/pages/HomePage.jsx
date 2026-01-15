import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import DevotionView from "../components/devotion/DevotionView";
import DatePicker from "../components/shared/DatePicker";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import useDevotions from "../hooks/useDevotions";
import { BookOpen, Calendar } from "lucide-react";

/**
 * HomePage component
 * Displays today's devotion and allows date-based navigation
 */
const HomePage = () => {
  const [devotion, setDevotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { getTodaysDevotional, getDevotionByDate } = useDevotions();

  useEffect(() => {
    loadTodaysDevotional();
  }, []);

  const loadTodaysDevotional = async () => {
    try {
      setLoading(true);
      const todaysDevotion = await getTodaysDevotional();
      setDevotion(todaysDevotion);
    } catch (error) {
      console.error("Error loading today's devotion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (date) => {
    try {
      setLoading(true);
      setShowDatePicker(false);
      setSelectedDate(date);
      const devotionByDate = await getDevotionByDate(date);
      setDevotion(devotionByDate);
    } catch (error) {
      console.error("Error loading devotion by date:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Manna Daily
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8">
            Today's word for today's need
          </p>

          {/* Date Picker Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:scale-105 active:scale-95 transition-smooth focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              <Calendar size={20} />
              <span>Browse by Date</span>
            </button>

            <button
              onClick={() => navigate("/archive")}
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-smooth focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              View Archive
            </button>
          </div>
        </div>
      </section>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-smooth"
            >
              Close
            </button>
            <DatePicker
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        </div>
      )}

      {/* Devotion Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : devotion ? (
          <DevotionView devotion={devotion} />
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <BookOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No devotion available
            </h3>
            <p className="text-gray-600 mb-6">
              There's no devotion for this date yet.
            </p>
            <button
              onClick={loadTodaysDevotional}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-smooth"
            >
              View Today's Devotion
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default HomePage;
