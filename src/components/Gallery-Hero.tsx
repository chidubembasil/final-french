import { Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GalleryItem {
  id?: string | number;
  _id?: string | number;
  imageUrl?: string;
  image?: string;
  title?: string;
  description?: string;
}

export default function GalleryHero() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || '';
  const baseUrl = CLIENT_KEY ? (CLIENT_KEY.endsWith('/') ? CLIENT_KEY : `${CLIENT_KEY}/`) : '/';

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        // Removed ?limit=4 to fetch all data
        const response = await fetch(`${baseUrl}api/galleries`);

        if (!response.ok) {
          throw new Error(`Failed to fetch galleries: ${response.status}`);
        }

        const data = await response.json();
        const galleryItems = Array.isArray(data) ? data : data?.data || [];

        // Use slice(0, 4) to only keep the first four items for the Hero display
        setItems(galleryItems.slice(0, 4));
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, [baseUrl]);

  const getFullImageUrl = (item: GalleryItem): string => {
    const rawPath = item?.imageUrl || item?.image;
    if (!rawPath) return 'https://via.placeholder.com/400x600?text=No+Image';
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) return rawPath;

    const cleanPath = rawPath.replace(/^\/+/, '');
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${cleanBase}${cleanPath}`;
  };

  return (
    <main className="w-full py-16 flex flex-col items-center bg-[#f9f7f4]">
      <div className="flex flex-col items-center gap-3 mb-12 text-center">
        <span className="px-4 py-1.5 rounded-full flex items-center gap-2 bg-blue-100 text-blue-600 text-sm font-medium">
          <Sparkles size={16} /> Visual documentation
        </span>
        <h2 className="font-serif text-4xl font-bold text-center">Gallery</h2>
        <div className="w-24 h-1 bg-blue-700 rounded-full"></div>
      </div>

      <div className="w-[90%] max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 rounded-[2rem] bg-gray-200 animate-pulse" />
          ))
        ) : items.length > 0 ? (
          items.map((item) => {
            const imageUrl = getFullImageUrl(item);
            return (
              <div
                key={item.id || item._id || Math.random()}
                onClick={() => navigate('/gallery')}
                className="group relative h-80 rounded-[2rem] overflow-hidden shadow-md bg-white border-4 border-white transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              >
                <img
                  src={imageUrl}
                  alt={item.title || 'Gallery Image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Image+Error';
                    e.currentTarget.onerror = null;
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-lg">
                    {item.title || 'Gallery Item'}
                  </h3>
                  <p className="text-gray-300 text-xs line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {item.description || 'View Details'}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 text-gray-400 italic">
            No gallery items available at the moment.
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