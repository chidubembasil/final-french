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
                // Constructing the URL with precise sorting and filtering
                const params = new URLSearchParams();
                params.append("filters[mediaType][$eq]", "audio"); // Strictly audio
                params.append("sort[0]", "createdAt:desc");        // Most recent date first
                params.append("pagination[limit]", "1");           // Only get one
                params.append("populate", "*");                    // Get the file/media data

                const res = await fetch(`${CLIENT_KEY}api/podcasts?${params.toString()}`);

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                
                const rawData = Array.isArray(data) ? data : (data?.data || []);
                
                // Formatting the Strapi response
                const formatted = rawData.map((item: any) => ({
                    id: item.id,
                    ...(item.attributes || item)
                }));

                // The first item is now guaranteed to be the most recent audio
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

        // Strapi stores media in different paths depending on setup
        // This covers audioUrl string OR uploaded Media file object
        const fileUrl = podcast.audioUrl || 
                        podcast.file?.data?.attributes?.url || 
                        podcast.file?.url || 
                        podcast.media?.url;

        if (!fileUrl) return "";

        if (fileUrl.startsWith('http')) return fileUrl;

        const base = CLIENT_KEY.replace(/\/$/, '');
        return `${base}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
    };

    const togglePlay = (podcast: any) => {
        const audio = audioRef.current;
        if (!podcast || !audio) return;

        const audioSrc = getAudioUrl(podcast);
        if (!audioSrc) return;

        // Logic for same podcast (Toggle)
        if (currentPlaying?.id === podcast.id) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(err => console.error("Playback error:", err));
            }
            return;
        }

        // Logic for new podcast
        audio.pause();
        audio.src = audioSrc;
        audio.load(); // Reset buffer for new source
        setCurrentPlaying(podcast);
        audio.play().catch(err => console.error("Playback error:", err));
    };

    return (
        <main className="w-full py-16 flex flex-col items-center bg-white">
            <audio 
                ref={audioRef} 
                preload="metadata"
                crossOrigin="anonymous"
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />

            <div className="flex flex-col items-center gap-3 mb-10">
                <span className='px-4 py-1 rounded-full flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold uppercase'>
                    <Headphones size={14}/> Listen to learners and teachers
                </span>
                <h2 className='font-serif text-4xl font-bold text-center'>Featured Podcast</h2>
                <div className='w-24 h-1 bg-blue-600'></div>
            </div>

            <div className="w-[90%] max-w-6xl mb-12">
                {latestPodcast ? (
                    <div className="relative w-full rounded-[2.5rem] p-8 md:p-12 mb-8 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-red-600 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                        <div className="flex-1 space-y-4">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase">
                                {isPlaying && currentPlaying?.id === latestPodcast.id ? 'Now Playing' : 'Latest Episode'}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-bold">{latestPodcast.title}</h3>
                            <p className="opacity-80 font-medium italic">Hosted by {latestPodcast.author || 'Guest Speaker'}</p>
                            
                            {currentPlaying?.id === latestPodcast.id && isPlaying && (
                                <div className="flex items-center gap-3 text-white/60">
                                    <Volume2 size={16} className="animate-pulse" />
                                    <span className="text-xs font-medium tracking-wide">Audio is active</span>
                                </div>
                            )}
                        </div>

                        <div 
                            onClick={() => togglePlay(latestPodcast)}
                            className="w-full md:w-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex items-center justify-center aspect-video relative group cursor-pointer"
                        >
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                {isPlaying && currentPlaying?.id === latestPodcast.id ? (
                                    <Pause fill="white" color="white" size={34} />
                                ) : (
                                    <Play fill="white" color="white" size={34} className="ml-1" />
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                         <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Searching for latest audio...</p>
                    </div>
                )}
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