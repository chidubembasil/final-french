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
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || '';

  useEffect(() => {
    const fetchLatestThree = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${CLIENT_KEY}api/podcasts?populate=*`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const json = await res.json();
        const allItems = json.data || [];

        // Manual Sort: Newest first
        const sorted = allItems.sort((a: any, b: any) => {
          const dateA = new Date(a.attributes?.createdAt || a.createdAt).getTime();
          const dateB = new Date(b.attributes?.createdAt || b.createdAt).getTime();
          return dateB - dateA; 
        });

        const lastThree = sorted.slice(0, 3).map((item: any) => ({
          id: item.id,
          ...(item.attributes || item),
        }));

        setFeaturedItems(lastThree);
      } catch (err) {
        console.error('Logic error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestThree();
  }, [CLIENT_KEY]);

  const getMediaUrl = (item: any) => {
    if (!item) return '';
    const fileData = item.file?.data?.attributes || item.media?.data?.attributes || item.file;
    const url = item.audioUrl || item.videoUrl || fileData?.url || '';
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${CLIENT_KEY}${url.startsWith('/') ? url.slice(1) : url}`;
  };

  const handleToggle = (item: any) => {
    // If clicking a different item, stop everything first
    if (currentPlaying?.id !== item.id) {
      audioRef.current?.pause();
      if (videoRef.current) videoRef.current.pause();
      
      setCurrentPlaying(item);
      setIsPlaying(true);
      return;
    }

    // Toggle logic for the same item
    if (item.mediaType === 'video' && videoRef.current) {
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    } else if (audioRef.current) {
      audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="w-full py-16 flex flex-col items-center bg-white">
      <audio 
        ref={audioRef} 
        src={currentPlaying?.mediaType !== 'video' ? getMediaUrl(currentPlaying) : ''}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay
      />

      <div className="flex flex-col items-center gap-3 mb-10 text-center">
        <span className="px-4 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest">
          Newest Additions
        </span>
        <h2 className="font-serif text-4xl font-bold text-slate-900">Multimedia Archive</h2>
        <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
      </div>

      <div className="w-[90%] max-w-5xl flex flex-col gap-8">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : featuredItems.map((item) => {
          const isThisPlaying = currentPlaying?.id === item.id;
          const isVideo = item.mediaType === 'video';

          return (
            <div key={item.id} className="group relative bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row items-stretch">
                
                <div className="w-full md:w-72 bg-slate-900 flex items-center justify-center relative min-h-[200px]">
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
                    <div className="flex flex-col items-center gap-3 text-white/40">
                      {isVideo ? <Video size={48} /> : <Headphones size={48} />}
                    </div>
                  )}
                  
                  {(!isThisPlaying || (!isVideo && isThisPlaying)) && (
                    <button 
                      onClick={() => handleToggle(item)}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                        {isThisPlaying && isPlaying ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
                      </div>
                    </button>
                  )}
                </div>

                <div className="flex-1 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded">
                      {item.mediaType}
                    </span>
                    {isThisPlaying && isPlaying && (
                      <div className="flex items-center gap-1 text-red-600 text-xs font-bold">
                        <Volume2 size={14} className="animate-pulse" />
                        Live
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 italic">
                    By {item.author || 'Admin'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <button 
                      onClick={() => navigate(`/podcast/${item.slug || item.id}`)}
                      className="text-slate-900 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all underline underline-offset-4"
                    >
                      View Full Episode <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/podcast')}
        className="mt-12 bg-slate-900 text-white px-12 py-4 rounded-full font-bold hover:bg-blue-600 transition-colors shadow-lg"
      >
        View All Content
      </button>
    </main>
  );
}