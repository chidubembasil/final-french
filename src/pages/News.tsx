import { 
  Newspaper, Search, Loader2, Calendar, MapPin, 
  Share2, MessageCircle, Linkedin, 
  Copy, Check, ChevronLeft, ChevronRight 
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

// --- Types & Interfaces ---
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
  slug: string;
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function News() {
  const XLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingHero, setLoadingHero] = useState<boolean>(true);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeState, setActiveState] = useState<string>('All');
  
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // Your requested useRef
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const FILTER_OPTIONS = {
    categories: ['News', 'Announcement', 'Tutorial', 'Event', 'Update'],
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
      .then((res: any) => {
        const data = Array.isArray(res) ? res : (res.data || []);
        const hero = data.find((item: any) => {
          const attr = item.attributes || item;
          return attr.purpose === "Other Page" && attr.subPurpose === "News";
        });
        if (hero) setHeroData(hero.attributes || hero);
      })
      .catch(err => console.error("Hero Fetch Error:", err))
      .finally(() => setLoadingHero(false));

    // Ref logic for clicking outside
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

  const filteredBlogs = useMemo(() => {
    return blogs.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'All' || post.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesState = activeState === 'All' || post.state === activeState;
      return matchesSearch && matchesCat && matchesState;
    });
  }, [blogs, searchQuery, activeCategory, activeState]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const currentBlogs = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleShare = (platform: string, post: BlogPost) => {
    const url = `${window.location.origin}/news/${post.slug}`;
    const text = `Read this: ${post.title}`;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
      return;
    }
    
    const links: any = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      x: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };
    window.open(links[platform], '_blank');
  };

  const handlePostClick = (post: BlogPost) => {
    navigate(`/news/${post.slug}`);
  };

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
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

      <div className="sticky top-20 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <select className="px-4 py-3 bg-gray-100/50 rounded-2xl font-bold text-[10px] uppercase outline-none" value={activeCategory} onChange={(e) => {setActiveCategory(e.target.value); setCurrentPage(1);}}>
              <option value="All">All Categories</option>
              {FILTER_OPTIONS.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="px-4 py-3 bg-gray-100/50 rounded-2xl font-bold text-[10px] uppercase outline-none" value={activeState} onChange={(e) => {setActiveState(e.target.value); setCurrentPage(1);}}>
              <option value="All">All Locations</option>
              {FILTER_OPTIONS.states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48}/>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fetching latest news...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentBlogs.map((post) => (
                <article key={post.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 relative" onClick={() => handlePostClick(post)}>
                  <div className="absolute top-4 right-4 z-40">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSharingId(sharingId === post.id ? null : post.id); }}
                      className="p-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white hover:text-blue-600 transition-all"
                    >
                      <Share2 size={16} />
                    </button>
                    {sharingId === post.id && (
                      <div ref={shareMenuRef} className="absolute right-0 mt-2 flex items-center gap-3 bg-white p-2 rounded-2xl border shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleShare('whatsapp', post)} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"><MessageCircle size={18} /></button>
                        <button onClick={() => handleShare('x', post)} className="p-2 text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"><XLogo /></button>
                        <button onClick={() => handleShare('linkedin', post)} className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"><Linkedin size={18} /></button>
                        <button onClick={() => handleShare('copy', post)} className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                          {copiedId === post.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative h-60 overflow-hidden">
                    <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">{post.category}</div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-gray-400 text-[10px] font-black uppercase mb-4">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.updatedAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MapPin size={12}/> {post.state}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">{post.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)} 
                  className="p-4 bg-white rounded-2xl border disabled:opacity-30 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft />
                </button>
                <span className="font-bold text-gray-500 bg-white px-6 py-3 rounded-2xl border">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)} 
                  className="p-4 bg-white rounded-2xl border disabled:opacity-30 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default News;