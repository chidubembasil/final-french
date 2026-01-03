import { Headphones, ArrowRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PodcastHero() {
    // ✅ Always initialize as an empty array
    const [podcasts, setPodcasts] = useState([]);
    const navigate = useNavigate();
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

    useEffect(() => {
        fetch(`${CLIENT_KEY}api/podcasts?limit=4`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                // ✅ Robust check: Handle both raw arrays and { data: [] } formats
                const finalData = Array.isArray(data) ? data : (data?.data || []);
                setPodcasts(finalData);
            })
            .catch(err => {
                console.error("Podcast Hero fetch error:", err);
                setPodcasts([]); // ✅ Ensure state remains an array on error
            });
    }, [CLIENT_KEY]);

    // ✅ Safe access: Use optional chaining or check length
    const featured = podcasts.length > 0 ? podcasts[0] : null;

    return (
        <main className="w-full py-16 flex flex-col items-center bg-white">
            <div className="flex flex-col items-center gap-3 mb-10">
                <span className='px-4 py-1 rounded-full flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold uppercase'>
                    <Headphones size={14}/> Listen to learners and teachers
                </span>
                <h2 className='font-serif text-4xl font-bold text-center'>Featured Podcasts</h2>
                <div className='w-24 h-1 bg-blue-600'></div>
            </div>

            <div className="w-[90%] max-w-6xl mb-12">
                {/* ✅ Render featured only if it exists */}
                {featured && (
                    <div className="relative w-full rounded-[2.5rem] p-8 md:p-12 mb-8 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-red-600 text-white flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 space-y-4">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase">Featured Episode</span>
                            <h3 className="text-3xl md:text-4xl font-bold">{(featured as any).title}</h3>
                            <p className="opacity-80">Hosted by {(featured as any).author}</p>
                            <div className="flex gap-4 text-[10px] font-black uppercase">
                                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">{(featured as any).level || 'General'}</span>
                                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">{(featured as any).duration || '8:32'}</span>
                            </div>
                        </div>
                        <div 
                            onClick={() => navigate('/podcast')}
                            className="w-full md:w-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex items-center justify-center aspect-video relative group cursor-pointer"
                        >
                            <button className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                <Play fill="white" color="white" size={30} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ✅ Added Array.isArray check to prevent .slice() crash */}
                    {Array.isArray(podcasts) && podcasts.slice(1, 3).map((p: any) => (
                        <div key={p.id || p._id} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-xs flex items-center gap-6 group hover:border-blue-200 transition-colors">
                            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <Headphones size={32} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg line-clamp-1">{p.title}</h4>
                                <p className="text-sm text-gray-500 mb-2">{p.author}</p>
                                <button onClick={() => navigate('/podcast')} className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">Listen Now</button>
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