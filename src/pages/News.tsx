import { Newspaper, Search, Calendar, X, ChevronRight, ChevronLeft, Share2, Facebook, MessageCircle, MapPin, Globe } from "lucide-react";
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
  state: string; // Added State field
}

const NIGERIAN_STATES = ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"];
const CATEGORIES = ['News', 'Announcement', 'Tutorial', 'Event', 'Update'];
const LANGUAGES = ['English', 'French'];

function News() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Advanced Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeState, setActiveState] = useState<string>('All');
  const [activeLanguage, setActiveLanguage] = useState<string>('All');
  
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  useEffect(() => {
    fetch(`${CLIENT_KEY}api/news`)
      .then(res => res.json())
      .then((data: any) => {
        const finalData = Array.isArray(data) ? data : (data.data || []);
        setBlogs(finalData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [CLIENT_KEY]);

  useEffect(() => {
    document.body.style.overflow = selectedPost ? 'hidden' : 'unset';
  }, [selectedPost]);

  const handleShare = async (post: BlogPost, platform?: string) => {
    const shareUrl = `${window.location.origin}/news/${post.slug || post.id}`;
    const shareText = `Check out this article: ${post.title}`;
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else {
      if (navigator.share) {
        try { await navigator.share({ title: post.title, text: post.excerpt, url: shareUrl }); } catch (err) {}
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
      }
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesState = activeState === 'All' || post.state === activeState;
      const matchesLang = activeLanguage === 'All' || post.language === activeLanguage;
      return matchesSearch && matchesCategory && matchesState && matchesLang;
    });
  }, [blogs, searchQuery, activeCategory, activeState, activeLanguage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeCategory, activeState, activeLanguage]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const currentBlogs = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 700, behavior: 'smooth' });
  };

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      {/* HERO SECTION - UNCHANGED */}
      <div className="relative w-full h-[90dvh] overflow-hidden">
        <img src={pic} alt="News Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/50 to-red-700/80" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
          <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
            <Newspaper color="white" size={17} />
            <p className="text-sm font-medium tracking-wide">Stay updated</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">News & Blog</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl">Latest updates, success stories, and educational events from the Bilingual & Competitive project.</p>
        </div>
      </div>

      {/* ENHANCED FILTER BAR */}
      <div className="sticky top-20 z-30 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" placeholder="Search news..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Select */}
            <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl font-bold text-xs uppercase text-gray-600 outline-none focus:bg-white" onChange={(e) => setActiveCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Language Select */}
            <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl font-bold text-xs uppercase text-gray-600 outline-none focus:bg-white" onChange={(e) => setActiveLanguage(e.target.value)}>
              <option value="All">All Languages</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            {/* State Select */}
            <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl font-bold text-xs uppercase text-gray-600 outline-none focus:bg-white" onChange={(e) => setActiveState(e.target.value)}>
              <option value="All">All States (Nigeria)</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map(n => <div key={n} className="h-96 bg-gray-200 animate-pulse rounded-[2rem]" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {currentBlogs.map((post) => (
                <article key={post.id} className="group cursor-pointer flex flex-col bg-white rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden" onClick={() => setSelectedPost(post)}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={post.title} />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase text-blue-700 shadow-sm">{post.category}</span>
                      <span className="bg-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-white shadow-sm flex items-center gap-1"><Globe size={10}/> {post.language}</span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-4 font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-red-500" /> {formatDate(post.publishedAt)}</span>
                      <span className="flex items-center gap-1.5 ml-auto"><MapPin size={14} className="text-blue-500" /> {post.state}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow">{post.excerpt}</p>
                    
                    <div className="flex items-center gap-2 text-blue-700 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all pt-4 border-t border-gray-50">
                      Read Article <ChevronRight size={16} />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION (Logic remains same) */}
            {totalPages > 1 && (
              <div className="mt-20 flex items-center justify-center gap-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-4 rounded-2xl border border-gray-200 disabled:opacity-30"><ChevronLeft size={20} /></button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-12 h-12 rounded-2xl text-xs font-black ${currentPage === i + 1 ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:border-blue-700'}`}>{i + 1}</button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-4 rounded-2xl border border-gray-200 disabled:opacity-30"><ChevronRight size={20} /></button>
              </div>
            )}

            {filteredBlogs.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <Search size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-2xl font-bold text-slate-800">No matches found</h3>
                <p className="text-gray-500 mt-2">Try changing your filters or search terms.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ARTICLE MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-10">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={() => setSelectedPost(null)} />
          <div className="relative bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <button onClick={() => setSelectedPost(null)} className="absolute top-6 right-6 z-50 p-3 bg-white/90 hover:bg-white rounded-full text-slate-800 shadow-xl"><X size={20} /></button>
            <div className="overflow-y-auto">
              <div className="relative w-full h-64 md:h-[450px]">
                <img src={selectedPost.coverImage} className="w-full h-full object-cover" alt={selectedPost.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
              <div className="px-6 md:px-16 pb-20 -mt-24 relative z-10">
                <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="bg-blue-50 text-blue-700 text-[10px] px-5 py-2 rounded-full font-black uppercase tracking-widest">{selectedPost.category}</span>
                      <span className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase"><Calendar size={16} className="text-red-500" /> {formatDate(selectedPost.publishedAt)}</span>
                      <span className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase"><MapPin size={16} className="text-blue-500" /> {selectedPost.state}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] font-black uppercase text-gray-400 mr-2">Share Article:</p>
                      <button onClick={() => handleShare(selectedPost, 'facebook')} className="p-2.5 bg-[#1877F2] text-white rounded-xl hover:scale-110 transition shadow-lg"><Facebook size={16}/></button>
                      <button onClick={() => handleShare(selectedPost, 'whatsapp')} className="p-2.5 bg-[#25D366] text-white rounded-xl hover:scale-110 transition shadow-lg"><MessageCircle size={16}/></button>
                      <button onClick={() => handleShare(selectedPost)} className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:scale-110 transition"><Share2 size={16}/></button>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-10 leading-[1.1] font-serif">{selectedPost.title}</h2>
                  <div className="space-y-8 text-gray-600 text-lg md:text-xl leading-relaxed font-light italic bg-slate-50 p-8 rounded-[2rem] border-l-4 border-blue-600 mb-10">
                    {selectedPost.excerpt}
                  </div>
                  <div className="space-y-6 text-gray-700 text-lg leading-[1.8] article-content">
                    {selectedPost.content.split('\n').map((paragraph, i) => paragraph.trim() && <p key={i} className="mb-4">{paragraph}</p>)}
                  </div>
                  <div className="mt-16 pt-8 border-t border-gray-100">
                    <button onClick={() => setSelectedPost(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl">Close Article</button>
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