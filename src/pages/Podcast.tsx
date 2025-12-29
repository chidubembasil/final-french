import { Headphones} from "lucide-react";
import pic from "../assets/img/_A1A4703.jpg"
import { useState, useEffect, useMemo } from 'react';

interface Podcast {
  id: string | number;
  title: string;
  author: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  category: string;
  thumbnailUrl?: string;
}

function Podcast(){
   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetch('https://atoilemicronaija-project-sunshine-production2.up.railway.app/api/podcasts')
      .then((res) => res.json())
      .then((data: Podcast[]) => setPodcasts(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredItems = useMemo(() => {
    return podcasts.filter((p) => {
      const matchesFilter = filter === 'All' || p.level === filter;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [podcasts, filter, search]);
    return(
        <main className="pt-20">
          <div className="relative w-full h-[90dvh] md:h-[90dvh] overflow-hidden">
              {/* Background image */}
              <img
                src={pic}
                alt=""
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Red + Blue gradient overlay */}
              <div className="absolute inset-0 z-10 bg-linear-to-br from-red-600/70 via-red-500/50 to-blue-800/70" />

              {/* Content */}
              <div className="relative z-20 w-full h-full flex flex-col items-start justify-center pl-6 gap-5">

                {/* Glass badge */}
                <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                  <Headphones color="white" size={17} />
                  <p className="text-sm">À toi le micro</p>
                </div>

                <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">
                  Podcast Library
                </h1>

                <p className="text-white text-xl max-w-xl">
                  Listen to podcasts created by Nigerian learners and teachers.
                </p>

              </div>
            </div>


            <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <input 
          type="text"
          className="w-full lg:w-80 p-2 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500" 
          placeholder="Search podcasts..." 
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['All', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
            <button 
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${
                filter === lvl ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
            <div className="aspect-video bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center">
              <span className="text-4xl">🎧</span>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-3">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase">{item.level}</span>
                <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded uppercase">{item.category}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{item.author}</p>
              <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
        </main>
    )
}

export default Podcast