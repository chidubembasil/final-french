import { Headphones, Search, X, PlayCircle, ChevronLeft, ChevronRight, ArrowLeft, Calendar, User, MapPin, Layers, Copy, Download, Check, Loader2 } from "lucide-react";
import { useState, useEffect,  useMemo } from 'react';

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
  state: string; // The Nigerian State
  updatedAt: string;
  downloadable?: boolean;
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
  const [search, setSearch] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [activePodcast, setActivePodcast] = useState<Podcast | null>(null);
  const itemsPerPage = 6;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
    "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
  ];

  useEffect(() => {
    fetch(`${CLIENT_KEY}api/galleries`)
      .then(res => res.json())
      .then((data: any[]) => {
        const hero = data.find(item => item.purpose === "Other Page" && item.subPurpose === "Podcasts");
        if (hero) setHeroData(hero);
      })
      .finally(() => setLoadingHero(false));

    fetch(`${CLIENT_KEY}api/podcasts`)
      .then(res => res.json())
      .then(data => setPodcasts(Array.isArray(data) ? data : (data.data || [])))
      .catch(err => console.error("Podcast Fetch Error:", err))
      .finally(() => setLoadingPodcasts(false));
  }, [CLIENT_KEY]);

  // Local Filtering Logic
  const filteredPodcasts = useMemo(() => {
    return podcasts.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = levelFilter === 'All' || item.cefrLevel === levelFilter;
      const matchesMedia = mediaFilter === 'All' || item.mediaType.toLowerCase() === mediaFilter.toLowerCase();
      const matchesState = stateFilter === 'All' || item.state === stateFilter;
      const matchesTopic = topicFilter === 'All' || item.topic === topicFilter;

      return matchesSearch && matchesLevel && matchesMedia && matchesState && matchesTopic;
    });
  }, [podcasts, search, levelFilter, mediaFilter, stateFilter, topicFilter]);

  const currentPodcasts = filteredPodcasts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPodcasts.length / itemsPerPage);

  const handleCopyTranscript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    document.body.style.overflow = activePodcast ? "hidden" : "unset";
  }, [activePodcast]);

  return (
    <main className="pt-20 bg-gray-50/50 min-h-screen relative">
      {/* Original Cover Section Untouched */}
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

      {/* Filters and Content */}
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
            <select className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
              <option value="All">All Topics</option>
              {['Pronunciation', 'Grammar', 'Conversation', 'Culture', 'Basics', 'Node.js'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="All">All States (Nigeria)</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['All', 'Audio', 'Video'].map(m => (
                <button key={m} onClick={() => setMediaFilter(m)} className={`flex-1 rounded-lg text-xs font-bold transition-all ${mediaFilter === m ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-500'}`}>{m}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t border-gray-100 overflow-x-auto no-scrollbar">
            {['All', 'A1', 'A2', 'B1', 'B2', 'C1'].map(lvl => (
              <button key={lvl} onClick={() => setLevelFilter(lvl)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${levelFilter === lvl ? 'bg-blue-800 border-blue-800 text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{lvl}</button>
            ))}
          </div>
        </div>

        {loadingPodcasts ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-600" size={48}/></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPodcasts.map((item) => (
                <div key={item.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full overflow-hidden">
                  <div className="relative aspect-video bg-slate-900">
                    {item.mediaType === 'video' ? (
                      <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeID(item.videoUrl)}`} title={item.title} frameBorder="0" allowFullScreen loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 relative">
                        <PlayCircle className="text-white fill-blue-600 cursor-pointer hover:scale-110 transition-transform" size={50} onClick={() => setActivePodcast(item)} />
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">{item.cefrLevel}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{item.topic}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow">{item.description}</p>
                    
                    <div className="mb-6 py-4 border-y border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase">
                       <span className="flex items-center gap-1"><MapPin size={12} className="text-blue-500"/> {item.state}</span>
                       <span className="flex items-center gap-1"><User size={12}/> {item.audience}</span>
                    </div>

                    <button onClick={() => setActivePodcast(item)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                      Listen & View Transcript
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-gray-50 transition-all shadow-sm">
                  <ChevronLeft size={20} />
                </button>
                <p className="text-xs font-black text-gray-400 uppercase">Page {currentPage} of {totalPages}</p>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-gray-50 transition-all shadow-sm">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full-Screen Immersive Modal */}
      {activePodcast && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto flex flex-col" onClick={() => setActivePodcast(null)}>
          <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b p-6 md:p-10 flex justify-between items-center z-50">
            <button onClick={() => setActivePodcast(null)} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase">Back to Podcasts</span>
            </button>
            <div className="flex gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); handleCopyTranscript(activePodcast.transcript); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-[10px] font-black uppercase hover:bg-gray-200"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={() => setActivePodcast(null)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"><X size={24} /></button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12" onClick={e => e.stopPropagation()}>
            <div className="space-y-8">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg">{activePodcast.state}</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-lg">{activePodcast.cefrLevel}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-serif text-slate-900 leading-tight">{activePodcast.title}</h2>
              <div className="flex flex-wrap gap-6 py-4 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-blue-600"/> {activePodcast.state}, Nigeria</span>
                <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(activePodcast.updatedAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><Layers size={14}/> ID: {activePodcast.id}</span>
              </div>

              {activePodcast.mediaType === 'audio' && (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-white/10 rounded-2xl"><Headphones className="text-white" size={30}/></div>
                     <p className="text-white font-bold">{activePodcast.title}</p>
                  </div>
                  <audio src={activePodcast.audioUrl} controls className="w-full md:w-auto" />
                  {activePodcast.audioUrl && (
                    <a href={activePodcast.audioUrl} download className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all"><Download size={20}/></a>
                  )}
                </div>
              )}

              <div className="prose prose-lg max-w-none pt-10">
                <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-6">Full Transcript</h4>
                <div className="text-gray-600 leading-[1.8] text-lg whitespace-pre-wrap italic bg-gray-50 p-8 rounded-[2rem]">
                  {activePodcast.transcript}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Podcast;