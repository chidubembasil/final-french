import { BookOpen, Search } from "lucide-react";
import pic from "../assets/img/_A1A4699.jpg";
import { useState, useEffect, useMemo } from 'react';

interface Resource {
  id: string | number;
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Link' | 'All';
  category: string;
  level: string;
  downloadUrl: string;
}

function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [activeType, setActiveType] = useState<string>('All');

  useEffect(() => {
    // API Fetch
    fetch('https://atoilemicronaija-project-sunshine-production2.up.railway.app/api/resources')
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

  // 1. Extract unique categories dynamically from the data
  const categories = useMemo(() => {
    const unique = Array.from(new Set(resources.map(r => r.category)));
    return ['All Categories', 'Meditation', 'Platform', 'Workspace', ...unique];
  }, [resources]);

  // 2. Combined Filtering Logic
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesSearch = 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'All Categories' || res.category === selectedCategory;

      const matchesType = 
        activeType === 'All' || res.type === activeType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [resources, searchQuery, selectedCategory, activeType]);

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[90dvh] md:h-[90dvh] overflow-hidden">
        <img
          src={pic}
          alt="Resources Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-800/50 to-red-700/60" />

        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-3 md:px-6 lg:px-6 gap-5">
          <div className="flex flex-row items-center justify-center gap-2 text-white px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <BookOpen color="white" size={18} /> 
            <p className="text-sm font-medium">For Teachers</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">
            Teaching Resources
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl">
            Tools and materials to enhance your French language teaching.
          </p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {/* Search and Select Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex flex-1 justify-center items-center">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for resources..."
              className="w-full pl-12 pr-4 py-2 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Select - NOW DYNAMIC */}
          <div className="relative w-full lg:w-72">
            <select
              className="w-full appearance-none px-5 py-2 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-gray-600 font-medium"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
          </div>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
          {['All', 'PDF', 'Video', 'Link'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-8 py-2.5 rounded-full border font-semibold text-sm transition-all whitespace-nowrap ${
                activeType === t 
                  ? 'bg-blue-700 border-blue-700 text-white shadow-lg' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-64 bg-gray-200/50 animate-pulse rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((res) => (
              <div 
                key={res.id} 
                className="flex flex-col p-8 border border-gray-100 rounded-[2.5rem] bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-700 text-3xl group-hover:scale-110 transition-transform">
                    {res.type === 'Video' ? '🎥' : res.type === 'PDF' ? '📄' : '🔗'}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      {res.level}
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      {res.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-xl text-blue-900 mb-3 leading-tight group-hover:text-blue-700">
                    {res.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {res.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{res.type}</span>
                  <a 
                    href={res.downloadUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    {res.type === 'Link' ? 'Visit Link' : 'Download Now'} <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800">No resources found</h3>
            <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Resources;