import { Search, X, ExternalLink, FileText, PlayCircle, ChevronLeft, ChevronRight, Loader2, Library } from "lucide-react";
import pic from "../assets/img/_A1A4699.jpg";
import { useState, useEffect, useMemo } from 'react';

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

const RESOURCE_CATEGORIES = ['Training', 'Resource Center', 'French Club', 'Association', 'Event'];
const PEDAGOGY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const PEDAGOGY_SKILLS = ['Reading', 'Writing', 'Listening', 'Speaking'];
const PEDAGOGY_THEMES = ['Culture', 'History', 'Science', 'Daily Life'];

function Resources() {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resResources, resPedagogies] = await Promise.all([
          fetch(`${CLIENT_KEY}api/resources`),
          fetch(`${CLIENT_KEY}api/pedagogies`)
        ]);
        const resourcesData = await resResources.json();
        const pedagogiesData = await resPedagogies.json();

        const normalizedResources = (Array.isArray(resourcesData) ? resourcesData : (resourcesData.data || [])).map((r: any) => ({
          ...r, sourceType: 'Resource'
        }));
        const normalizedPedagogies = (Array.isArray(pedagogiesData) ? pedagogiesData : (pedagogiesData.data || [])).map((p: any) => ({
          ...p, sourceType: 'Pedagogy'
        }));

        setData([...normalizedResources, ...normalizedPedagogies]);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [CLIENT_KEY]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const getResourceType = (url: string) => {
    if (!url) return 'Link';
    if (url.toLowerCase().endsWith('.pdf')) return 'PDF';
    if (url.match(/\.(mp4|webm|ogg)$/) || url.includes('youtube.com') || url.includes('vimeo.com')) return 'Video';
    return 'Link';
  };

  const filteredData = useMemo(() => {
    return data.filter((res) => {
      const type = getResourceType(res.url);
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === 'All' || type === activeType;

      if (res.sourceType === 'Resource') {
        const matchesCategory = resCategory === 'All' || res.category === resCategory;
        const matchesPed = pedLevel === 'All' && pedSkill === 'All' && pedTheme === 'All';
        return matchesSearch && matchesType && matchesCategory && matchesPed;
      }
      if (res.sourceType === 'Pedagogy') {
        const matchesLevel = pedLevel === 'All' || res.level === pedLevel;
        const matchesSkill = pedSkill === 'All' || res.skillType === pedSkill;
        const matchesTheme = pedTheme === 'All' || res.theme === pedTheme;
        const matchesResCat = resCategory === 'All';
        return matchesSearch && matchesType && matchesLevel && matchesSkill && matchesTheme && matchesResCat;
      }
      return false;
    });
  }, [data, searchQuery, activeType, resCategory, pedLevel, pedSkill, pedTheme]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeType, resCategory, pedLevel, pedSkill, pedTheme]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      <div className="relative w-full h-[90dvh] overflow-hidden">
        <img src={pic} alt="Resources Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-blue-800/60 to-red-700/60" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 gap-5">
          <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <Library size={18} /> 
            <p className="text-sm font-bold uppercase tracking-widest">Digital Library</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">Resources & Pedagogies</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl">Curated educational tools and formal documents for French language mastery.</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex bg-gray-100 p-1.5 rounded-2xl">
              {['All', 'PDF', 'Video', 'Link'].map((t) => (
                <button key={t} onClick={() => setActiveType(t)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeType === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-50">
            <select className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border-none text-xs font-bold text-gray-600 outline-none" value={resCategory} onChange={(e) => setResCategory(e.target.value)}>
              <option value="All">All Resources</option>
              {RESOURCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border-none text-xs font-bold text-gray-600 outline-none" value={pedLevel} onChange={(e) => setPedLevel(e.target.value)}>
              <option value="All">All Levels</option>
              {PEDAGOGY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border-none text-xs font-bold text-gray-600 outline-none" value={pedSkill} onChange={(e) => setPedSkill(e.target.value)}>
              <option value="All">All Skills</option>
              {PEDAGOGY_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border-none text-xs font-bold text-gray-600 outline-none" value={pedTheme} onChange={(e) => setPedTheme(e.target.value)}>
              <option value="All">All Themes</option>
              {PEDAGOGY_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-blue-700" size={48} />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Loading Assets...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((res) => {
                const type = getResourceType(res.url);
                return (
                  <div key={`${res.sourceType}-${res.id}`} className="flex flex-col p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative">
                    <div className={`absolute -top-3 right-8 px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-white shadow-lg ${res.sourceType === 'Pedagogy' ? 'bg-red-600' : 'bg-blue-600'}`}>{res.sourceType}</div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-all duration-500">
                        {type === 'Video' ? <PlayCircle size={28} /> : type === 'PDF' ? <FileText size={28} /> : <ExternalLink size={28} />}
                      </div>
                      <span className="text-[9px] bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-black uppercase">{res.category || res.theme}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">{res.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">{res.description}</p>
                    </div>
                    <button onClick={() => setViewingResource(res)} className="mt-6 py-4 w-full bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-blue-700 transition-all">Open Resource</button>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="p-5 rounded-3xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronLeft size={24} /></button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-14 h-14 rounded-3xl font-black text-sm transition-all ${currentPage === i + 1 ? "bg-blue-700 text-white shadow-xl scale-110" : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-50"}`}>{i + 1}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="p-5 rounded-3xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronRight size={24} /></button>
              </div>
            )}
          </>
        )}
      </div>

      {viewingResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/98 backdrop-blur-xl" onClick={() => setViewingResource(null)} />
          <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-8 border-b">
              <h3 className="font-bold text-slate-900 text-lg">{viewingResource.title}</h3>
              <button onClick={() => setViewingResource(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={28} className="text-gray-400" /></button>
            </div>
            <div className="flex-1 bg-slate-50 relative">
              {getResourceType(viewingResource.url) === 'Video' ? (
                <div className="w-full h-full bg-black flex items-center justify-center"><video className="max-w-full max-h-full" controls autoPlay src={viewingResource.url} /></div>
              ) : getResourceType(viewingResource.url) === 'PDF' ? (
                <iframe src={`${viewingResource.url}#toolbar=0`} className="w-full h-full border-none" />
              ) : (
                <div className="flex items-center justify-center h-full flex-col gap-8 text-center p-12">
                  <ExternalLink size={48} className="text-blue-600" />
                  <a href={viewingResource.url} target="_blank" rel="noreferrer" className="px-16 py-5 bg-blue-700 text-white rounded-[2rem] font-black text-xs uppercase hover:bg-blue-800 transition-all">Visit External Website</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Resources;