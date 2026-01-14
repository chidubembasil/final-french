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
  Twitter,
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
  const [pedagogies, setPedagogies] = useState<Pedagogy[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Filter States
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

  // Helper to determine file type from URL
  const getItemType = (url: string) => {
    if (!url) return 'link';
    const lower = url.toLowerCase();
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.match(/\.(mp4|webm|ogg|mov)$/) || lower.includes('youtube.com') || lower.includes('youtu.be')) return 'video';
    if (lower.match(/\.(mp3|wav|aac|ogg)$/)) return 'audio';
    return 'link';
  };

  // --- PDF WATERMARK & DOWNLOAD LOGIC ---
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
        const { width, height } = page.getSize();
        
        // 1. Bottom Signature
        page.drawText('À toi le micro Naija', {
          x: width - 160,
          y: 25,
          size: 10,
          font: helveticaFont,
          color: rgb(0.05, 0.2, 0.5),
          opacity: 0.7,
        });

        // 2. Large Diagonal Center Watermark
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

      // FIXED: Using 'as any' to satisfy strict TS environments regarding 
      // Uint8Array<SharedArrayBuffer> vs BlobPart compatibility.
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${item.title.replace(/\s+/g, '_')}_Naija.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
    } catch (err) {
      console.error("Watermark process failed:", err);
      alert("Failed to process PDF watermark. Downloading original instead.");
      window.open(item.url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  // --- Initial Data Fetch ---
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

        const hero = heroes.find((item: any) => item.purpose === "Other Page" && item.subPurpose === "Resources");
        if (hero) setHeroData(hero);

        const pedArray = Array.isArray(peds) ? peds : peds.data || [];
        setPedagogies(pedArray);
      } catch (err) {
        console.error("Failed to fetch pedagogies:", err);
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

  // --- Filtering Logic ---
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

  // --- Social Sharing ---
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

    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareUrl)}`,
    };
    window.open(links[platform], '_blank');
    setSharingId(null);
  };

  // --- Preview Modal Content ---
  const getPreviewContent = (item: Pedagogy) => {
    const type = getItemType(item.url);
    if (type === 'pdf') return <iframe src={item.url} className="w-full h-[65vh] rounded-2xl border" title={item.title} />;
    if (type === 'video') {
      const ytId = item.url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/)?.[1];
      if (ytId) return <iframe width="100%" height="450" src={`https://www.youtube.com/embed/${ytId}`} title={item.title} frameBorder="0" allowFullScreen className="rounded-2xl" />;
      return <video src={item.url} controls className="w-full rounded-2xl max-h-[65vh]" />;
    }
    if (type === 'audio') return (
      <div className="w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl">
        <Music size={64} className="text-purple-600 mb-6" />
        <audio controls className="w-full max-w-md" src={item.url} />
      </div>
    );
    return (
      <div className="text-center py-12">
        <BookOpen size={64} className="mx-auto text-blue-600 mb-6" />
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold">
          Open Material <ExternalLink size={18} />
        </a>
      </div>
    );
  };

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      {/* HERO SECTION */}
      <div className="relative w-full h-[70dvh] md:h-[90dvh] overflow-hidden bg-slate-900">
        {!loading && (
          <>
            <img src={heroData?.mediaUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-blue-800/60 to-red-700/60" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 gap-5">
              <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Library size={18} />
                <p className="text-sm font-bold uppercase tracking-widest">Pedagogical Materials</p>
              </div>
              <h1 className="text-white text-4xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">{heroData?.title}</h1>
              <p className="text-white/90 text-lg md:text-xl max-w-xl">{heroData?.description}</p>
            </div>
          </>
        )}
      </div>

      {/* FEATURED LINK SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-30 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-start gap-4 hover:translate-y-[-5px] transition-transform">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><GraduationCap size={30} /></div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">IF Classe</h2>
            <p className="text-gray-500 text-sm mt-1">Plateforme pédagogique de l'Institut Français</p>
          </div>
          <a href="https://ifclasse.institutfrancais.com" target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 text-blue-600 font-black text-[11px] uppercase tracking-widest">
            Visit ifclasse.institutfrancais.com <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="px-4 md:px-8 py-20 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search resources..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
              {['All', 'PDF', 'Video', 'Audio'].map((t) => (
                <button key={t} onClick={() => setActiveType(t)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeType === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-50">
            <select className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none" value={pedLevel} onChange={(e) => setPedLevel(e.target.value)}>
              <option value="All">All Levels</option>
              {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none" value={pedSkill} onChange={(e) => setPedSkill(e.target.value)}>
              <option value="All">All Skills</option>
              {['Reading', 'Writing', 'Listening', 'Speaking'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none" value={pedTheme} onChange={(e) => setPedTheme(e.target.value)}>
              <option value="All">All Themes</option>
              {['Culture', 'History', 'Science', 'Daily Life'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* RESOURCES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center py-20">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-400 font-medium">Loading pedagogical resources...</p>
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((item) => {
              const type = getItemType(item.url);
              return (
                <div key={item.id} className="flex flex-col p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all relative group cursor-pointer" onClick={() => setPreviewItem(item)}>
                  <div className="absolute top-6 right-6 z-40 flex items-center gap-2" ref={sharingId === item.id ? shareMenuRef : null}>
                    {type === 'pdf' && (
                      <button 
                        onClick={(e) => handleDownloadPDF(e, item)} 
                        disabled={downloadingId === item.id}
                        className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                        title="Download with watermark"
                      >
                        {downloadingId === item.id ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                      </button>
                    )}

                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setSharingId(sharingId === item.id ? null : item.id); }} className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                        <Share2 size={16} />
                      </button>
                      {sharingId === item.id && (
                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 flex flex-col gap-1">
                          <button onClick={(e) => handleShare(e, 'whatsapp', item)} className="flex items-center gap-3 w-full p-3 hover:bg-green-50 text-green-600 rounded-xl transition-colors">
                            <MessageCircle size={14} /> <span className="text-[10px] font-bold uppercase">WhatsApp</span>
                          </button>
                          <button onClick={(e) => handleShare(e, 'twitter', item)} className="flex items-center gap-3 w-full p-3 hover:bg-blue-50 text-blue-400 rounded-xl transition-colors">
                            <Twitter size={14} /> <span className="text-[10px] font-bold uppercase">Twitter</span>
                          </button>
                          <button onClick={(e) => handleShare(e, 'copy', item)} className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors">
                            {copiedId === item.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} 
                            <span className="text-[10px] font-bold uppercase">{copiedId === item.id ? 'Copied' : 'Copy Link'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    {type === 'pdf' && <FileText className="text-red-500" size={40} />}
                    {type === 'video' && <Video className="text-blue-500" size={40} />}
                    {type === 'audio' && <Music className="text-purple-500" size={40} />}
                    {type === 'link' && <BookOpen className="text-emerald-500" size={40} />}
                  </div>

                  <h3 className="font-bold text-xl text-slate-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-8 leading-relaxed">{item.description}</p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {item.level && <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{item.level}</span>}
                    {item.skillType && <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">{item.skillType}</span>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 italic">No resources found matching your filters.</div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-30"><ChevronLeft size={20} /></button>
            <p className="text-sm font-medium text-gray-600">Page {currentPage} of {totalPages}</p>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-30"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-8 border-b">
              <h2 className="text-2xl font-bold text-slate-900 pr-12 line-clamp-1">{previewItem.title}</h2>
              <button onClick={() => setPreviewItem(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors absolute right-8 top-8"><X size={28} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10">{getPreviewContent(previewItem)}</div>
            <div className="p-8 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600 font-bold uppercase">{getItemType(previewItem.url)} • {previewItem.category}</p>
              <a href={previewItem.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-medium">Open Original <ExternalLink size={16} /></a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Pedagogies;