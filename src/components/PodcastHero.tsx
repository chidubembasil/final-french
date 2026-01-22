import { Headphones, ArrowRight, Play, Pause, Volume2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PodcastHero() {
    const [podcasts, setPodcasts] = useState<any[]>([]);
    const [currentPlaying, setCurrentPlaying] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const navigate = useNavigate();
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

    useEffect(() => {
        // Using a cleaner fetch pattern
        const fetchPodcasts = async () => {
            try {
                const res = await fetch(`${CLIENT_KEY}api/podcasts?filters[mediaType][$eq]=audio&limit=4`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                
                // FIX 1: Ensure we extract the data correctly regardless of Strapi version
                const rawData = Array.isArray(data) ? data : (data?.data || []);
                const formattedData = rawData.map((item: any) => ({
                    id: item.id,
                    ...(item.attributes || item) // Flatten attributes if they exist
                }));
                
                setPodcasts(formattedData);
            } catch (err) {
                console.error("Podcast Hero fetch error:", err);
            }
        };
        fetchPodcasts();
    }, [CLIENT_KEY]);

    // FIX 2: Helper to get the correct URL
    const getAudioUrl = (podcast: any) => {
        if (!podcast) return "";
        const url = podcast.audioUrl || podcast.file;
        if (!url) return "";
        // If the URL is relative (starts with /), prefix it with the CLIENT_KEY
        return url.startsWith('http') ? url : `${CLIENT_KEY.replace(/\/$/, '')}${url}`;
    };

    const togglePlay = (podcast: any) => {
        const audioSrc = getAudioUrl(podcast);
        
        if (!audioSrc) {
            console.error("No valid audio source found for:", podcast.title);
            return;
        }

        if (currentPlaying?.id === podcast.id) {
            if (isPlaying) {
                audioRef.current?.pause();
            } else {
                audioRef.current?.play().catch(e => console.error("Playback error:", e));
            }
        } else {
            // New song selected
            if (audioRef.current) {
                setCurrentPlaying(podcast);
                audioRef.current.src = audioSrc;
                audioRef.current.load();
                // We use a timeout or the onCanPlay event usually, 
                // but play() returns a promise we can use:
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(err => console.error("Playback failed:", err));
            }
        }
    };

    const featured = podcasts.length > 0 ? podcasts[0] : null;

    return (
        <main className="w-full py-16 flex flex-col items-center bg-white">
            <audio 
                ref={audioRef} 
                onEnded={() => setIsPlaying(false)} 
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                preload="auto"
            />

            <div className="flex flex-col items-center gap-3 mb-10">
                <span className='px-4 py-1 rounded-full flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold uppercase'>
                    <Headphones size={14}/> Listen to learners and teachers
                </span>
                <h2 className='font-serif text-4xl font-bold text-center'>Featured Podcasts</h2>
                <div className='w-24 h-1 bg-blue-600'></div>
            </div>

            <div className="w-[90%] max-w-6xl mb-12">
                {featured && (
                    <div className="relative w-full rounded-[2.5rem] p-8 md:p-12 mb-8 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-red-600 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                        <div className="flex-1 space-y-4">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase">
                                {isPlaying && currentPlaying?.id === featured.id ? 'Now Playing' : 'Featured Episode'}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-bold">{featured.title}</h3>
                            <p className="opacity-80">Hosted by {featured.author}</p>
                            
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {podcasts.slice(1, 3).map((p: any) => (
                        <div 
                            key={p.id} 
                            className={`p-6 rounded-[2rem] border transition-all flex items-center gap-6 group ${currentPlaying?.id === p.id ? 'border-blue-500 bg-blue-50/50' : 'bg-white border-gray-100 hover:border-blue-200'}`}
                        >
                            <div 
                                onClick={() => togglePlay(p)}
                                className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden"
                            >
                                <Headphones size={32} className={currentPlaying?.id === p.id ? 'text-blue-500' : 'text-gray-400'} />
                                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    {isPlaying && currentPlaying?.id === p.id ? <Pause size={24} className="text-blue-600" /> : <Play size={24} className="text-blue-600" />}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg line-clamp-1">{p.title}</h4>
                                <p className="text-sm text-gray-500 mb-2">{p.author}</p>
                                <button 
                                    onClick={() => togglePlay(p)} 
                                    className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                                >
                                    {currentPlaying?.id === p.id && isPlaying ? 'Pause Episode' : 'Play Episode'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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