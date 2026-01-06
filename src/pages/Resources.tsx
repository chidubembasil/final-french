import { BookOpen, Search, X, ExternalLink, FileText, PlayCircle, ChevronLeft, ChevronRight, Loader2, Library } from "lucide-react";
import pic from "../assets/img/_A1A4699.jpg";
import { useState, useEffect, useMemo } from 'react';

interface Resource {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  status?: string;
  createdAt?: string;
  sourceType: 'Resource' | 'Pedagogy'; // To distinguish between the two APIs
}

function Resources() {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [activeType, setActiveType] = useState<string>('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch from both endpoints concurrently
        const [resResources, resPedagogies] = await Promise.all([
          fetch(`${CLIENT_KEY}api/resources`),
          fetch(`${CLIENT_KEY}api/pedagogies`)
        ]);

        const resourcesData = await resResources.json();
        const pedagogiesData = await resPedagogies.json();

        // Standardize the arrays
        const normalizedResources = (Array.isArray(resourcesData) ? resourcesData : (resourcesData.data || [])).map((r: any) => ({
          ...r,
          sourceType: 'Resource'
        }));

        const normalizedPedagogies = (Array.isArray(pedagogiesData) ? pedagogiesData : (pedagogiesData.data || [])).map((p: any) => ({
          ...p,
          sourceType: 'Pedagogy',
          category: p.category || 'Pedagogical Docs' // Fallback category
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

  const getResourceType = (url: string) => {
    if (!url) return 'Link';
    if (url.endsWith('.pdf')) return 'PDF';
    if (url.match(/\.(mp4|webm|ogg)$/) || url.includes('youtube.com') || url.includes('vimeo.com')) return 'Video';
    return 'Link';
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(data.map(r => r.category)));
    return ['All Categories', ...unique];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((res) => {
      const type = getResourceType(res.url);
      const matchesSearch = 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || res.category === selectedCategory;
      const matchesType = activeType === 'All' || type === activeType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [data, searchQuery, selectedCategory, activeType]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      {/* Hero Section */}
      <div className="relative w-full h-[80dvh] overflow-hidden">
        <img src={pic} alt="Resources Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-blue-800/60 to-red-700/60" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 gap-5">
          <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <Library size={18} /> 
            <p className="text-sm font-bold uppercase tracking-widest">Digital Library</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">Resources & Pedagogies</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl">Access curated educational links and formal pedagogical documents for French language mastery.</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {/* Search and Category Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title or keyword..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full lg:w-72 appearance-none px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-gray-600 font-bold text-xs uppercase tracking-widest"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
          {['All', 'PDF', 'Video', 'Link'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-8 py-3 rounded-full border font-black text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                activeType === t ? 'bg-blue-700 border-blue-700 text-white shadow-xl scale-105' : 'bg-white text-gray-400 border-gray-200 hover:border-blue-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-700" size={40} />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Synchronizing Library...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((res) => {
                const type = getResourceType(res.url);
                return (
                  <div key={`${res.sourceType}-${res.id}`} className="flex flex-col p-8 border border-gray-100 rounded-[2.5rem] bg-white hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group relative overflow-hidden">
                    {/* Source Indicator Ribbon */}
                    <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black uppercase tracking-tighter text-white ${res.sourceType === 'Pedagogy' ? 'bg-red-600' : 'bg-blue-600'}`}>
                      {res.sourceType}
                    </div>

                    <div className="flex items-start justify-between mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors duration-500">
                        {type === 'Video' ? <PlayCircle size={28} /> : type === 'PDF' ? <FileText size={28} /> : <ExternalLink size={28} />}
                      </div>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-bold uppercase tracking-wider">{res.category}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors">{res.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{res.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{type}</span>
                      <button 
                        onClick={() => setViewingResource(res)}
                        className="text-blue-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all"
                      >
                        {type === 'Link' ? 'Visit' : 'View'} <span>→</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-4 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-14 h-14 rounded-2xl font-bold transition-all ${currentPage === i + 1 ? "bg-blue-700 text-white shadow-xl scale-110" : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-4 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal - Same as before but with Source Info */}
      {viewingResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={() => setViewingResource(null)} />
          <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase">
                  {viewingResource.sourceType}
                </div>
                <h3 className="font-bold text-slate-900 truncate max-w-xs md:max-w-xl">{viewingResource.title}</h3>
              </div>
              <button onClick={() => setViewingResource(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100">
              {getResourceType(viewingResource.url) === 'Video' ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                    <video className="max-w-full max-h-full" controls autoPlay src={viewingResource.url} />
                </div>
              ) : getResourceType(viewingResource.url) === 'PDF' ? (
                <iframe src={`${viewingResource.url}#toolbar=0`} className="w-full h-full border-none" />
              ) : (
                <div className="flex items-center justify-center h-full flex-col gap-6 text-center p-12">
                   <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
                      <ExternalLink size={40} />
                   </div>
                   <div>
                     <p className="text-slate-900 font-bold text-xl mb-2">External Portal</p>
                     <p className="text-gray-500 max-w-sm">This {viewingResource.sourceType.toLowerCase()} is hosted externally.</p>
                   </div>
                   <a href={viewingResource.url} target="_blank" rel="noreferrer" className="px-12 py-4 bg-blue-700 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg">
                     Open in New Tab
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

export default Resources;