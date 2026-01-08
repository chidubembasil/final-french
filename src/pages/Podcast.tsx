import { Headphones, Search, X, PlayCircle, Music, ChevronLeft, ChevronRight, MapPin, Film, Clock, Users, Download, Lock } from "lucide-react";
import pic from "../assets/img/_A1A4703.jpg";
import { useState, useEffect, useMemo } from 'react';

// --- Types ---
interface Podcast {
  id: number;
  title: string;
  slug: string;
  description: string;
  mediaType: 'audio' | 'video';
  audioUrl: string;
  videoUrl: string;
  duration: number; // Duration in seconds
  transcript: string;
  topic: string;
  cefrLevel: string;
  audience: string;
  state: string;
  downloadable: boolean;
}

// --- Constants ---
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

const TOPICS = ['Pronunciation', 'Grammar', 'Conversation', 'Culture', 'Basics'];
const AUDIENCES = ['Beginners', 'Intermediate', 'Advanced', 'All'];

function Podcast() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // --- Filter States ---
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [mediaFilter, setMediaFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [audienceFilter, setAudienceFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [activePodcast, setActivePodcast] = useState<Podcast | null>(null);

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // --- Helpers ---
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = (e: React.MouseEvent, url: string, filename: string) => {
    e.stopPropagation(); // Stop card click (modal) from opening
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Fetch Data ---
  useEffect(() => {
    fetch(`${CLIENT_KEY}api/podcasts`)
      .then((res) => res.json())
      .then((data: Podcast[]) => {
        setPodcasts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [CLIENT_KEY]);

  // --- Filtering Logic ---
  const filteredItems = useMemo(() => {
    return podcasts.filter((p) => {
      const matchesLevel = levelFilter === 'All' || p.cefrLevel === levelFilter;
      const matchesMedia = mediaFilter === 'All' || p.mediaType === mediaFilter.toLowerCase();
      const matchesState = stateFilter === 'All' || p.state === stateFilter;
      const matchesTopic = topicFilter === 'All' || p.topic.toLowerCase() === topicFilter.toLowerCase();
      const matchesAudience = audienceFilter === 'All' || p.audience.toLowerCase() === audienceFilter.toLowerCase();
      const matchesSearch = 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.topic.toLowerCase().includes(search.toLowerCase());

      return matchesLevel && matchesMedia && matchesState && matchesTopic && matchesAudience && matchesSearch;
    });
  }, [podcasts, levelFilter, mediaFilter, stateFilter, topicFilter, audienceFilter, search]);

  // Reset page to 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [levelFilter, mediaFilter, stateFilter, topicFilter, audienceFilter, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentPodcasts = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 700, behavior: 'smooth' });
  };

  return (
    <main className="pt-20 bg-gray-50/50 min-h-screen relative">
      {/* Hero Section - Exactly as originally provided */}
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
        {/* --- Multi-Filter Navigation --- */}
        <div className="flex flex-col gap-6 mb-12 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search podcasts..." 
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Topic Dropdown */}
            <select 
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-600 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="All">All Topics</option>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Audience Dropdown */}
            <select 
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-600 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setAudienceFilter(e.target.value)}
            >
              <option value="All">All Audiences</option>
              {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            {/* State Dropdown */}
            <select 
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-600 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="All">All States</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
             {/* Media Type Toggle */}
             <div className="flex bg-gray-100 p-1 rounded-xl">
                {['All', 'Audio', 'Video'].map(m => (
                  <button key={m} onClick={() => setMediaFilter(m)} className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${mediaFilter === m ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {m}
                  </button>
                ))}
             </div>
             {/* Level Chips */}
             <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['All', 'A1', 'A2', 'B1', 'B2'].map(lvl => (
                  <button key={lvl} onClick={() => setLevelFilter(lvl)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${levelFilter === lvl ? 'bg-blue-800 border-blue-800 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                    {lvl}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* --- Main Podcast Grid --- */}
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
                  className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer"
                  onClick={() => setActivePodcast(item)}
                >
                  {/* Thumbnail Area */}
                  <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                      {item.mediaType === 'video' ? '📺' : '🎙️'}
                    </span>
                    
                    {/* Media Type & Duration Overlays */}
                    <div className="absolute top-4 left-4 flex gap-2 z-20">
                      <span className="bg-white/90 backdrop-blur text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm uppercase">
                        {item.mediaType === 'video' ? <Film size={12}/> : <Music size={12}/>} {item.mediaType}
                      </span>
                      <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Clock size={12}/> {formatDuration(item.duration)}
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4 z-20">
                      <PlayCircle className="text-white fill-blue-600 shadow-lg" size={40} />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">{item.cefrLevel}</span>
                      <span className="bg-orange-50 text-orange-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-orange-100">{item.topic}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-6 flex-grow">{item.description}</p>

                    {/* Conditional Download Action */}
                    <div className="mb-6">
                      {item.downloadable ? (
                        <button 
                          onClick={(e) => handleDownload(e, item.mediaType === 'video' ? item.videoUrl : item.audioUrl, item.title)}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all hover:shadow-lg active:scale-[0.98]"
                        >
                          <Download size={14} /> Download {item.mediaType === 'video' ? 'Video' : 'Audio'}
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-400 rounded-2xl text-xs font-bold cursor-not-allowed border border-dashed border-gray-300">
                          <Lock size={14} /> Stream Only
                        </div>
                      )}
                    </div>

                    {/* Meta Detail Footer */}
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-blue-500" />
                        <span className="text-[11px] font-bold uppercase tracking-tighter text-gray-600">{item.audience}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-red-500" />
                        <span className="text-[11px] font-bold uppercase tracking-tighter text-gray-600">{item.state}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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

      {/* --- Overlay Player Modal --- */}
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
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    {activePodcast.topic} • {activePodcast.cefrLevel} • {activePodcast.state}
                  </p>
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
            <div className="p-8 bg-white max-h-40 overflow-y-auto border-t">
              <h4 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tighter">Transcript / Notes</h4>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{activePodcast.transcript}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Podcast;