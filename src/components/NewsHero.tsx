import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewsHero() {
    const [news, setNews] = useState<any[]>([]);
    const navigate = useNavigate();
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

    // Fetch initial news list (limited to 3 for the grid)
    useEffect(() => {
        fetch(`${CLIENT_KEY}api/news?limit=3`)
            .then(res => res.json())
            .then(data => {
                const finalData = Array.isArray(data) ? data : (data?.data || []);
                setNews(finalData);
            })
            .catch(err => console.error("News Fetch Error:", err));
    }, [CLIENT_KEY]);

    return (
        <main className="w-full py-16 flex flex-col items-center bg-[#f9f7f4]">
            {/* --- Section Header --- */}
            <div className="flex flex-col items-center gap-3 mb-12">
                <span className='px-4 py-1.5 rounded-full flex items-center gap-2 bg-blue-100 text-blue-600 text-sm font-medium'>
                    <Newspaper size={18}/> Stay Informed
                </span>
                <h2 className='font-serif text-4xl font-bold text-center text-slate-900'>News & Blog</h2>
                <div className='w-24 h-1 bg-blue-700 rounded-full'></div>
            </div>

            {/* --- News Grid --- */}
            <div className="w-[90%] max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {news.length > 0 ? (
                    news.map((item: any) => (
                        <div 
                            key={item?.id || item?.slug} 
                            // This navigates to your NewsDetail page using the slug
                            onClick={() => navigate(`/news/${item.slug}`)}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group cursor-pointer"
                        >
                            <div className="h-56 overflow-hidden">
                                <img 
                                    src={item?.imageUrl || item?.coverImage || "https://via.placeholder.com/400x300"} 
                                    alt={item?.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                                    <Calendar size={14} />
                                    {item?.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Recent"}
                                </div>
                                <h3 className="font-bold text-xl text-slate-800 mb-3 line-clamp-2">
                                    {item?.title}
                                </h3>
                                <button className="text-blue-700 font-bold text-sm flex items-center gap-1 group/btn">
                                    Read Full Story <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-400 italic">
                        No articles found.
                    </div>
                )}
            </div>

            {/* --- Bottom Navigation --- */}
            <button 
                onClick={() => navigate('/news&blog')}
                className='text-white bg-blue-700 px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-200'
            >
                Explore All Content <ArrowRight size={18}/>
            </button>
        </main>
    );
}