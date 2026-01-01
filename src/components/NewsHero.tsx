import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewsHero() {
    const [news, setNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://atoilemicronaija-project-sunshine-production2.up.railway.app/api/news?limit=3')
            .then(res => res.json())
            .then(data => setNews(data))
            .catch(err => console.error("News Hero fetch error:", err));
    }, []);

    return (
        <main className="w-full py-16 flex flex-col items-center bg-[#f9f7f4]">
            <div className="flex flex-col items-center gap-3 mb-12">
                <span className='px-4 py-1.5 rounded-full flex items-center gap-2 bg-blue-100 text-blue-600 text-sm font-medium'>
                    <Newspaper size={18}/> Stay Informed
                </span>
                <h2 className='font-serif text-5xl font-bold'>News & Blog</h2>
                <div className='w-24 h-1 bg-blue-700'></div>
            </div>

            <div className="w-[90%] max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {news.map((item: any) => (
                    <div 
                        key={item.id} 
                        onClick={() => navigate('/news&blog')}
                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group cursor-pointer"
                    >
                        <div className="h-56 overflow-hidden">
                            <img 
                                src={item.imageUrl || item.coverImage} 
                                alt={item.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                                <Calendar size={14} />
                                {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                            </div>
                            <h3 className="font-bold text-xl text-slate-800 mb-3 line-clamp-2 leading-snug">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                                {item.excerpt || item.description || item.summary}
                            </p>
                            <button className="text-blue-700 font-bold text-sm flex items-center gap-1 group/btn">
                                Read More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => navigate('/news&blog')}
                className='text-white bg-blue-700 px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-200'
            >
                Explore All Content <ArrowRight size={18}/>
            </button>
        </main>
    );
}