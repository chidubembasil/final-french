import { Newspaper, ArrowRight, Calendar, X, Copy, Facebook } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Custom X (formerly Twitter) Icon Component
const XLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);

export default function NewsHero() {
    const [news, setNews] = useState<any[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<any>(null);
    const [loadingArticle, setLoadingArticle] = useState(false);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";
    
    // Get the slug from URL: ?article=your-slug
    const activeSlug = searchParams.get('article');

    // Fetch initial news list
    useEffect(() => {
        fetch(`${CLIENT_KEY}api/news?limit=4`)
            .then(res => res.json())
            .then(data => {
                const finalData = Array.isArray(data) ? data : (data?.data || []);
                setNews(finalData);
            })
            .catch(err => console.error("News Fetch Error:", err));
    }, [CLIENT_KEY]);

    // Fetch single article when slug is present in URL
    useEffect(() => {
        if (activeSlug) {
            setLoadingArticle(true);
            fetch(`${CLIENT_KEY}api/news/${activeSlug}`)
                .then(res => res.json())
                .then(data => {
                    setSelectedArticle(data?.data || data);
                })
                .catch(err => {
                    console.error("Article Fetch Error:", err);
                    setSelectedArticle(null);
                })
                .finally(() => setLoadingArticle(false));
        } else {
            setSelectedArticle(null);
        }
    }, [activeSlug, CLIENT_KEY]);

    const closePopup = () => {
        setSearchParams({}); // Clears the 'article' param, closing the modal
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    return (
        <main className="w-full py-16 flex flex-col items-center bg-[#f9f7f4] relative">
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
                            onClick={() => setSearchParams({ article: item.slug })}
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
                                    Read More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
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

            <button 
                onClick={() => navigate('/news&blog')}
                className='text-white bg-blue-700 px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-200'
            >
                Explore All Content <ArrowRight size={18}/>
            </button>

            {/* --- ARTICLE POPUP MODAL --- */}
            {activeSlug && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header with Back & Socials */}
                        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-gray-100 z-10">
                            <button 
                                onClick={closePopup} 
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-700 font-bold transition-colors"
                            >
                                <X size={20} /> Close
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="hidden sm:inline text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Share</span>
                                <button onClick={copyToClipboard} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" title="Copy Link">
                                    <Copy size={18} />
                                </button>
                                <a 
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} 
                                    target="_blank" rel="noreferrer"
                                    className="p-2 hover:bg-gray-100 rounded-full text-black transition-colors"
                                >
                                    <XLogo className="w-[18px] h-[18px]" />
                                </a>
                                <a 
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                                    target="_blank" rel="noreferrer"
                                    className="p-2 hover:bg-gray-100 rounded-full text-[#1877F2] transition-colors"
                                >
                                    <Facebook size={18} fill="currentColor" />
                                </a>
                            </div>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="overflow-y-auto p-6 md:p-12">
                            {loadingArticle ? (
                                <div className="py-20 text-center flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-medium">Loading article...</p>
                                </div>
                            ) : selectedArticle ? (
                                <article className="max-w-3xl mx-auto">
                                    <img 
                                        src={selectedArticle.imageUrl || selectedArticle.coverImage || "https://via.placeholder.com/800x400"} 
                                        className="w-full h-64 md:h-96 object-cover rounded-3xl mb-8 shadow-inner bg-gray-50"
                                        alt={selectedArticle.title}
                                    />
                                    <div className="flex items-center gap-3 text-blue-600 font-bold text-sm mb-4 uppercase">
                                        <Calendar size={16} />
                                        {new Date(selectedArticle.publishedAt || selectedArticle.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                                        {selectedArticle.title}
                                    </h2>
                                    <div 
                                        className="prose prose-blue max-w-none text-gray-600 text-lg leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: selectedArticle.content || selectedArticle.description }}
                                    />
                                </article>
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-red-500 font-bold">Failed to load content.</p>
                                    <button onClick={closePopup} className="mt-4 text-blue-700 underline">Go back</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}