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
  ExternalLink
} from "lucide-react";
import { useState, useEffect, useCallback } from 'react';

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
  const [loadingHero, setLoadingHero] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeType, setActiveType] = useState<string>('All');
  const [pedLevel, setPedLevel] = useState<string>('All');
  const [pedSkill, setPedSkill] = useState<string>('All');
  const [pedTheme, setPedTheme] = useState<string>('All');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [previewItem, setPreviewItem] = useState<Pedagogy | null>(null);

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  const getItemType = (url: string) => {
    if (!url) return 'link';
    const lower = url.toLowerCase();
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.match(/\.(mp4|webm|ogg|mov)$/) || lower.includes('youtube.com') || lower.includes('youtu.be')) return 'video';
    if (lower.match(/\.(mp3|wav|aac|ogg)$/)) return 'audio';
    return 'link';
  };

  // Fetch Hero
  useEffect(() => {
    fetch(`${CLIENT_KEY}api/galleries`)
      .then(res => res.json())
      .then((data: any[]) => {
        const hero = data.find(item => item.purpose === "Other Page" && item.subPurpose === "Resources");
        if (hero) setHeroData(hero);
      })
      .finally(() => setLoadingHero(false));
  }, [CLIENT_KEY]);

  // Fetch Pedagogies with filters
  const fetchPedagogies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (activeType !== 'All') params.append('mediaType', activeType.toLowerCase());
      if (pedLevel !== 'All') params.append('level', pedLevel);
      if (pedSkill !== 'All') params.append('skillType', pedSkill);
      if (pedTheme !== 'All') params.append('theme', pedTheme);

      const response = await fetch(`${CLIENT_KEY}api/pedagogies?${params.toString()}`);
      const result = await response.json();

      const items = Array.isArray(result) ? result : (result.data || []);
      setPedagogies(items);
    } catch (err) {
      console.error("Pedagogies fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [CLIENT_KEY, searchQuery, activeType, pedLevel, pedSkill, pedTheme]);

  useEffect(() => {
    fetchPedagogies();
    setCurrentPage(1);
  }, [fetchPedagogies]);

  const currentItems = pedagogies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(pedagogies.length / itemsPerPage);

  const getPreviewContent = (item: Pedagogy) => {
    const type = getItemType(item.url);

    if (type === 'pdf') {
      return (
        <iframe
          src={item.url}
          className="w-full h-[65vh] rounded-2xl border border-gray-200"
          title={item.title}
        />
      );
    }

    if (type === 'video') {
      const isYoutube = item.url.includes('youtube.com') || item.url.includes('youtu.be');
      if (isYoutube) {
        const ytId = item.url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/)?.[1];
        if (ytId) {
          return (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${ytId}`}
              title={item.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-2xl aspect-video"
            />
          );
        }
      }
      return (
        <video
          src={item.url}
          controls
          className="w-full rounded-2xl max-h-[65vh]"
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    if (type === 'audio') {
      return (
        <div className="w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl">
          <Music size={64} className="text-purple-600 mb-6" />
          <audio controls className="w-full max-w-md" src={item.url}>
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <BookOpen size={64} className="mx-auto text-blue-600 mb-6" />
        <p className="text-xl font-medium text-slate-700 mb-4">External learning material</p>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors"
        >
          Open Material <ExternalLink size={18} />
        </a>
      </div>
    );
  };

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      {/* Hero */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loadingHero ? (
          <div className="absolute inset-0 animate-pulse bg-slate-800" />
        ) : (
          <>
            <img
              src={heroData?.mediaUrl}
              alt="Pedagogical Materials Hero"
              className="absolute inset-0 w-full h-full object-cover z-0"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-blue-800/60 to-red-700/60" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 gap-5">
              <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Library size={18} />
                <p className="text-sm font-bold uppercase tracking-widest">Pedagogical Materials</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">
                {heroData?.title}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-xl">{heroData?.description}</p>
            </div>
          </>
        )}
      </div>

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-30 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IF Classe */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-start gap-4 hover:translate-y-[-5px] transition-transform">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">IF Classe</h2>
            <p className="text-gray-500 text-sm mt-1">Plateforme pédagogique de l'Institut Français</p>
          </div>
          <a
            href="https://ifclasse.institutfrancais.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 text-blue-600 font-black text-[11px] uppercase tracking-widest hover:gap-3 transition-all"
          >
            Visit ifclasse.institutfrancais.com <ExternalLink size={14} />
          </a>
        </div>

        {/* Office 365 / LMS */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-white/5 flex flex-col items-start gap-4 hover:translate-y-[-5px] transition-transform">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_Office_logo_%282018%E2%80%93present%29.svg"
              alt="Microsoft 365"
              className="w-10 h-10"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">LMS Login</h2>
            <p className="text-gray-300 text-sm mt-1">Access Office 365 for Lecturers & Students</p>
          </div>
          <a
            href="https://login.microsoftonline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 py-3 px-8 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-lg"
          >
            Sign In to Microsoft 365
          </a>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-4 md:px-8 py-20 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search pedagogical materials..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
              {['All', 'PDF', 'Video', 'Audio'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                    activeType === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-50">
            <select
              className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer"
              value={pedLevel}
              onChange={(e) => setPedLevel(e.target.value)}
            >
              <option value="All">All Levels</option>
              {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select
              className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer"
              value={pedSkill}
              onChange={(e) => setPedSkill(e.target.value)}
            >
              <option value="All">All Skills</option>
              {['Reading', 'Writing', 'Listening', 'Speaking'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer"
              value={pedTheme}
              onChange={(e) => setPedTheme(e.target.value)}
            >
              <option value="All">All Themes</option>
              {['Culture', 'History', 'Science', 'Daily Life'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-blue-700" size={48} />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Loading pedagogical materials...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.length > 0 ? (
                currentItems.map((item) => {
                  const type = getItemType(item.url);
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all relative group cursor-pointer"
                      onClick={() => setPreviewItem(item)}
                    >
                      <div className="mb-6">
                        {type === 'pdf' && <FileText className="text-red-500" size={40} />}
                        {type === 'video' && <Video className="text-blue-500" size={40} />}
                        {type === 'audio' && <Music className="text-purple-500" size={40} />}
                        {type === 'link' && <BookOpen className="text-emerald-500" size={40} />}
                      </div>

                      <h3 className="font-bold text-xl text-slate-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-3 mb-8 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-auto flex flex-wrap gap-2">
                        {item.level && (
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                            {item.level}
                          </span>
                        )}
                        {item.skillType && (
                          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                            {item.skillType}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center text-gray-500 italic text-lg">
                  No pedagogical materials found matching your criteria.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <p className="text-sm font-medium text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 overflow-hidden">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-6 md:p-8 border-b">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 pr-12 line-clamp-1">
                {previewItem.title}
              </h2>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors absolute right-6 top-6"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              {getPreviewContent(previewItem)}
            </div>

            <div className="p-6 md:p-8 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {getItemType(previewItem.url).toUpperCase()} • {previewItem.category}
              </p>
              <a
                href={previewItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
              >
                Open in new tab <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Pedagogies;