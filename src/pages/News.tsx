import { Newspaper, Search, Loader2, X, Calendar, MapPin, ChevronLeft, ChevronRight, ArrowLeft, Share2, Twitter, Linkedin, MessageCircle, Copy, Check } from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  updatedAt: string;
  language: string;
  state: string;
  slug?: string;
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
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const FILTER_OPTIONS = {
    // Categories matching your API string values
    categories: ['News', 'Announcement', 'Tutorial', 'Event', 'Update'],
    languages: ['English', 'French'],
    states: [
      "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
      "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
      "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
      "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
      "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
    ]
  };

  useEffect(() => {
    fetch(`${CLIENT_KEY}api/galleries`)
      .then(res => res.json())
      .then((data: any[]) => {
        const hero = data.find(item => item.purpose === "Other Page" && item.subPurpose === "News");
        if (hero) setHeroData(hero);
      })
      .finally(() => setLoadingHero(false));

    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setSharingId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [CLIENT_KEY]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CLIENT_KEY}api/news`);
      const data = await res.json();
      const rawData = Array.isArray(data) ? data : (data.data || []);
      setBlogs(rawData);
    } catch (err) {
      console.error("News Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [CLIENT_KEY]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  // CATEGORY FILTER LOGIC REFINED
  const filteredBlogs = useMemo(() => {
    return blogs.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Strict matching with the API 'category' field
      const matchesCat = activeCategory === 'All' || post.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesState = activeState === 'All' || post.state === activeState;
      const matchesLang = activeLanguage === 'All' || post.language === activeLanguage;
      
      return matchesSearch && matchesCat && matchesState && matchesLang;
    });
  }, [blogs, searchQuery, activeCategory, activeState, activeLanguage]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const currentBlogs = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleShare = (e: React.MouseEvent | undefined, platform: string, post: BlogPost) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/news/${post.id}`;
    const text = `Read this article: ${post.title}`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
      return;
    }

    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`,
    };
    window.open(links[platform], '_blank');
    setSharingId(null);
  };

  useEffect(() => {
    document.body.style.overflow = selectedPost ? "hidden" : "unset";
  }, [selectedPost]);

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      {/* HERO SECTION */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loadingHero ? (
          <div className="absolute inset-0 animate-pulse bg-slate-800" />
        ) : (
          <>
            <img src={heroData?.mediaUrl} className="absolute inset-0 w-full h-full object-cover z-0" alt="News hero" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/50 to-red-700/80" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                <Newspaper color="white" size={17} />
                <p className="text-sm font-medium tracking-wide uppercase">Press & Updates</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">{heroData?.title}</h1>
              <p className="text-white/90 text-lg md:text-xl max-w-xl">{heroData?.description}</p>
            </div>
          </>
        )}
      </div>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-20 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-100/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            <select className="px-4 py-3 bg-gray-100/50 rounded-2xl font-bold text-[10px] uppercase cursor-pointer outline-none focus:ring-2 focus:ring-blue-500" value={activeCategory} onChange={(e) => {setActiveCategory(e.target.value); setCurrentPage(1);}}>
              <option value="All">All Categories</option>
              {FILTER_OPTIONS.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="px-4 py-3 bg-gray-100/50 rounded-2xl font-bold text-[10px] uppercase cursor-pointer outline-none focus:ring-2 focus:ring-blue-500" value={activeLanguage} onChange={(e) => setActiveLanguage(e.target.value)}>
              <option value="All">All Languages</option>
              {FILTER_OPTIONS.languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="px-4 py-3 bg-gray-100/50 rounded-2xl font-bold text-[10px] uppercase cursor-pointer outline-none focus:ring-2 focus:ring-blue-500" value={activeState} onChange={(e) => setActiveState(e.target.value)}>
              <option value="All">All Locations</option>
              {FILTER_OPTIONS.states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* NEWS GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48}/>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fetching latest news...</p>
          </div>
        ) : (
          <>
            {currentBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {currentBlogs.map((post) => (
                  <article key={post.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative" onClick={() => setSelectedPost(post)}>
                    
                    {/* Share Trigger */}
                    <div className="absolute top-4 right-4 z-40" ref={sharingId === post.id ? shareMenuRef : null}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSharingId(sharingId === post.id ? null : post.id); }}
                        className="p-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white hover:text-blue-600 transition-all"
                      >
                        <Share2 size={16} />
                      </button>
                      {sharingId === post.id && (
                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 flex flex-col gap-1 animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                          <button onClick={(e) => handleShare(e, 'whatsapp', post)} className="flex items-center gap-3 w-full p-3 hover:bg-green-50 text-green-600 rounded-xl transition-colors">
                            <MessageCircle size={14} /> <span className="text-[10px] font-bold uppercase">WhatsApp</span>
                          </button>
                          <button onClick={(e) => handleShare(e, 'twitter', post)} className="flex items-center gap-3 w-full p-3 hover:bg-blue-50 text-blue-400 rounded-xl transition-colors">
                            <Twitter size={14} /> <span className="text-[10px] font-bold uppercase">Twitter</span>
                          </button>
                          <button onClick={(e) => handleShare(e, 'linkedin', post)} className="flex items-center gap-3 w-full p-3 hover:bg-blue-50 text-blue-700 rounded-xl transition-colors">
                            <Linkedin size={14} /> <span className="text-[10px] font-bold uppercase">LinkedIn</span>
                          </button>
                          <button onClick={(e) => handleShare(e, 'copy', post)} className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors">
                            {copiedId === post.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} 
                            <span className="text-[10px] font-bold uppercase">{copiedId === post.id ? 'Copied' : 'Copy Link'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative h-60 overflow-hidden">
                      <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-gray-400 text-[10px] font-black uppercase mb-4">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.updatedAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MapPin size={12}/> {post.state}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{post.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest">No articles found matching your criteria</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-white rounded-2xl border border-gray-100 disabled:opacity-20 hover:bg-gray-50 shadow-sm transition-all"><ChevronLeft size={20}/></button>
                <span className="text-xs font-bold text-gray-400 px-4">Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-white rounded-2xl border border-gray-100 disabled:opacity-20 hover:bg-gray-50 shadow-sm transition-all"><ChevronRight size={20}/></button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FULL SCREEN READER MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto flex flex-col" onClick={() => setSelectedPost(null)}>
          <div className="sticky top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center bg-white/80 backdrop-blur-md z-[100] border-b border-gray-100">
            <button onClick={(e) => { e.stopPropagation(); setSelectedPost(null); }} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-black uppercase tracking-widest text-[10px]">Back to News</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); setSelectedPost(null); }} className="flex items-center gap-3 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-lg group">
              <span className="font-bold text-xs uppercase">Close</span>
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-8">
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto">
                  <span>{selectedPost.category}</span>
                  <span className="w-1 h-1 bg-blue-200 rounded-full" />
                  <span>{selectedPost.language}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-serif text-slate-900 leading-[1.1]">{selectedPost.title}</h2>
                
                {/* METADATA & MODAL SHARE BAR */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4 border-t border-gray-100">
                   <div className="flex items-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(selectedPost.updatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    <span className="flex items-center gap-2"><MapPin size={14}/> {selectedPost.state}</span>
                  </div>

                  {/* Share Icons inside Modal */}
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    <button onClick={() => handleShare(undefined, 'whatsapp', selectedPost)} className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors" title="Share on WhatsApp">
                      <MessageCircle size={18} />
                    </button>
                    <button onClick={() => handleShare(undefined, 'twitter', selectedPost)} className="p-2 hover:bg-blue-100 text-blue-400 rounded-lg transition-colors" title="Share on Twitter">
                      <Twitter size={18} />
                    </button>
                    <button onClick={() => handleShare(undefined, 'linkedin', selectedPost)} className="p-2 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors" title="Share on LinkedIn">
                      <Linkedin size={18} />
                    </button>
                    <button onClick={() => handleShare(undefined, 'copy', selectedPost)} className="flex items-center gap-2 p-2 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">
                      {copiedId === selectedPost.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      <span className="text-[10px] font-black uppercase">{copiedId === selectedPost.id ? 'Copied' : 'Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">
                <img src={selectedPost.coverImage} className="w-full h-full object-cover" alt={selectedPost.title} />
              </div>

              <div className="prose prose-lg prose-slate max-w-none mt-4">
                <div className="h-px w-20 bg-blue-600 mb-10" />
                <div className="text-gray-600 leading-[1.8] space-y-8 text-lg">
                  {selectedPost.content.split('\n').filter(p => p.trim() !== '').map((para, i) => (
                    <p key={i} className="first-letter:text-5xl first-letter:font-bold first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
              <div className="h-20" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default News;