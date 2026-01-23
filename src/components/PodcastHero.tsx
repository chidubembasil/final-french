import { Headphones, ArrowRight, Play, Pause, Volume2, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PodcastHero() {
  const [latestPodcast, setLatestPodcast] = useState<any>(null);
  const [currentPlaying, setCurrentPlaying] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || '';

  const BASE_URL = CLIENT_KEY.endsWith('/')
    ? CLIENT_KEY.slice(0, -1)
    : CLIENT_KEY;

  useEffect(() => {
    const fetchAndProcessManually = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch all podcasts from the API
        const res = await fetch(`${BASE_URL}/api/podcasts?populate=*`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const json = await res.json();
        const allItems = json.data || [];

        // 2. Filter: Only include items where mediaType is "audio"
        const audioItems = allItems.filter((item: any) => {
          const attr = item.attributes || item;
          return attr.mediaType === 'audio';
        });

        if (audioItems.length > 0) {
          // 3. Logic: Sort by date to find the "lowest difference" from now
          // (Essentially finding the highest timestamp)
          const sorted = audioItems.sort((a: any, b: any) => {
            const dateA = new Date(a.attributes?.createdAt || a.createdAt).getTime();
            const dateB = new Date(b.attributes?.createdAt || b.createdAt).getTime();
            return dateB - dateA; // Newest first
          });

          const winner = sorted[0];
          setLatestPodcast({
            id: winner.id,
            ...(winner.attributes || winner),
          });
        }
      } catch (err) {
        console.error('Manual fetch/logic error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessManually();
  }, [BASE_URL]);

  const getAudioUrl = (podcast: any) => {
    if (!podcast) return '';
    const fileData =
      podcast.file?.data?.attributes ||
      podcast.media?.data?.attributes ||
      podcast.file;

    const url = podcast.audioUrl || fileData?.url || '';
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  };

  const togglePlay = (podcast: any) => {
    if (!podcast || !audioRef.current) return;
    const audio = audioRef.current;
    const audioSrc = getAudioUrl(podcast);

    if (!audioSrc) return;

    if (currentPlaying?.id === podcast.id) {
      isPlaying ? audio.pause() : audio.play().catch(console.error);
      return;
    }

    audio.pause();
    audio.src = audioSrc;
    setCurrentPlaying(podcast);
    audio.load();
    audio.play().catch(console.error);
  };

  // Helper to show how recent the podcast is
  const getTimeAgo = (dateString: string) => {
    const postDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffInDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  return (
    <main className="w-full py-16 flex flex-col items-center bg-white">
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <div className="flex flex-col items-center gap-3 mb-10">
        <span className="px-4 py-1 rounded-full flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold uppercase">
          <Headphones size={14} /> Global French Learning
        </span>
        <h2 className="font-serif text-4xl font-bold text-center text-slate-900">
          Featured Podcast
        </h2>
        <div className="w-24 h-1 bg-blue-600"></div>
      </div>

      

      <div className="w-[90%] max-w-6xl mb-12">
        {isLoading ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-[2.5rem]">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : latestPodcast ? (
          <div className="relative w-full rounded-[2.5rem] p-8 md:p-12 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-[#E31E24] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
            <div className="flex-1 space-y-5 z-10">
              <div className="flex gap-2 items-center">
                <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                  {isPlaying && currentPlaying?.id === latestPodcast.id ? 'Now Playing' : 'Latest Episode'}
                </span>
                <span className="text-[10px] text-white/60 uppercase font-bold">
                  • {getTimeAgo(latestPodcast.createdAt)}
                </span>
              </div>

              <h3 className="text-3xl md:text-5xl font-bold">
                {latestPodcast.title}
              </h3>

              <p className="text-white/80 italic">
                Hosted by {latestPodcast.author || 'French Institute'}
              </p>

              <div className="flex items-center gap-4 pt-4">
                <Volume2 size={20} className={isPlaying ? 'animate-pulse' : 'opacity-40'} />
                <span className="text-sm">
                  {isPlaying ? 'Broadcasting…' : 'Click play to listen'}
                </span>
              </div>
            </div>

            <div
              onClick={() => togglePlay(latestPodcast)}
              className="w-full md:w-[400px] bg-white/10 rounded-[2rem] p-10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition"
            >
              <div className="w-24 h-24 bg-white text-blue-900 rounded-full flex items-center justify-center shadow-xl">
                {isPlaying && currentPlaying?.id === latestPodcast.id ? (
                  <Pause size={40} />
                ) : (
                  <Play size={40} className="ml-2" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-gray-400 text-center">No podcasts found in the library.</div>
        )}
      </div>

      <button
        onClick={() => navigate('/podcast')}
        className="bg-[#E31E24] text-white px-10 py-4 rounded-2xl flex items-center gap-3 hover:bg-red-700 transition font-bold"
      >
        Browse All Podcasts
        <ArrowRight size={20} />
      </button>
    </main>
  );
}