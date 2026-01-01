import { Newspaper, Search, Calendar, X, ChevronRight, ChevronLeft } from "lucide-react";
import pic from "../assets/img/_A1A4760.jpg";
import { useState, useEffect, useMemo } from 'react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  language: string;
}

function News() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch("https://atoilemicronaija-project-sunshine-production2.up.railway.app/api/news")
      .then(res => res.json())
      .then((data: BlogPost[]) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedPost ? 'hidden' : 'unset';
  }, [selectedPost]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, activeCategory]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeCategory]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const currentBlogs = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      <div className="relative w-full h-[90dvh] overflow-hidden">
        <img src={pic} alt="News Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/50 to-red-700/80" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-4 md:px-6 lg:px-10 gap-5">
          <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
            <Newspaper color="white" size={17} />
            <p className="text-sm font-medium tracking-wide">Stay updated</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">News & Blog</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl">Latest updates, success stories, and educational events from the French Education Fund.</p>
        </div>
      </div>

      <div className="sticky top-20 z-30 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search news..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Restored Original Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'News', 'Announcement', 'Training', 'Event'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.1em] transition-all ${
                  activeCategory === cat ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map(n => <div key={n} className="h-96 bg-gray-200 animate-pulse rounded-[2rem]"></div>)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-y-16">
              {currentBlogs.map((post) => (
                <article key={post.id} className="group cursor-pointer flex flex-col" onClick={() => setSelectedPost(post)}>
                  <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 shadow-md">
                    <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={post.title} />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-[10px] px-3 py-1 rounded-full font-black uppercase">{post.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3 font-bold uppercase">
                    <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(post.publishedAt)}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{post.language}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                    View Full Article <ChevronRight size={16} />
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronLeft size={20}/></button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1 ? "bg-blue-700 text-white shadow-lg" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronRight size={20}/></button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-10">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={() => setSelectedPost(null)} />
          <div className="relative bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedPost(null)} className="absolute top-6 right-6 z-50 p-3 bg-black/10 hover:bg-black/20 backdrop-blur-xl rounded-full text-slate-800 border border-black/5"><X size={20} /></button>
            <div className="overflow-y-auto scrollbar-hide">
              <div className="relative w-full h-64 md:h-96">
                <img src={selectedPost.coverImage} className="w-full h-full object-cover" alt={selectedPost.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
              <div className="px-6 md:px-16 pb-20 -mt-20 relative z-10">
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-50">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest">{selectedPost.category}</span>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase"><Calendar size={14} className="text-blue-500" /> {formatDate(selectedPost.publishedAt)}</div>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.15] font-serif">{selectedPost.title}</h2>
                  <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                    {selectedPost.content.split('\n').map((paragraph, i) => paragraph.trim() && <p key={i}>{paragraph}</p>)}
                  </div>
                  <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <button onClick={() => setSelectedPost(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors">Close Article</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default News;