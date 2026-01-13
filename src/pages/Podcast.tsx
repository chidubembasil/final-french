import { Headphones, Search, X, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';

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
  state: string;
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function Podcast() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loadingHero, setLoadingHero] = useState<boolean>(true);
  const [loadingPodcasts, setLoadingPodcasts] = useState<boolean>(true);
  
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [mediaFilter, setMediaFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [audienceFilter, setAudienceFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [activePodcast, setActivePodcast] = useState<Podcast | null>(null);
  const itemsPerPage = 6;

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  useEffect(() => {
    fetch(`${CLIENT_KEY}api/galleries`)
      .then(res => res.json())
      .then((data: any[]) => {
        const hero = data.find(item => item.purpose === "Other Page" && item.subPurpose === "Podcasts");
        if (hero) setHeroData(hero);
      })
      .finally(() => setLoadingHero(false));
  }, [CLIENT_KEY]);

  const fetchPodcasts = useCallback(async () => {
    setLoadingPodcasts(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (levelFilter !== 'All') params.append('cefrLevel', levelFilter);
      if (mediaFilter !== 'All') params.append('mediaType', mediaFilter.toLowerCase());
      if (stateFilter !== 'All') params.append('state', stateFilter);
      if (topicFilter !== 'All') params.append('topic', topicFilter);
      if (audienceFilter !== 'All') params.append('audience', audienceFilter);

      const response = await fetch(`${CLIENT_KEY}api/podcasts?${params.toString()}`);
      const data = await response.json();
      setPodcasts(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error("Podcast Fetch Error:", err);
    } finally {
      setLoadingPodcasts(false);
    }
  }, [levelFilter, mediaFilter, stateFilter, topicFilter, audienceFilter, search, CLIENT_KEY]);

  useEffect(() => {
    fetchPodcasts();
    setCurrentPage(1);
  }, [fetchPodcasts]);

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const currentPodcasts = podcasts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(podcasts.length / itemsPerPage);

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
    "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
  ];

  return (
    <main className="pt-20 bg-gray-50/50 min-h-screen relative">
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loadingHero ? (
          <div className="absolute inset-0 bg-slate-800 animate-pulse" />
        ) : (
          <>
            <img
              src={heroData?.mediaUrl}
              className="absolute inset-0 w-full h-full object-cover z-0"
              alt="Podcast hero background"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-red-600/80 via-transparent to-blue-900/90" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-16 gap-5">
              <div className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                <Headphones size={17} />
                <p className="text-sm font-medium uppercase tracking-widest">À toi le micro</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">{heroData?.title}</h1>
              <p className="text-white/90 text-lg md:text-xl max-w-xl leading-relaxed">{heroData?.description}</p>
            </div>
          </>
        )}
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-12 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <select 
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none" 
              value={topicFilter} 
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="All">All Topics</option>
              {['Pronunciation', 'Grammar', 'Conversation', 'Culture', 'Basics'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select 
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none" 
              value={audienceFilter} 
              onChange={(e) => setAudienceFilter(e.target.value)}
            >
              <option value="All">All Audiences</option>
              {['Beginners', 'Intermediate', 'Advanced', 'All'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select 
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none" 
              value={stateFilter} 
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="All">All States</option>
              {nigerianStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['All', 'Audio', 'Video'].map(m => (
                <button 
                  key={m} 
                  onClick={() => setMediaFilter(m)} 
                  className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${mediaFilter === m ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {['All', 'A1', 'A2', 'B1', 'B2'].map(lvl => (
                <button 
                  key={lvl} 
                  onClick={() => setLevelFilter(lvl)} 
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${levelFilter === lvl ? 'bg-blue-800 border-blue-800 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loadingPodcasts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="h-96 bg-gray-200 animate-pulse rounded-[2.5rem]"></div>)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPodcasts.map((item) => {
                const ytId = getYouTubeID(item.videoUrl);
                return (
                  <div key={item.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full overflow-hidden">
                    <div className="relative aspect-video bg-black">
                      {item.mediaType === 'video' && ytId ? (
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${ytId}`}
                          title={item.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 relative">
                          <PlayCircle className="text-white fill-blue-600 cursor-pointer" size={50} onClick={() => setActivePodcast(item)} />
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">{item.cefrLevel}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{item.mediaType}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow">{item.description}</p>
                      <button onClick={() => setActivePodcast(item)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                        View Transcript
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-gray-50 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <p className="text-xs font-black text-gray-400 uppercase">Page {currentPage} of {totalPages}</p>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-gray-50 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {activePodcast && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={() => setActivePodcast(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden flex flex-col max-h-[80vh] shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b">
              <h3 className="font-bold text-blue-900 text-xl">{activePodcast.title}</h3>
              <button onClick={() => setActivePodcast(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 overflow-y-auto">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{activePodcast.transcript}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Podcast;