import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NewsItem {
    id?: string | number;
    slug: string;
    title: string;
    imageUrl?: string;
    coverImage?: string;
    publishedAt?: string;
    updatedAt?: string;
}

export default function NewsHero() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const navigate = useNavigate();
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

    useEffect(() => {
        const baseUrl = CLIENT_KEY.replace(/\/$/, "");
        const finalUrl = `${baseUrl}/api/news?limit=3`;

        fetch(finalUrl)
            .then(res => res.json())
            .then(data => {
                const finalData = Array.isArray(data) ? data : (data?.data || []);
                setNews(finalData);
            })
            .catch(err => console.error("News Fetch Error:", err));
    }, [CLIENT_KEY]);

    // Format: 2 August, 2026
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        
        const day = date.getDate();
        const month = date.toLocaleString('en-GB', { month: 'long' }); // August, not 8
        const year = date.getFullYear();
        
        return `${day} ${month}, ${year}`;
    };

    return (
        <main className="w-full py-10 flex flex-col items-center bg-[#f9f7f4]">
            {/* --- Section Header --- */}
            <div className="flex flex-col items-center gap-3 mb-7">
                <span className='px-4 py-1.5 rounded-full flex items-center gap-2 bg-blue-100 text-blue-600 text-sm font-medium'>
                    <Newspaper size={18}/> Stay Informed
                </span>
                <h2 className='font-serif text-4xl font-bold text-center text-slate-900'>News & Blog</h2>
                <div className='w-24 h-1 bg-blue-700 rounded-full'></div>
                <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-10 text-center">
                    Stay updated with the latest news, success stories, educational insights, cultural events, and articles related to French language and Francophone initiatives in Nigeria.
                </p>
            </div>

            {/* --- News Grid --- */}
            <div className="w-[90%] max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-9">
                {news.length > 0 ? (
                    news.map((item: NewsItem) => {
                        const formattedDate = formatDate(item.updatedAt);
                        
                        return (
                            <div 
                                key={item?.id || item?.slug} 
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
                                    {formattedDate && (
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                                            <Calendar size={14} />
                                            {formattedDate}
                                        </div>
                                    )}
                                    <h3 className="font-bold text-xl text-slate-800 mb-3 line-clamp-2">
                                        {item?.title}
                                    </h3>
                                    <button className="text-blue-700 font-bold text-sm flex items-center gap-1 group/btn">
                                        Read Full Story <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
                                    </button>
                                </div>
                            </div>
                        );
                    })
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
                Explore <ArrowRight size={18}/>
            </button>
        </main>
    );
}