import { Headphones, Search, X, PlayCircle, Music, ChevronLeft, ChevronRight } from "lucide-react";
import pic from "../assets/img/_A1A4703.jpg";
import { useState, useEffect, useMemo } from 'react';

interface Podcast {
  id: number;
  title: string;
  slug: string;
  description: string;
  mediaType: 'audio' | 'video';
  audioUrl: string;
  videoUrl: string;
  duration: number;
  transcript: string;
  topic: string;
  cefrLevel: string;
  audience: string;
}

function Podcast() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [activePodcast, setActivePodcast] = useState<Podcast | null>(null);

  useEffect(() => {
    fetch('https://atoilemicronaija-project-sunshine-production2.up.railway.app/api/podcasts')
      .then((res) => res.json())
      .then((data: Podcast[]) => {
        setPodcasts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredItems = useMemo(() => {
    return podcasts.filter((p) => {
      const matchesFilter = filter === 'All' || p.cefrLevel === filter;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                            p.topic.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [podcasts, filter, search]);

  useEffect(() => { setCurrentPage(1); }, [filter, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentPodcasts = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <main className="pt-20 bg-gray-50/50 min-h-screen relative">
      <div className="relative w-full h-[90dvh] overflow-hidden">
        <img src={pic} alt="Podcast Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-red-600/80 via-red-500/50 to-blue-800/80" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 gap-5">
          <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
            <Headphones color="white" size={17} />
            <p className="text-sm font-medium">À toi le micro</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">Podcast Library</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl">Listen to French educational podcasts designed for Nigerian learners.</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="Search by title or topic..." 
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {['All', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button 
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  filter === lvl ? 'bg-blue-800 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1, 2, 3].map(n => <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-[2.5rem]"></div>)}
           </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPodcasts.map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setActivePodcast(item)}
                >
                  <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500 z-0">
                      {item.mediaType === 'video' ? '📺' : '🎙️'}
                    </span>
                    <div className="absolute bottom-4 right-4 z-20">
                      <PlayCircle className="text-white fill-blue-600" size={40} />
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex gap-2 mb-4">
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">{item.cefrLevel}</span>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">{item.topic}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 text-xs font-bold mb-4 flex items-center gap-1">
                      FOR: <span className="text-gray-600">{item.audience}</span>
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronLeft size={20}/></button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1 ? "bg-blue-800 text-white shadow-lg" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronRight size={20}/></button>
              </div>
            )}
          </>
        )}
      </div>

      {activePodcast && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={() => setActivePodcast(null)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  {activePodcast.mediaType === 'video' ? <PlayCircle /> : <Music />}
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 leading-tight">{activePodcast.title}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{activePodcast.topic} • {activePodcast.cefrLevel}</p>
                </div>
              </div>
              <button onClick={() => setActivePodcast(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="p-0 bg-black aspect-video flex items-center justify-center">
              {activePodcast.mediaType === 'video' ? (
                <video src={activePodcast.videoUrl} controls autoPlay className="w-full h-full" controlsList="nodownload" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-12">
                   <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                      <Headphones size={60} className="text-white" />
                   </div>
                   <audio src={activePodcast.audioUrl} controls autoPlay className="w-full max-w-md" controlsList="nodownload" />
                </div>
              )}
            </div>
            <div className="p-8 bg-white max-h-40 overflow-y-auto">
              <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-tighter">Transcript / Notes</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{activePodcast.transcript}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Podcast;