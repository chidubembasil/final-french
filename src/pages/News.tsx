import { Newspaper, Search, Loader2, X, Calendar, MapPin, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  language: string;
  state: string;
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function News() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingHero, setLoadingHero] = useState<boolean>(true);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeState, setActiveState] = useState<string>('All');
  const [activeLanguage, setActiveLanguage] = useState<string>('All');
  
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // --- Fetch Dynamic Hero ---
  useEffect(() => {
    fetch(`${CLIENT_KEY}api/galleries`)
      .then(res => res.json())
      .then((data: any[]) => {
        const hero = data.find(item => item.purpose === "Other Page" && item.subPurpose === "News");
        if (hero) setHeroData(hero);
      })
      .finally(() => setLoadingHero(false));
  }, [CLIENT_KEY]);

  // --- API Filtered Fetch ---
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (activeCategory !== 'All') params.append('category', activeCategory);
      if (activeState !== 'All') params.append('state', activeState);
      if (activeLanguage !== 'All') params.append('language', activeLanguage);

      const res = await fetch(`${CLIENT_KEY}api/news?${params.toString()}`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error("News Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [CLIENT_KEY, searchQuery, activeCategory, activeState, activeLanguage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // FIX: Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, activeState, activeLanguage]);

  // FIX: Pagination Logic
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const currentBlogs = blogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      {/* Dynamic Hero */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loadingHero ? <div className="absolute inset-0 animate-pulse bg-slate-800" /> : (
          <>
            <img src={heroData?.mediaUrl} alt="News Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/50 to-red-700/80" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                <Newspaper color="white" size={17} />
                <p className="text-sm font-medium tracking-wide uppercase">Stay updated</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">{heroData?.title}</h1>
              <p className="text-white/90 text-lg md:text-xl max-w-xl">{heroData?.description}</p>
            </div>
          </>
        )}
      </div>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search news..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <select className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-xs uppercase cursor-pointer" onChange={(e) => setActiveCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {['News', 'Announcement', 'Tutorial', 'Event', 'Update'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-xs uppercase cursor-pointer" onChange={(e) => setActiveLanguage(e.target.value)}>
              <option value="All">All Languages</option>
              {['English', 'French'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-xs uppercase cursor-pointer" onChange={(e) => setActiveState(e.target.value)}>
              <option value="All">All States</option>
              {["Lagos", "Abuja", "Rivers", "Oyo", "Kano"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {currentBlogs.map((post) => (
                <article key={post.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500" onClick={() => setSelectedPost(post)}>
                  <div className="relative h-60 overflow-hidden">
                    <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                    <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                       <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.publishedAt).toLocaleDateString()}</span>
                       <span className="flex items-center gap-1"><MapPin size={12}/> {post.state}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* FIX: Pagination UI */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-4 bg-white rounded-2xl border border-gray-200 disabled:opacity-20 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-4 bg-white rounded-2xl border border-gray-200 disabled:opacity-20 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FIX: Full Post Modal - Reads selectedPost */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl my-auto">
            <button 
              onClick={() => setSelectedPost(null)} 
              className="absolute top-6 right-6 z-10 p-3 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="h-[40vh] relative">
              <img src={selectedPost.coverImage} className="w-full h-full object-cover" alt={selectedPost.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            <div className="p-8 md:p-16 -mt-20 relative bg-white rounded-t-[3rem]">
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest">{selectedPost.category}</span>
                <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border-l pl-4 border-gray-200"><Globe size={14}/> {selectedPost.language}</span>
                <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border-l pl-4 border-gray-200"><MapPin size={14}/> {selectedPost.state}</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-slate-900 leading-tight">{selectedPost.title}</h2>
              
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
                {selectedPost.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default News;