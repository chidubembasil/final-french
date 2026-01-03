import { BookOpen, Search, X, ExternalLink, FileText, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import pic from "../assets/img/_A1A4699.jpg";
import { useState, useEffect, useMemo } from 'react';

interface Resource {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
}

function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
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
    fetch(`${CLIENT_KEY}api/resources`)
      .then(res => res.json())
      .then((data: Resource[]) => {
        setResources(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const getResourceType = (url: string) => {
    if (url.endsWith('.pdf')) return 'PDF';
    if (url.match(/\.(mp4|webm|ogg)$/) || url.includes('youtube.com') || url.includes('vimeo.com')) return 'Video';
    return 'Link';
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(resources.map(r => r.category)));
    return ['All Categories', ...unique];
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const type = getResourceType(res.url);
      const matchesSearch = 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || res.category === selectedCategory;
      const matchesType = activeType === 'All' || type === activeType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [resources, searchQuery, selectedCategory, activeType]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, activeType]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const currentItems = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      <div className="relative w-full h-[90dvh] overflow-hidden">
        <img src={pic} alt="Resources Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 bg-linear-to-br from-blue-900/80 via-blue-800/50 to-red-700/60" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 gap-5">
          <div className="flex flex-row items-center justify-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <BookOpen color="white" size={18} /> 
            <p className="text-sm font-medium">Educational Materials</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">Teaching Resources</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl">Curated tools and guides to support French education and cybersecurity awareness.</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full lg:w-72">
            <select
              className="w-full appearance-none px-5 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-gray-600 font-bold text-sm uppercase tracking-wider"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
          {['All', 'PDF', 'Video', 'Link'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-8 py-2.5 rounded-full border font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeType === t ? 'bg-blue-700 border-blue-700 text-white shadow-lg' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="h-64 bg-gray-200/50 animate-pulse rounded-[2.5rem]"></div>)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((res) => {
                const type = getResourceType(res.url);
                return (
                  <div key={res.id} className="flex flex-col p-8 border border-gray-100 rounded-[2.5rem] bg-white hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors duration-500">
                        {type === 'Video' ? <PlayCircle size={28} /> : type === 'PDF' ? <FileText size={28} /> : <ExternalLink size={28} />}
                      </div>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-black uppercase tracking-[0.15em]">{res.category}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors">{res.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{res.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{type}</span>
                      <button 
                        onClick={() => setViewingResource(res)}
                        className="text-blue-700 font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all"
                      >
                        {type === 'Link' ? 'Visit Link' : 'Open Resource'} <span>→</span>
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
                  className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1 ? "bg-blue-700 text-white shadow-lg" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {viewingResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={() => setViewingResource(null)} />
          <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {getResourceType(viewingResource.url)[0]}
                </div>
                <h3 className="font-bold text-slate-900 truncate max-w-xs md:max-w-md">{viewingResource.title}</h3>
              </div>
              <button onClick={() => setViewingResource(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 overflow-hidden">
              {getResourceType(viewingResource.url) === 'Video' ? (
                <video className="w-full h-full bg-black" controls autoPlay src={viewingResource.url} />
              ) : getResourceType(viewingResource.url) === 'PDF' ? (
                <iframe src={`${viewingResource.url}#toolbar=0`} className="w-full h-full border-none" />
              ) : (
                <div className="flex items-center justify-center h-full flex-col gap-6 text-center p-12">
                   <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
                      <ExternalLink size={40} />
                   </div>
                   <div>
                     <p className="text-slate-900 font-bold text-xl mb-2">External Platform</p>
                     <p className="text-gray-500 max-w-sm">This resource is hosted on an external website. Click below to continue.</p>
                   </div>
                   <a href={viewingResource.url} target="_blank" rel="noreferrer" className="px-10 py-4 bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-200">
                     Continue to Website
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