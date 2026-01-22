import {
  Search,
  Loader2,
  Library,
  X,
  FileText,
  Video,
  Music,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Share2,
  MessageCircle,
  Copy,
  Check,
  Download
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function Pedagogies() {
  // --- Custom Logo Components ---
  const XLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg 
      viewBox="0 0 24 24" 
      aria-hidden="true" 
      className={className} 
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  const IfClasseLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="15" fill="#45B1A8"/>
      <rect x="23" y="27" width="10" height="46" fill="white"/>
      <rect x="42" y="27" width="10" height="46" fill="white"/>
      <rect x="61" y="27" width="16" height="10" fill="white"/>
      <rect x="61" y="45" width="16" height="10" fill="white"/>
    </svg>
  );

  // --- States ---
  const [pedagogies, setPedagogies] = useState<Pedagogy[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeType, setActiveType] = useState<string>('All');
  const [pedLevel, setPedLevel] = useState<string>('All');
  const [pedSkill, setPedSkill] = useState<string>('All');
  const [pedTheme, setPedTheme] = useState<string>('All');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [previewItem, setPreviewItem] = useState<Pedagogy | null>(null);
  
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // --- Helpers ---
  const getItemType = (url: string) => {
    if (!url) return 'link';
    const lower = url.toLowerCase();
    if (lower.endsWith('.pdf') || lower.includes('/image/upload/')) return 'pdf';
    if (lower.match(/\.(mp4|webm|ogg|mov)$/) || lower.includes('/video/upload/') || lower.includes('youtube.com') || lower.includes('youtu.be')) return 'video';
    if (lower.match(/\.(mp3|wav|aac|ogg)$/) || lower.includes('/audio/upload/')) return 'audio';
    return 'link';
  };

  const handleDownloadPDF = async (e: React.MouseEvent, item: Pedagogy) => {
    e.stopPropagation(); 
    setDownloadingId(item.id);
    try {
      const response = await fetch(item.url);
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width } = page.getSize();
        page.drawText('À toi le micro Naija', {
          x: width - 160,
          y: 25,
          size: 10,
          font: helveticaFont,
          color: rgb(0.05, 0.2, 0.5),
          opacity: 0.7,
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${item.title.replace(/\s+/g, '_')}_Naija.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      window.open(item.url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleShare = (e: React.MouseEvent, platform: string, item: Pedagogy) => {
    e.stopPropagation(); 
    const shareUrl = item.url;
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

  // --- Effects ---
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [heroRes, pedRes] = await Promise.all([
          fetch(`${CLIENT_KEY}api/galleries`),
          fetch(`${CLIENT_KEY}api/pedagogies`)
        ]);
        const heroes = await heroRes.json();
        const peds = await pedRes.json();
        
        const heroArray = Array.isArray(heroes) ? heroes : (heroes.data || []);
        const hero = heroArray.find((item: any) => {
          const attr = item.attributes || item;
          return attr.purpose?.toLowerCase().trim() === "other page" && 
                 attr.subPurpose?.toLowerCase().trim() === "resources";
        });
        if (hero) setHeroData(hero.attributes || hero);
        
        const pedData = Array.isArray(peds) ? peds : (peds.data || []);
        const normalizedPeds = pedData.map((p: any) => ({
          id: p.id,
          ...(p.attributes || p)
        }));

        setPedagogies(normalizedPeds);
      } catch (err) {
        console.error("Failed to fetch data:", err);
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

  // --- Filter Logic ---
  const typeOptions = ["All", "pdf", "video", "audio", "link"];
  const levelOptions = useMemo(() => ["All", ...Array.from(new Set(pedagogies.map(p => p.level).filter(Boolean)))].sort(), [pedagogies]);
  const skillOptions = useMemo(() => ["All", ...Array.from(new Set(pedagogies.map(p => p.skillType).filter(Boolean)))].sort(), [pedagogies]);
  const themeOptions = useMemo(() => ["All", ...Array.from(new Set(pedagogies.map(p => p.theme).filter(Boolean)))].sort(), [pedagogies]);

  const filteredPedagogies = useMemo(() => {
    return pedagogies.filter(item => {
      const type = getItemType(item.url).toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === 'All' || type === activeType.toLowerCase();
      const matchesLevel = pedLevel === 'All' || item.level === pedLevel;
      const matchesSkill = pedSkill === 'All' || item.skillType === pedSkill;
      const matchesTheme = pedTheme === 'All' || item.theme === pedTheme;
      return matchesSearch && matchesType && matchesLevel && matchesSkill && matchesTheme;
    });
  }, [pedagogies, searchQuery, activeType, pedLevel, pedSkill, pedTheme]);

  const currentItems = filteredPedagogies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPedagogies.length / itemsPerPage);

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen">
      {/* 1. Hero Section */}
      <div className="relative w-full h-[90dvh] md:h-[90dvh] overflow-hidden bg-slate-900">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-white/40" size={48} />
          </div>
        ) : heroData && (
          <>
            <img src={heroData.mediaUrl} alt={heroData.title} className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-blue-800/60 to-red-700/60" />
            <div className="relative z-30 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Library size={18} />
                <p className="text-sm font-bold uppercase tracking-widest">Resources Library</p>
              </div>
              <h1 className="text-white text-4xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">{heroData.title}</h1>
              <p className="text-white/90 text-xl max-w-xl">{heroData.description}</p>
            </div>
          </>
        )}
      </div>

      {/* 2. Brand Section with IfClasse SVG Logo */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-40">
        <div className="bg-[#45B1A8] rounded-[3rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 text-white">
          <div className="bg-white p-4 rounded-3xl shadow-inner">
            <IfClasseLogo className="w-20 h-20 md:w-24 md:h-24" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">IfClasse Pedagogical Portal</h2>
            <p className="text-white/90 max-w-2xl text-lg">
              Explore our comprehensive library of pedagogical resources designed to support 
              your French teaching and learning journey.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {/* 3. Filters Section */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#45B1A8] transition-all" 
                value={searchQuery} 
                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} 
              />
            </div>
            <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
              {typeOptions.map((t) => (
                <button 
                  key={t} 
                  onClick={() => {setActiveType(t); setCurrentPage(1);}} 
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeType === t ? 'bg-[#45B1A8] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-gray-50">
            <select value={pedLevel} onChange={(e) => {setPedLevel(e.target.value); setCurrentPage(1);}} className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer focus:ring-2 focus:ring-[#45B1A8]">
              <option value="All">All Levels</option>
              {levelOptions.filter(l => l !== "All").map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={pedSkill} onChange={(e) => {setPedSkill(e.target.value); setCurrentPage(1);}} className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer focus:ring-2 focus:ring-[#45B1A8]">
              <option value="All">All Skills</option>
              {skillOptions.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={pedTheme} onChange={(e) => {setPedTheme(e.target.value); setCurrentPage(1);}} className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer focus:ring-2 focus:ring-[#45B1A8]">
              <option value="All">All Themes</option>
              {themeOptions.filter(t => t !== "All").map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* 4. Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item) => (
            <div key={item.id} onClick={() => setPreviewItem(item)} className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col relative cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#45B1A8] group-hover:bg-[#45B1A8] group-hover:text-white transition-colors">
                  {getItemType(item.url) === 'pdf' && <FileText size={24} />}
                  {getItemType(item.url) === 'video' && <Video size={24} />}
                  {getItemType(item.url) === 'audio' && <Music size={24} />}
                  {getItemType(item.url) === 'link' && <BookOpen size={24} />}
                </div>

                <div className="flex gap-2 relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSharingId(sharingId === item.id ? null : item.id); }} 
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-[#45B1A8]"
                  >
                    <Share2 size={18} />
                  </button>
                  
                  {getItemType(item.url) === 'pdf' && (
                    <button 
                      onClick={(e) => handleDownloadPDF(e, item)} 
                      className="p-3 hover:bg-gray-100 rounded-full text-[#45B1A8] transition-colors"
                    >
                      {downloadingId === item.id ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                    </button>
                  )}

                  {sharingId === item.id && (
                    <div 
                      ref={shareMenuRef} 
                      className="absolute top-12 right-0 z-30 bg-white border border-gray-100 p-3 rounded-2xl shadow-xl flex gap-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={(e) => handleShare(e, 'x', item)} className="hover:text-black text-gray-400 transition-colors">
                        <XLogo />
                      </button>
                      <button onClick={(e) => handleShare(e, 'whatsapp', item)} className="hover:text-green-500 text-gray-400 transition-colors">
                        <MessageCircle size={20}/>
                      </button>
                      <button onClick={(e) => handleShare(e, 'copy', item)} className="text-gray-400 transition-colors">
                        {copiedId === item.id ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-[#45B1A8] transition-colors">{item.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-3 mb-6">{item.description}</p>
              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-[#45B1A8] font-bold text-xs uppercase tracking-widest">
                Preview Resource <ExternalLink size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* 5. Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-12">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-white rounded-2xl border disabled:opacity-20 shadow-sm hover:bg-gray-50 transition-colors"><ChevronLeft /></button>
            <span className="font-bold text-gray-500 bg-white px-6 py-3 rounded-2xl border">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-white rounded-2xl border disabled:opacity-20 shadow-sm hover:bg-gray-50 transition-colors"><ChevronRight /></button>
          </div>
        )}
      </div>

      {/* 6. Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md" onClick={() => setPreviewItem(null)}>
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] p-6 md:p-10 relative overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-6 right-6 p-3 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setPreviewItem(null)}><X size={28} /></button>
            <div className="flex items-center gap-2 text-[#45B1A8] font-bold mb-4 md:mb-6"><GraduationCap size={24} /> <span className="uppercase tracking-widest text-xs md:text-sm">Resource Preview</span></div>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6 md:mb-8 pr-12">{previewItem.title}</h2>
            
            <div className="rounded-[2rem] overflow-hidden bg-slate-100 border shadow-inner min-h-[40vh] flex items-center justify-center">
              {getItemType(previewItem.url) === 'pdf' ? (
                <iframe 
                  src={`${previewItem.url}#toolbar=0`} 
                  className="w-full h-[70vh] rounded-[2rem]" 
                  title={`PDF preview of ${previewItem.title}`} 
                />
              ) : getItemType(previewItem.url) === 'video' ? (
                <div className="w-full aspect-video bg-black">
                  {previewItem.url.includes('youtube.com') || previewItem.url.includes('youtu.be') ? (
                    <iframe 
                      className="w-full h-full" 
                      src={`https://www.youtube.com/embed/${previewItem.url.split('v=')[1] || previewItem.url.split('/').pop()}`} 
                      allowFullScreen 
                      title={`Video: ${previewItem.title}`}
                    />
                  ) : (
                    <video src={previewItem.url} controls className="w-full h-full" />
                  )}
                </div>
              ) : getItemType(previewItem.url) === 'audio' ? (
                <div className="w-full py-20 flex flex-col items-center bg-white">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Music size={40} className="text-[#45B1A8] animate-pulse" />
                  </div>
                  <audio src={previewItem.url} controls className="w-full max-w-md" />
                </div>
              ) : (
                <div className="py-24 text-center px-6">
                  <BookOpen size={80} className="mx-auto text-blue-100 mb-6" />
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">External resource.</p>
                  <a href={previewItem.url} target="_blank" rel="noreferrer" className="px-10 py-5 bg-[#45B1A8] text-white rounded-[2rem] font-bold shadow-xl hover:bg-[#38918a] transition-all inline-flex items-center gap-3">
                    Open Resource <ExternalLink size={20} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Pedagogies;