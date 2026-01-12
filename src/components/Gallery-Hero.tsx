import { Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GalleryItem {
  id: string | number;
  mediaUrl: string; // Changed from imageUrl/image to match your Gallery page
  title: string;
  description: string;
}

export default function GalleryHero() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_ENV || '';

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${CLIENT_KEY}api/galleries`);

        if (!response.ok) throw new Error(`Failed to fetch`);

        const data = await response.json();
        // Match the data structure of your Gallery page
        const galleryItems = Array.isArray(data) ? data : data?.data || [];

        setItems(galleryItems.slice(0, 4));
      } catch (err) {
        console.error('Gallery Hero fetch error:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, [CLIENT_KEY]);

  return (
    <main className="w-full py-16 flex flex-col items-center bg-[#f9f7f4]">
      <div className="flex flex-col items-center gap-3 mb-12 text-center">
        <span className="px-4 py-1.5 rounded-full flex items-center gap-2 bg-blue-100 text-blue-600 text-sm font-medium">
          <Sparkles size={16} /> Visual documentation
        </span>
        <h2 className="font-serif text-4xl font-bold text-center">Gallery Highlights</h2>
        <div className="w-24 h-1 bg-blue-700 rounded-full"></div>
      </div>

      <div className="w-[90%] max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 rounded-[2rem] bg-gray-200 animate-pulse" />
          ))
        ) : items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/gallery')}
              className="group relative h-80 rounded-[2rem] overflow-hidden shadow-md bg-white border-4 border-white transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              <img
                src={item.mediaUrl} // Directly using mediaUrl as your Gallery page does
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-400">
            No highlights available.
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/gallery')}
        className="text-white bg-blue-700 px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-200"
      >
        View Full Gallery <ArrowRight size={18} />
      </button>
    </main>
  );
}