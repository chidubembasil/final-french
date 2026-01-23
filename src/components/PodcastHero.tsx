import { Headphones, ArrowRight, Play, Pause, Volume2, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PodcastHero() {
    const [latestPodcast, setLatestPodcast] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const navigate = useNavigate();
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

    // 1. Fetch ONLY the most recent audio upload
    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const params = new URLSearchParams({
                    "filters[mediaType][$eq]": "audio",
                    "sort[0]": "createdAt:desc", // Forces Strapi to give the newest first
                    "pagination[limit]": "1",
                    "populate": "*" 
                });

                const res = await fetch(`${CLIENT_KEY}api/podcasts?${params.toString()}`);
                const json = await res.json();
                const data = json.data || [];
                
                if (data.length > 0) {
                    const item = data[0];
                    setLatestPodcast({
                        id: item.id,
                        ...(item.attributes || item)
                    });
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatest();
    }, [CLIENT_KEY]);

    // 2. Resolve URL
    const audioUrl = (() => {
        if (!latestPodcast) return "";
        const raw = latestPodcast.audioUrl || latestPodcast.file?.data?.attributes?.url || latestPodcast.file?.url;
        if (!raw) return "";
        return raw.startsWith('http') ? raw : `${CLIENT_KEY.replace(/\/$/, '')}${raw.startsWith('/') ? '' : '/'}${raw}`;
    })();

    // 3. Play/Pause Logic
    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio || !audioUrl) return;

        if (audio.src !== audioUrl) {
            audio.src = audioUrl;
            audio.load();
        }

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(console.error);
        }
    };

    if (isLoading) return (
        <div className="w-full py-24 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
    );

    return (
        <main className="w-full py-16 flex flex-col items-center bg-white">
            <audio 
                ref={audioRef} 
                crossOrigin="anonymous"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="flex flex-col items-center gap-3 mb-10">
                <span className='px-4 py-1 rounded-full flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold uppercase'>
                    <Headphones size={14}/> Freshly Uploaded
                </span>
                <h2 className='font-serif text-4xl font-bold text-center text-slate-900'>Latest Podcast</h2>
                <div className='w-24 h-1 bg-blue-600'></div>
            </div>

            <div className="w-[90%] max-w-6xl mb-12">
                {latestPodcast ? (
                    <div className="relative w-full rounded-[2.5rem] p-8 md:p-12 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-red-600 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                        <div className="flex-1 space-y-4">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                                {isPlaying ? 'Now Playing' : 'New Release'}
                            </span>
                            <h3 className="text-3xl md:text-5xl font-bold leading-tight">{latestPodcast.title}</h3>
                            <p className="text-white/80 italic">Hosted by {latestPodcast.author || 'Guest'}</p>
                            
                            {isPlaying && (
                                <div className="flex items-center gap-3 text-white/70">
                                    <Volume2 size={20} className="animate-bounce" />
                                    <span className="text-xs font-bold uppercase tracking-tighter">Live Audio Session</span>
                                </div>
                            )}
                        </div>

                        <div 
                            onClick={togglePlay}
                            className="w-64 h-64 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all group"
                        >
                            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                {isPlaying ? <Pause fill="white" size={40} /> : <Play fill="white" size={40} className="ml-2" />}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-[2.5rem] text-gray-400">No recent podcasts found.</div>
                )}
            </div>

            <button 
                onClick={() => navigate('/podcast')}
                className='text-white bg-slate-900 px-10 py-4 rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all font-bold shadow-xl'
            >
                View Full Library <ArrowRight size={20}/>
            </button>
        </main>
    );
}