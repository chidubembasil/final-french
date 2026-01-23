import { Headphones, ArrowRight, Play, Pause, Volume2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PodcastHero() {
    const [latestPodcast, setLatestPodcast] = useState<any>(null);
    const [currentPlaying, setCurrentPlaying] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const navigate = useNavigate();
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

    useEffect(() => {
        const fetchLatestPodcast = async () => {
            try {
                // Sort by createdAt (or publishedAt/date) descending → newest first
                // filters[mediaType][$eq]=audio ensures only audio podcasts
                const res = await fetch(
                    `${CLIENT_KEY}api/podcasts?` +
                    `filters[mediaType][$eq]=audio&` +
                    `sort=createdAt:desc&` +          // ← key change: sort newest first
                    `pagination[limit]=1`             // ← only get the latest one
                );

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                
                const rawData = Array.isArray(data) ? data : (data?.data || []);
                const formatted = rawData.map((item: any) => ({
                    id: item.id,
                    ...(item.attributes || item)
                }));

                // Take the first (newest) item — or null if empty
                setLatestPodcast(formatted[0] || null);

            } catch (err) {
                console.error("Latest podcast fetch error:", err);
                setLatestPodcast(null);
            }
        };

        fetchLatestPodcast();
    }, [CLIENT_KEY]);

    const getAudioUrl = (podcast: any) => {
        if (!podcast) return "";

        let url = podcast.audioUrl;

        if (!url) url = podcast.file?.url || podcast.media?.url || podcast.url || "";

        if (!url) return "";

        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        const base = CLIENT_KEY.replace(/\/$/, '');
        return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const togglePlay = (podcast: any) => {
        if (!podcast) return;

        const audioSrc = getAudioUrl(podcast);
        console.log("Trying to play podcast:", {
            title: podcast.title,
            audioSrc,
            currentPlayingId: currentPlaying?.id,
            isPlaying
        });

        if (!audioSrc) {
            console.warn("No valid audio URL found for:", podcast.title);
            return;
        }

        const audio = audioRef.current;
        if (!audio) return;

        if (currentPlaying?.id === podcast.id) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(err => {
                    console.error("Resume play failed:", err);
                });
            }
            return;
        }

        audio.pause();
        audio.currentTime = 0;
        audio.src = audioSrc;
        audio.load();

        setCurrentPlaying(podcast);

        audio.play()
            .then(() => {
                setIsPlaying(true);
                console.log("Playback started successfully");
            })
            .catch(err => {
                console.error("Playback failed:", err.name, err.message);
                if (err.name === "NotAllowedError") {
                    console.warn("Autoplay/interaction blocked by browser");
                } else if (err.message.includes("CORS")) {
                    console.warn("CORS issue detected — check server headers for audio file");
                }
            });
    };

    // We now only use latestPodcast (no array slicing needed)
    const featured = latestPodcast;

    return (
        <main className="w-full py-16 flex flex-col items-center bg-white">
            <audio 
                ref={audioRef} 
                preload="auto"
                crossOrigin="anonymous"
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onError={(e) => console.error("Audio element error:", e)}
            />

            <div className="flex flex-col items-center gap-3 mb-10">
                <span className='px-4 py-1 rounded-full flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold uppercase'>
                    <Headphones size={14}/> Listen to learners and teachers
                </span>
                <h2 className='font-serif text-4xl font-bold text-center'>Featured Podcast</h2>
                <div className='w-24 h-1 bg-blue-600'></div>
            </div>

            <div className="w-[90%] max-w-6xl mb-12">
                {featured && (
                    <div className="relative w-full rounded-[2.5rem] p-8 md:p-12 mb-8 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-red-600 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                        <div className="flex-1 space-y-4">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase">
                                {isPlaying && currentPlaying?.id === featured.id ? 'Now Playing' : 'Latest Episode'}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-bold">{featured.title}</h3>
                            <p className="opacity-80">Hosted by {featured.author || 'Unknown Host'}</p>
                            
                            {currentPlaying?.id === featured.id && isPlaying && (
                                <div className="flex items-center gap-3 text-white/60">
                                    <Volume2 size={16} className="animate-pulse" />
                                    <span className="text-xs font-medium">Playing on this page</span>
                                </div>
                            )}
                        </div>

                        <div 
                            onClick={() => togglePlay(featured)}
                            className="w-full md:w-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex items-center justify-center aspect-video relative group cursor-pointer"
                        >
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                {isPlaying && currentPlaying?.id === featured.id ? (
                                    <Pause fill="white" color="white" size={34} />
                                ) : (
                                    <Play fill="white" color="white" size={34} />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Removed the grid of additional podcasts as requested */}
            </div>

            <button 
                onClick={() => navigate('/podcast')}
                className='text-white bg-red-600 px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200'
            >
                Browse All Podcasts <ArrowRight size={18}/>
            </button>
        </main>
    );
}