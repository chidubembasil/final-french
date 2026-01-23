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
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

    useEffect(() => {
        const fetchLatestPodcast = async () => {
            setIsLoading(true);
            try {
                // Fetching specifically the newest audio-type podcast
                const res = await fetch(
                    `${CLIENT_KEY}api/podcasts?` +
                    `filters[mediaType][$eq]=audio&` +
                    `sort[0]=publishedAt:desc&` + // Uses publication date for "recent"
                    `pagination[limit]=1&` +
                    `populate=*` 
                );

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                
                const rawData = data?.data || [];
                if (rawData.length > 0) {
                    const item = rawData[0];
                    setLatestPodcast({
                        id: item.id,
                        ...(item.attributes || item)
                    });
                }
            } catch (err) {
                console.error("Latest podcast fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestPodcast();
    }, [CLIENT_KEY]);

    const getAudioUrl = (podcast: any) => {
        if (!podcast) return "";
        
        // Deep check for Strapi media fields
        const fileData = podcast.file?.data?.attributes || podcast.file || podcast.media?.data?.attributes;
        const url = podcast.audioUrl || fileData?.url || "";
        
        if (!url) return "";
        if (url.startsWith('http')) return url;
        
        // Clean up double slashes if CLIENT_KEY ends with one
        const baseUrl = CLIENT_KEY.endsWith('/') ? CLIENT_KEY.slice(0, -1) : CLIENT_KEY;
        const path = url.startsWith('/') ? url : `/${url}`;
        
        return `${baseUrl}${path}`;
    };

    const togglePlay = (podcast: any) => {
        if (!podcast || !audioRef.current) return;
        const audio = audioRef.current;
        const audioSrc = getAudioUrl(podcast);

        if (!audioSrc) {
            console.error("No valid audio source found for this podcast.");
            return;
        }

        if (currentPlaying?.id === podcast.id) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(err => console.error("Playback failed:", err));
            }
            return;
        }

        // Switching to a new podcast
        audio.pause();
        audio.src = audioSrc;
        setCurrentPlaying(podcast);
        audio.load();
        
        // Play after load
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => console.error("Auto-play failed:", err));
        }
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
                <span className='px-4 py-1 rounded-full flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold uppercase'>
                    <Headphones size={14}/> Listen to learners and teachers
                </span>
                <h2 className='font-serif text-4xl font-bold text-center text-slate-900'>Featured Podcast</h2>
                <div className='w-24 h-1 bg-blue-600'></div>
            </div>

            <div className="w-[90%] max-w-6xl mb-12">
                {isLoading ? (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-[2.5rem]">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                    </div>
                ) : latestPodcast ? (
                    <div className="relative w-full rounded-[2.5rem] p-8 md:p-12 mb-8 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-[#E31E24] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                        {/* Content Area */}
                        <div className="flex-1 space-y-5 z-10">
                            <div className="flex items-center gap-3">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                    {isPlaying && currentPlaying?.id === latestPodcast.id ? 'Now Playing' : 'Latest Episode'}
                                </span>
                                {isPlaying && currentPlaying?.id === latestPodcast.id && (
                                     <div className="flex gap-1 items-end h-3">
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.1s] h-full"></div>
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.3s] h-2"></div>
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.2s] h-3"></div>
                                     </div>
                                )}
                            </div>
                            
                            <h3 className="text-3xl md:text-5xl font-bold leading-tight">{latestPodcast.title}</h3>
                            <p className="text-white/80 font-medium text-lg italic">Hosted by {latestPodcast.author || 'French Institute'}</p>
                            
                            <div className="flex items-center gap-4 pt-4">
                                <div className="p-3 bg-white/10 rounded-full">
                                    <Volume2 size={20} className={isPlaying ? "text-white animate-pulse" : "text-white/40"} />
                                </div>
                                <span className="text-sm font-medium text-white/70">
                                    {isPlaying ? "Broadcasting live..." : "Click play to start listening"}
                                </span>
                            </div>
                        </div>

                        {/* Play Button Area */}
                        <div 
                            onClick={() => togglePlay(latestPodcast)}
                            className="w-full md:w-[400px] bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-10 flex items-center justify-center aspect-square md:aspect-video relative group cursor-pointer transition-all duration-500"
                        >
                            <div className="w-24 h-24 bg-white text-blue-900 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                                {isPlaying && currentPlaying?.id === latestPodcast.id ? (
                                    <Pause fill="currentColor" size={40} />
                                ) : (
                                    <Play fill="currentColor" size={40} className="ml-2" />
                                )}
                            </div>
                        </div>

                        {/* Decorative Background Element */}
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No podcasts available at the moment.</p>
                    </div>
                )}
            </div>

            <button 
                onClick={() => navigate('/podcast')}
                className='group text-white bg-[#E31E24] px-10 py-4 rounded-2xl flex items-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-200 font-bold'
            >
                Browse All Podcasts 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
        </main>
    );
}