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
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

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

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const getItemType = (url: string) => {
    if (!url) return 'link';
    const lower = url.toLowerCase();
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.match(/\.(mp4|webm|ogg|mov)$/) || lower.includes('youtube.com') || lower.includes('youtu.be')) return 'video';
    if (lower.match(/\.(mp3|wav|aac|ogg)$/)) return 'audio';
    return 'link';
  };

  // --- FIXED DOWNLOAD LOGIC ---
  const handleDownloadPDF = async (e: React.MouseEvent, item: Pedagogy) => {
    e.stopPropagation(); // Prevent modal from opening
    setDownloadingId(item.id);
    try {
      const response = await fetch(item.url);
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText('À toi le micro Naija', {
          x: width - 160,
          y: 25,
          size: 10,
          font: helveticaFont,
          color: rgb(0.05, 0.2, 0.5),
          opacity: 0.7,
        });
        page.drawText('À toi le micro Naija', {
          x: width / 6,
          y: height / 3,
          size: 45,
          font: helveticaFont,
          color: rgb(0.8, 0.8, 0.8),
          opacity: 0.15,
          rotate: degrees(45),
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
        setPedagogies(Array.isArray(peds) ? peds : peds.data || []);
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

  const typeOptions = ["All", "pdf", "video", "audio", "link"];
  const levelOptions = useMemo(() => ["All", ...Array.from(new Set(pedagogies.map(p => p.level).filter(Boolean)))], [pedagogies]);
  const skillOptions = useMemo(() => ["All", ...Array.from(new Set(pedagogies.map(p => p.skillType).filter(Boolean)))], [pedagogies]);
  const themeOptions = useMemo(() => ["All", ...Array.from(new Set(pedagogies.map(p => p.theme).filter(Boolean)))], [pedagogies]);

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

  // --- FIXED SHARING LOGIC: OPEN IN NEW TAB + STOP PROPAGATION ---
  const handleShare = (e: React.MouseEvent, platform: string, item: Pedagogy) => {
    e.stopPropagation(); // Stop card click
    e.preventDefault();
    
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
    if (targetUrl) {
      const newTab = window.open(targetUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        window.location.href = targetUrl;
      }
    }
    setSharingId(null);
  };

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-white/40" size={48} />
          </div>
        ) : heroData ? (
          <>
            <img src={heroData.mediaUrl} alt={heroData.title} className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-blue-800/60 to-red-700/60" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Library size={18} />
                <p className="text-sm font-bold uppercase tracking-widest">Resources</p>
              </div>
              <h1 className="text-white text-4xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">{heroData.title}</h1>
              <p className="text-white/90 text-xl max-w-xl">{heroData.description}</p>
            </div>
          </>
        ) : null}
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {/* Filters ... (Keep as is) */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                value={searchQuery} 
                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} 
              />
            </div>
            <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
              {typeOptions.map((t) => (
                <button 
                  key={t} 
                  onClick={() => {setActiveType(t); setCurrentPage(1);}} 
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeType === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-gray-50">
            <select value={pedLevel} onChange={(e) => {setPedLevel(e.target.value); setCurrentPage(1);}} className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none">
              {levelOptions.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={pedSkill} onChange={(e) => {setPedSkill(e.target.value); setCurrentPage(1);}} className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none">
              {skillOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={pedTheme} onChange={(e) => {setPedTheme(e.target.value); setCurrentPage(1);}} className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none">
              {themeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item) => (
            <div key={item.id} onClick={() => setPreviewItem(item)} className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col relative cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {getItemType(item.url) === 'pdf' && <FileText size={24} />}
                  {getItemType(item.url) === 'video' && <Video size={24} />}
                  {getItemType(item.url) === 'audio' && <Music size={24} />}
                  {getItemType(item.url) === 'link' && <BookOpen size={24} />}
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setSharingId(sharingId === item.id ? null : item.id); }} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 size={18} />
                  </button>
                  {getItemType(item.url) === 'pdf' && (
                    <button onClick={(e) => handleDownloadPDF(e, item)} className="p-3 hover:bg-gray-100 rounded-full text-blue-600 transition-colors">
                      {downloadingId === item.id ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                    </button>
                  )}
                </div>
              </div>

              {/* SHARE MENU ON CARD */}
              {sharingId === item.id && (
                <div 
                  ref={shareMenuRef} 
                  className="absolute top-20 right-8 z-30 bg-white border border-gray-100 p-4 rounded-[1.5rem] shadow-2xl flex gap-5" 
                  onClick={(e) => e.stopPropagation()} // Stop click from reaching card
                >
                  <button onClick={(e) => handleShare(e, 'x', item)} className="hover:text-blue-400 text-gray-400 transition-colors">
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

              <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-3 mb-6">{item.description}</p>
              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-blue-600 font-bold text-xs uppercase tracking-widest">
                Preview Resource <ExternalLink size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination ... */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-12">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-white rounded-2xl border disabled:opacity-20 shadow-sm hover:bg-gray-50 transition-colors"><ChevronLeft /></button>
            <span className="font-bold text-gray-500 bg-white px-6 py-3 rounded-2xl border">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-white rounded-2xl border disabled:opacity-20 shadow-sm hover:bg-gray-50 transition-colors"><ChevronRight /></button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md" onClick={() => setPreviewItem(null)}>
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] p-10 relative overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setPreviewItem(null)}><X size={28} /></button>
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-6"><GraduationCap size={24} /> <span className="uppercase tracking-widest text-sm">Educational Material</span></div>
            <h2 className="text-4xl font-bold text-slate-900 mb-8">{previewItem.title}</h2>
            <div className="rounded-[2.5rem] overflow-hidden bg-gray-50 border shadow-inner">
              {getItemType(previewItem.url) === 'pdf' ? (
                <iframe src={previewItem.url} className="w-full h-[65vh]" title={previewItem.title} />
              ) : getItemType(previewItem.url) === 'video' ? (
                <div className="aspect-video">
                  {previewItem.url.includes('youtube') || previewItem.url.includes('youtu.be') ? (
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${previewItem.url.split('v=')[1] || previewItem.url.split('/').pop()}`} allowFullScreen />
                  ) : (
                    <video src={previewItem.url} controls className="w-full h-full" />
                  )}
                </div>
              ) : getItemType(previewItem.url) === 'audio' ? (
                <div className="py-20 flex flex-col items-center"><Music size={80} className="text-blue-200 mb-6" /><audio src={previewItem.url} controls className="w-full max-w-md" /></div>
              ) : (
                <div className="py-24 text-center"><BookOpen size={80} className="mx-auto text-gray-200 mb-6" />
                  <a href={previewItem.url} target="_blank" rel="noreferrer" className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-bold shadow-xl hover:bg-blue-700 transition-all inline-flex items-center gap-3">
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