import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import DevotionGallery from "../components/devotion/DevotionGallery";
import useDevotions from "../hooks/useDevotions";
import { BookOpen } from "lucide-react";

/**
 * ArchivePage component
 * Displays a gallery of all published devotions
 */
const ArchivePage = () => {
  const [devotions, setDevotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getPublishedDevotions } = useDevotions();

  useEffect(() => {
    loadDevotions();
  }, []);

  const loadDevotions = async () => {
    try {
      setLoading(true);
      // Load more devotions for archive (50 items)
      const publishedDevotions = await getPublishedDevotions(50);
      setDevotions(publishedDevotions);
    } catch (error) {
      console.error("Error loading devotions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="relative min-h-[400px] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-bg.png"
            alt="Spiritual background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/90 via-purple-900/80 to-indigo-900/90 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 py-12">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-2">
            <BookOpen size={32} className="text-white drop-shadow-md" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
            Devotion Archive
          </h1>

          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
            Browse past devotions and revisit God's word. A treasury of
            spiritual wisdom at your fingertips.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DevotionGallery devotions={devotions} loading={loading} />
      </section>
    </Layout>
  );
};

export default ArchivePage;
