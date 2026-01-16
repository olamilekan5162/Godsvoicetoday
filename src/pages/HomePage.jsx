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
      <section className="relative min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-bg.png"
            alt="Spiritual background"
            className="w-full h-full object-cover animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-purple-900/60 to-indigo-900/80 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8 py-20">
          {/* Animated Icon */}
          <div className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-float">
            <BookOpen
              size={48}
              className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-xl">
            Welcome to <br />
            <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              God's Voice Today
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
            Hear what God is saying to you today. Daily wisdom, encouragement,
            and spiritual nourishment for your soul.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="group relative flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 rounded-full bg-white/50 blur-lg group-hover:blur-xl transition-all"></div>
              <span className="relative flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Browse by Date
              </span>
            </button>

            <button
              onClick={() => navigate("/archive")}
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
            >
              <span>View Archive</span>
              <BookOpen size={20} />
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
          <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-white rounded-3xl shadow-xl">
            <div className="inline-flex p-5 rounded-full bg-indigo-50 text-indigo-600 mb-6 shadow-sm">
              <BookOpen size={48} className="stroke-[1.5]" />
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Peace be with you
            </h3>

            <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
              There is no specific message for this date yet. Let's return to
              today's word for your daily nourishment.
            </p>

            <button
              onClick={loadTodaysDevotional}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Calendar size={20} />
              <span>View Today's Devotion</span>
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default HomePage;
