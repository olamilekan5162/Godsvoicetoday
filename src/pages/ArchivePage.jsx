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
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Devotion Archive
          </h1>
          <p className="text-xl text-indigo-100">
            Browse past devotions and revisit God's word
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
