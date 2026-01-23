import { Headphones, Video, ArrowRight, Play, Pause, Volume2, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PodcastHero() {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  
  // Ensure the key doesn't cause a double slash or missing slash
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || '';
  const cleanUrl = CLIENT_KEY.endsWith('/') ? CLIENT_KEY : `${CLIENT_KEY}/`;

  useEffect(() => {
    const fetchLatestThree = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching from:", `${cleanUrl}api/podcasts?populate=*`);
        const res = await fetch(`${cleanUrl}api/podcasts?populate=*`);
        
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        
        const json = await res.json();
        console.log("API Response:", json); // Check your console to see the structure!

        // Strapi sometimes nests data under .data
        const allItems = json.data || [];

        // 1. Manual Sort: Absolute newest items first
        const sorted = [...allItems].sort((a: any, b: any) => {
          // Fallback check: handles both a.attributes.createdAt and a.createdAt
          const dateA = new Date(a.attributes?.createdAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.attributes?.createdAt || b.createdAt || 0).getTime();
          return dateB - dateA; 
        });

        // 2. Map and Slice
        const lastThree = sorted.slice(0, 3).map((item: any) => ({
          id: item.id,
          ...(item.attributes || item), // Flatten attributes if they exist
        }));

        setFeaturedItems(lastThree);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestThree();
  }, [cleanUrl]);

  const getMediaUrl = (item: any) => {
    if (!item) return '';
    // Check all possible nesting locations for the file URL
    const fileData = item.file?.data?.attributes || item.media?.data?.attributes || item.file?.attributes || item.file;
    const url = item.audioUrl || item.videoUrl || fileData?.url || '';
    
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${cleanUrl}${url.startsWith('/') ? url.slice(1) : url}`;
  };

  const handleToggle = (item: any) => {
    if (currentPlaying?.id !== item.id) {
      audioRef.current?.pause();
      if (videoRef.current) videoRef.current.pause();
      setCurrentPlaying(item);
      setIsPlaying(true);
      return;
    }

    if (item.mediaType === 'video' && videoRef.current) {
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    } else if (audioRef.current) {
      audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="w-full py-16 flex flex-col items-center bg-white min-h-[400px]">
      <audio 
        ref={audioRef} 
        src={currentPlaying?.mediaType !== 'video' ? getMediaUrl(currentPlaying) : ''}
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex flex-col items-center gap-3 mb-10 text-center">
        <span className="px-4 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-widest">
          Latest Releases
        </span>
        <h2 className="font-serif text-4xl font-bold text-slate-900">Featured Content</h2>
        <div className="w-24 h-1 bg-blue-600"></div>
      </div>

      <div className="w-[90%] max-w-6xl flex flex-col gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-400 animate-pulse font-medium">Connecting to library...</p>
          </div>
        ) : featuredItems.length > 0 ? (
          featuredItems.map((item) => {
            const isThisPlaying = currentPlaying?.id === item.id;
            const isVideo = item.mediaType === 'video' || item.mediaType === 'Video';

            return (
              <div 
                key={item.id} 
                className="relative w-full rounded-[2.5rem] p-8 md:p-12 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-[#E31E24] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl"
              >
                <div className="flex-1 space-y-5 z-10">
                  <div className="flex gap-2 items-center">
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                      {isVideo ? 'Video' : 'Audio'}
                    </span>
                    {isThisPlaying && isPlaying && (
                      <span className="flex items-center gap-1 text-xs font-bold text-white">
                        <Volume2 size={14} className="animate-pulse" /> Playing
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl md:text-5xl font-bold leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-white/80 italic">
                    By {item.author || 'French Institute'}
                  </p>

                  <button 
                    onClick={() => navigate(`/podcast/${item.slug || item.id}`)}
                    className="flex items-center gap-2 text-sm font-bold hover:underline"
                  >
                    View Details <ArrowRight size={16} />
                  </button>
                </div>

                <div className="w-full md:w-[450px] aspect-video md:aspect-square bg-white/10 rounded-[2rem] flex items-center justify-center overflow-hidden relative border border-white/5">
                  {isVideo && isThisPlaying ? (
                    <video 
                      ref={videoRef}
                      src={getMediaUrl(item)}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  ) : (
                    <button 
                      onClick={() => handleToggle(item)}
                      className="w-24 h-24 bg-white text-blue-900 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-20"
                    >
                      {isThisPlaying && isPlaying && !isVideo ? (
                        <Pause size={40} />
                      ) : (
                        <Play size={40} className="ml-2" />
                      )}
                    </button>
                  )}

                  <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full">
                    {isVideo ? <Video size={20} /> : <Headphones size={20} />}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-gray-400 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
            No items found. Please check if your Strapi items have the correct permissions.
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/podcast')}
        className="mt-12 bg-slate-900 text-white px-10 py-4 rounded-2xl flex items-center gap-3 hover:bg-blue-600 transition font-bold"
      >
        Browse Full Archive
        <ArrowRight size={20} />
      </button>
    </main>
  );
}