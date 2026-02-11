import {
  Search,
  Loader2,
  Library,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Share2,
  MessageCircle,
  Copy,
  Check,
  Download,
  CalendarDays,
  Trophy
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from 'react';
import img1 from "../assets/img/_A1A4786.jpg"

// --- Interfaces ---
interface Pedagogy {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  level?: string;
  skillType?: string;
  theme?: string;
  allowDownload?: boolean; 
  slug?: string;
  sourceType?: 'pedagogy' | 'resource'; 
  mediaUrl?: string;
}

// Added Celebration Interface based on your schema
interface Celebration {
  id: number;
  title: string;
  slug: string;
  content: string;
  celebrationImage?: string;
  eventDate?: string;
  externalUrl?: string;
  status: 'draft' | 'published';
  celebrationType: 'Celebration' | 'Achievement';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

interface StrapiAttributes extends Partial<Pedagogy>, Partial<GalleryHero> {
  purpose?: string;
  subPurpose?: string;
}

interface StrapiItem {
  id: number;
  attributes?: StrapiAttributes;
  title?: string;
  description?: string;
  mediaUrl?: string;
  purpose?: string;
  subPurpose?: string;
  category?: string;
  url?: string;
  level?: string;
  skillType?: string;
  theme?: string;
}

interface StrapiResponse {
  data: StrapiItem[];
}

function Pedagogies() {
  const XLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  const IfClasseLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="15" fill="#45B1A8"/>
      <rect x="23" y="27" width="10" height="46" fill="white"/>
      <rect x="42" y="27" width="10" height="46" fill="white"/>
      <rect x="61" y="27" width="16" height="10" fill="white"/>
      <rect x="61" y="45" width="16" height="10" fill="white"/>
    </svg>
  );

  // --- MOCK DATA ---
  const MOCK_HERO: GalleryHero = {
    title: "Education Resources",
    description: "Learn more about the French language, and other resources for teachers and students' development.",
    mediaUrl: img1
  };

  const [pedagogies, setPedagogies] = useState<Pedagogy[]>([]);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]); // New state for celebrations
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pedLevel, setPedLevel] = useState<string>('All');
  const [pedSkill, setPedSkill] = useState<string>('All');
  const [pedTheme, setPedTheme] = useState<string>('All');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // ─── HELPERS ────────────────────────────────
  const getItemType = (url: string) => {
    if (!url) return 'link';
    const lower = url.toLowerCase();
    if (lower.endsWith('.pdf') || lower.includes('pdf')) return 'pdf';
    return 'link';
  };

  const handleDownload = async (e: React.MouseEvent | React.KeyboardEvent, item: Pedagogy) => {
    e.stopPropagation();
    setDownloadingId(item.id);
    try {
      const response = await fetch(`${CLIENT_KEY}/api/pedagogies/${item.id}/download`);
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleShare = (e: React.MouseEvent, platform: string, item: Pedagogy) => {
    e.stopPropagation(); 
    const shareUrl = `${window.location.origin}${window.location.pathname}/#/resource/${item.id}`;
    const text = `Check out this resource: ${item.title}`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
      return;
    }

    const shareLinks: Record<string, string> = {
      x: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`,
    };

    const targetUrl = shareLinks[platform];
    if (targetUrl) window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setSharingId(null);
  };

  // ─── DATA FETCHING ──────────────────────────
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [heroRes, pedRes, resRes, celebRes] = await Promise.all([
          fetch(`${CLIENT_KEY}/api/galleries`),
          fetch(`${CLIENT_KEY}/api/pedagogies`),
          fetch(`${CLIENT_KEY}/api/resources`),
          fetch(`${CLIENT_KEY}/api/celebrations`) // Fetching celebrations
        ]);

        const heroes: StrapiResponse = await heroRes.json();
        const peds: StrapiResponse = await pedRes.json();
        const resources: StrapiResponse = await resRes.json();
        const celebData = await celebRes.json();
        
        // Handle Celebrations/Achievements (sorting by publishedAt latest)
        const sortedCelebs = (celebData.data || celebData).sort((a: Celebration, b: Celebration) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setCelebrations(sortedCelebs);

        const heroArray = Array.isArray(heroes) ? (heroes as unknown as StrapiItem[]) : (heroes.data || []);
        const hero = heroArray.find((item: StrapiItem) => {
          const attr = item.attributes || item;
          return attr.purpose?.toLowerCase().trim() === "other page" && 
                 attr.subPurpose?.toLowerCase().trim() === "resources";
        });

        if (hero) {
            setHeroData((hero.attributes || hero) as GalleryHero);
        } else {
            setHeroData(MOCK_HERO);
        }
        
        const pedData = Array.isArray(peds) ? (peds as unknown as StrapiItem[]) : (peds.data || []);
        const normalizedPeds = pedData.map((p: StrapiItem) => ({
          id: p.id,
          sourceType: 'pedagogy' as const,
          ...(p.attributes || p)
        })) as Pedagogy[];

        const resData = Array.isArray(resources) ? (resources as unknown as StrapiItem[]) : (resources.data || []);
        const normalizedRes = resData.map((r: StrapiItem) => ({
          id: r.id,
          sourceType: 'resource' as const,
          ...(r.attributes || r)
        })) as Pedagogy[];

        const combined = [...normalizedPeds, ...normalizedRes];
        setPedagogies(combined);
      } catch (err) {
        console.error("Failed to fetch data, showing mock hero:", err);
        setHeroData(MOCK_HERO);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();

    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setSharingId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [CLIENT_KEY]);

  // ─── DYNAMIC FILTERS ──────────────────────────
  const levelOptions = useMemo(() => {
    const unique = Array.from(new Set(pedagogies.map(p => p.level).filter(Boolean)));
    return ["All", ...unique.sort()];
  }, [pedagogies]);

  const skillOptions = useMemo(() => {
    const unique = Array.from(new Set(pedagogies.map(p => p.skillType).filter(Boolean)));
    return ["All", ...unique.sort()];
  }, [pedagogies]);

  const themeOptions = useMemo(() => {
    const unique = Array.from(new Set(pedagogies.map(p => p.theme).filter(Boolean)));
    return ["All", ...unique.sort()];
  }, [pedagogies]);

  const filteredPedagogies = useMemo(() => {
    return pedagogies.filter(item => {
      const isGeneralResource = item.category !== "Special Event" && item.category !== "Ranking";
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = pedLevel === 'All' || item.level === pedLevel;
      const matchesSkill = pedSkill === 'All' || item.skillType === pedSkill;
      const matchesTheme = pedTheme === 'All' || item.theme === pedTheme;
      return isGeneralResource && matchesSearch && matchesLevel && matchesSkill && matchesTheme;
    });
  }, [pedagogies, searchQuery, pedLevel, pedSkill, pedTheme]);

  const totalPages = Math.ceil(filteredPedagogies.length / itemsPerPage);
  const currentItems = filteredPedagogies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Updated to use the new Celebrations API data
  const achievements = useMemo(() => celebrations.filter(c => c.celebrationType === "Achievement"), [celebrations]);
  const upcomingEvents = useMemo(() => celebrations.filter(c => c.celebrationType === "Celebration"), [celebrations]);

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen">
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[80dvh] overflow-hidden bg-slate-900">
        {loading && !heroData ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-white/40" size={48} />
          </div>
        ) : (
          <>
            <img src={heroData?.mediaUrl || MOCK_HERO.mediaUrl} alt={heroData?.title || MOCK_HERO.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-blue-800/60 to-red-700/60" />
            <div className="relative z-30 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Library size={18} />
                <p className="text-sm font-bold uppercase tracking-widest">Resources Library</p>
              </div>
              <h1 className="text-white text-4xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">
                  {heroData?.title || MOCK_HERO.title}
              </h1>
              <p className="text-white/90 text-xl max-w-xl">
                  {heroData?.description || MOCK_HERO.description}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-40">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-8 text-slate-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-600 to-red-600" />
          <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 shrink-0">
            <IfClasseLogo className="w-20 h-20 md:w-24 md:h-24" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold mb-2">IfClasse Pedagogical Portal</h2>
            <p className="text-gray-600 max-w-2xl text-lg">Explore our library of pedagogical PDF resources.</p>
          </div>
          <a href="http://ifclasse.institutfrancais.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all">
            Visit Portal <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* --- TEACHERS HALL OF FAME (ACHIEVEMENTS) --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 gap-8">
        <p className="font-bold text-5xl w-full text-center mt-8 underline ">Teachers Hall of fame</p>
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-stretch">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
          
          <div className="w-full md:w-1/3 min-h-[150px] rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center relative border border-white/10">
            {achievements[0]?.celebrationImage ? (
              <img src={achievements[0].celebrationImage} alt="Achievements" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-yellow-500/20">
                <Trophy size={64} />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-2xl text-yellow-500">
                  <Trophy size={28} />
                </div>
                <h3 className="text-3xl font-bold">Teachers Hall of Fame</h3>
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">Rank</div>
            </div>
            <div className="space-y-3">
              {achievements.length > 0 ? (
                achievements.slice(0, 3).map((rank, index) => (
                  <div key={rank.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      index === 0 ? 'bg-yellow-500 text-slate-900' : 
                      index === 1 ? 'bg-slate-300 text-slate-900' : 
                      index === 2 ? 'bg-orange-400 text-slate-900' : 'bg-white/10 text-white'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate">{rank.title}</h4>
                      <p className="text-[10px] text-white/50 truncate line-clamp-1">{rank.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-white/20 italic">No rankings available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- OTHER RESOURCES & EVENTS (CELEBRATIONS) --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 gap-8">
        <p className="font-bold text-5xl w-full text-center mt-8 underline ">Other Resources & Events</p>
        <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-stretch">
          <div className="w-full md:w-1/3 min-h-[150px] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center relative">
            {upcomingEvents[0]?.celebrationImage ? (
              <img src={upcomingEvents[0].celebrationImage} alt="Events" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-red-100">
                <CalendarDays size={64} />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                <CalendarDays size={28} />
              </div>
              <div>
                <h3 className="text-3xl font-bold">Upcoming & Special Events</h3>
                <p className="text-md text-gray-500">Celebrations Calendar</p>
              </div>
            </div>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-red-200 transition-all group flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-sm text-slate-800 truncate">{event.title}</h4>
                      <p className="text-[10px] font-bold text-red-600 uppercase truncate">
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Special Event"}
                      </p>
                    </div>
                    {event.externalUrl && (
                      <a href={event.externalUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-xl shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-400 italic">No events currently listed.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN RESOURCES GRID --- */}
      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-12 space-y-8">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search resources..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#45B1A8]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select aria-label="Filter by level" value={pedLevel} onChange={(e) => { setPedLevel(e.target.value); setCurrentPage(1); }} className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600">
              {levelOptions.map(l => <option key={l} value={l}>{l === 'All' ? 'All Levels' : l}</option>)}
            </select>
            <select aria-label="Filter by skill type" value={pedSkill} onChange={(e) => { setPedSkill(e.target.value); setCurrentPage(1); }} className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600">
              {skillOptions.map(s => <option key={s} value={s}>{s === 'All' ? 'All Skills' : s}</option>)}
            </select>
            <select aria-label="Filter by theme" value={pedTheme} onChange={(e) => { setPedTheme(e.target.value); setCurrentPage(1); }} className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600">
              {themeOptions.map(t => <option key={t} value={t}>{t === 'All' ? 'All Themes' : t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item) => (
            <div 
              key={`${item.sourceType}-${item.id}`} 
              onClick={(e: React.MouseEvent) => {
                if (item.sourceType === 'resource') {
                    window.open(item.url, '_blank', 'noopener,noreferrer');
                } else {
                    handleDownload(e, item);
                }
              }} 
              className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer flex flex-col relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#45B1A8] group-hover:bg-[#45B1A8] group-hover:text-white transition-colors">
                  {getItemType(item.url) === 'pdf' ? <FileText size={24} /> : <BookOpen size={24} />}
                </div>
                <div className="flex gap-2 relative">
                  <button type="button" aria-label="Share resource" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSharingId(sharingId === item.id ? null : item.id); }} className="p-3 hover:bg-gray-100 rounded-full text-gray-400">
                    <Share2 size={18} />
                  </button>
                  {item.sourceType === 'pedagogy' && (
                    <button type="button" aria-label="Download pedagogy" onClick={(e: React.MouseEvent) => handleDownload(e, item)} className="p-3 hover:bg-gray-100 rounded-full text-[#45B1A8]">
                      {downloadingId === item.id ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                    </button>
                  )}
                  {sharingId === item.id && (
                    <div ref={shareMenuRef} className="absolute top-12 right-0 z-30 bg-white border p-3 rounded-2xl shadow-xl flex gap-4" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                      <button type="button" aria-label="Share on X" onClick={(e: React.MouseEvent) => handleShare(e, 'x', item)} className="text-gray-400 hover:text-black"><XLogo /></button>
                      <button type="button" aria-label="Share on WhatsApp" onClick={(e: React.MouseEvent) => handleShare(e, 'whatsapp', item)} className="text-gray-400 hover:text-green-500"><MessageCircle size={20}/></button>
                      <button type="button" aria-label="Copy link" onClick={(e: React.MouseEvent) => handleShare(e, 'copy', item)} className="text-gray-400">
                        {copiedId === item.id ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-[#45B1A8]">{item.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-3 mb-6">{item.description}</p>
              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                {item.sourceType === 'pedagogy' ? (
                  <button type="button" onClick={(e: React.MouseEvent) => handleDownload(e, item)} className="flex items-center gap-2 text-[#45B1A8] font-bold text-xs uppercase">
                    Download {downloadingId === item.id ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                  </button>
                ) : (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    Go to Resource <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-12">
            <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-white rounded-2xl border disabled:opacity-20 shadow-sm"><ChevronLeft /></button>
            <span className="font-bold text-gray-500">Page {currentPage} of {totalPages}</span>
            <button type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-white rounded-2xl border disabled:opacity-20 shadow-sm"><ChevronRight /></button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Pedagogies;