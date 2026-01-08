import { Search, Loader2, Library, X, FileText, Video, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';

interface Resource {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  level?: string;
  skillType?: string;
  theme?: string;
  sourceType: 'Resource' | 'Pedagogy';
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function Resources() {
  const [data, setData] = useState<Resource[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingHero, setLoadingHero] = useState<boolean>(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeType, setActiveType] = useState<string>('All');
  const [resCategory, setResCategory] = useState<string>('All');
  const [pedLevel, setPedLevel] = useState<string>('All');
  const [pedSkill, setPedSkill] = useState<string>('All');
  const [pedTheme, setPedTheme] = useState<string>('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // --- Fetch Dynamic Hero ---
  useEffect(() => {
    fetch(`${CLIENT_KEY}api/galleries`)
      .then(res => res.json())
      .then((data: any[]) => {
        const hero = data.find(item => item.purpose === "Other Page" && item.subPurpose === "Resources");
        if (hero) setHeroData(hero);
      })
      .finally(() => setLoadingHero(false));
  }, [CLIENT_KEY]);

  const getResourceType = (url: string) => {
    if (!url) return 'Link';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.pdf')) return 'PDF';
    if (lowerUrl.match(/\.(mp4|webm|ogg)$/) || lowerUrl.includes('youtube.com') || lowerUrl.includes('vimeo.com') || lowerUrl.includes('youtu.be')) return 'Video';
    return 'Link';
  };

  // --- API Filtered Fetch ---
  const fetchFilteredData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (resCategory !== 'All') params.append('category', resCategory);
      if (pedLevel !== 'All') params.append('level', pedLevel);
      if (pedSkill !== 'All') params.append('skillType', pedSkill);
      if (pedTheme !== 'All') params.append('theme', pedTheme);

      const [resResources, resPedagogies] = await Promise.all([
        fetch(`${CLIENT_KEY}api/resources?${params.toString()}`),
        fetch(`${CLIENT_KEY}api/pedagogies?${params.toString()}`)
      ]);
      
      const resourcesData = await resResources.json();
      const pedagogiesData = await resPedagogies.json();

      const normalizedResources = (Array.isArray(resourcesData) ? resourcesData : (resourcesData.data || [])).map((r: any) => ({
        ...r, sourceType: 'Resource'
      }));
      const normalizedPedagogies = (Array.isArray(pedagogiesData) ? pedagogiesData : (pedagogiesData.data || [])).map((p: any) => ({
        ...p, sourceType: 'Pedagogy'
      }));

      let combined = [...normalizedResources, ...normalizedPedagogies];
      if (activeType !== 'All') {
          combined = combined.filter(item => getResourceType(item.url) === activeType);
      }

      setData(combined);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [CLIENT_KEY, searchQuery, resCategory, pedLevel, pedSkill, pedTheme, activeType]);

  useEffect(() => {
    fetchFilteredData();
  }, [fetchFilteredData]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeType, resCategory, pedLevel, pedSkill, pedTheme]);

  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      {/* Dynamic Hero */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loadingHero ? <div className="absolute inset-0 animate-pulse bg-slate-800" /> : (
          <>
            <img src={heroData?.mediaUrl} alt="Resources Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-blue-800/60 to-red-700/60" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 gap-5">
              <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Library size={18} /> 
                <p className="text-sm font-bold uppercase tracking-widest">Digital Library</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">{heroData?.title}</h1>
              <p className="text-white/90 text-lg md:text-xl max-w-xl">{heroData?.description}</p>
            </div>
          </>
        )}
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search by title..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto">
              {['All', 'PDF', 'Video', 'Link'].map((t) => (
                <button key={t} onClick={() => setActiveType(t)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeType === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-50">
            <select className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer" value={resCategory} onChange={(e) => setResCategory(e.target.value)}>
              <option value="All">All Resources</option>
              {['Training', 'Resource Center', 'French Club', 'Association', 'Event'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer" value={pedLevel} onChange={(e) => setPedLevel(e.target.value)}>
              <option value="All">All Levels</option>
              {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer" value={pedSkill} onChange={(e) => setPedSkill(e.target.value)}>
              <option value="All">All Skills</option>
              {['Reading', 'Writing', 'Listening', 'Speaking'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="px-4 py-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-600 outline-none cursor-pointer" value={pedTheme} onChange={(e) => setPedTheme(e.target.value)}>
              <option value="All">All Themes</option>
              {['Culture', 'History', 'Science', 'Daily Life'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-blue-700" size={48} />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Updating Results...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.length > 0 ? currentItems.map((res) => (
                 <div key={`${res.sourceType}-${res.id}`} className="flex flex-col p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all relative group">
                    <div className={`absolute -top-3 right-8 px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-white shadow-md ${res.sourceType === 'Pedagogy' ? 'bg-red-600' : 'bg-blue-600'}`}>{res.sourceType}</div>
                    
                    <div className="mb-6">
                       {getResourceType(res.url) === 'PDF' && <FileText className="text-red-500" size={32} />}
                       {getResourceType(res.url) === 'Video' && <Video className="text-blue-500" size={32} />}
                       {getResourceType(res.url) === 'Link' && <ExternalLink className="text-emerald-500" size={32} />}
                    </div>

                    <h3 className="font-bold text-xl text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">{res.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">{res.description}</p>
                    <button onClick={() => setViewingResource(res)} className="mt-auto py-4 w-full bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">Preview Details</button>
                 </div>
              )) : (
                <div className="col-span-full py-20 text-center text-gray-400 italic">No resources found matching your criteria.</div>
              )}
            </div>

            {/* FIX: Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-gray-50 transition-all">
                  <ChevronLeft size={20}/>
                </button>
                <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">Page {currentPage} of {totalPages}</p>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-gray-50 transition-all">
                  <ChevronRight size={20}/>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FIX: Modal for viewing resource details */}
      {viewingResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 md:p-16 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setViewingResource(null)} className="absolute top-8 right-8 p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{viewingResource.category} | {viewingResource.sourceType}</span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 leading-tight">{viewingResource.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{viewingResource.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                 {viewingResource.level && <div className="p-4 bg-gray-50 rounded-2xl"><p className="text-[9px] uppercase font-black text-gray-400">Level</p><p className="font-bold text-sm">{viewingResource.level}</p></div>}
                 {viewingResource.skillType && <div className="p-4 bg-gray-50 rounded-2xl"><p className="text-[9px] uppercase font-black text-gray-400">Skill</p><p className="font-bold text-sm">{viewingResource.skillType}</p></div>}
              </div>

              <a 
                href={viewingResource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-3 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
              >
                Access Full Material <ExternalLink size={18}/>
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export default Resources;