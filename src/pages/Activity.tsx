import { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowRight,
  PlayCircle,
  Book,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Search,
  Trophy,
  Volume2,
  Layers,
  User
} from "lucide-react";
import img1 from "../assets/img/_A1A4707.jpg";

// --- Interfaces ---
interface RawQuestion { 
  question: string; 
  options: string[]; 
  correctAnswer: number; 
}

interface Exercise { 
  id: number; 
  title: string; 
  description: string; 
  exerciseType: string; 
  difficulty: string; 
  audience: string; 
  mediaUrl?: string; 
  publishedAt: string | null; 
  content: RawQuestion[] | string;
  podcastId?: number | null; 
}

interface PodcastMedia {
  id: number;
  mediaUrl: string;
}

interface H5PContent {
  id: number;
  title: string;
  description: string;
  embedCode: string;
  difficulty: string;
  audience: string;
  mediaUrl?: string;
  exerciseType?: string;
}

// --- Fallback Constants ---
const MOCK_HERO = {
  title: "Master Your Skills",
  description: "Engage with our interactive French language exercises designed to improve linguistic precision.",
  mediaUrl: img1,
};

const extractH5PUrl = (embedCode: string): string | null => {
  const match = embedCode.match(/src=["']([^"']+)["']/);
  return match ? match[1] : null;
};

const isH5PContent = (content: any): boolean => {
  if (typeof content !== 'string') return false;
  return content.includes('h5p.com') || content.includes('<iframe');
};

function Activities() {
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [podcastsMap, setPodcastsMap] = useState<Record<number, PodcastMedia>>({});
  const [heroData, setHeroData] = useState<any>(MOCK_HERO);
  const [h5pContents, setH5pContents] = useState<H5PContent[]>([]);
  
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
  const [selectedH5P, setSelectedH5P] = useState<H5PContent | null>(null);
  const [modalStage, setModalStage] = useState<'info' | 'test' | 'result'>('info');
  const [loading, setLoading] = useState(true);
  
  const [activeAudience, setActiveAudience] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [mcqPage, setMcqPage] = useState(1);
  const [h5pPage, setH5pPage] = useState(1);
  const [testPage, setTestPage] = useState(0); 

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;
  const questionsPerPage = 5; 
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  useEffect(() => {
    const isModalOpen = !!(selectedEx || selectedH5P);
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedEx, selectedH5P]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, exRes, h5pRes, podRes] = await Promise.all([
          fetch(`${CLIENT_KEY}/api/galleries`),
          fetch(`${CLIENT_KEY}/api/exercises`),
          fetch(`${CLIENT_KEY}/api/exercise-resources`),
          fetch(`${CLIENT_KEY}/api/podcasts`),
        ]);

        const heroJson = await heroRes.json();
        const exJson = await exRes.json();
        const h5pJson = await h5pRes.json();
        const podJson = await podRes.json();

        const pMap: Record<number, PodcastMedia> = {};
        (podJson.data || podJson).forEach((p: any) => {
          const attr = p.attributes || p;
          pMap[p.id] = { id: p.id, mediaUrl: attr.mediaUrl };
        });
        setPodcastsMap(pMap);

        const tempExList: Exercise[] = [];
        const tempH5PList: H5PContent[] = [];

        (exJson.data || exJson).forEach((item: any) => {
          const data = item.attributes || item;
          const contentStr = typeof data.content === "string" ? data.content : JSON.stringify(data.content);
          if (contentStr && !isH5PContent(contentStr)) {
            let parsedContent = [];
            try { parsedContent = JSON.parse(contentStr); } catch(e) { parsedContent = []; }
            tempExList.push({
              id: item.id,
              title: data.title || "",
              description: data.description || "",
              exerciseType: data.exerciseType || "mcq",
              difficulty: data.difficulty || "Beginners",
              audience: data.audience || "Student",
              mediaUrl: data.exerciseImage || data.mediaUrl,
              podcastId: data.podcastId,
              publishedAt: data.publishedAt,
              content: Array.isArray(parsedContent) ? parsedContent.map((q: any) => ({
                ...q,
                correctAnswer: Number(q.correctAnswer) - 1
              })) : []
            });
          }
        });

        (h5pJson.data || h5pJson).forEach((item: any) => {
          const data = item.attributes || item;
          if (isH5PContent(data.content)) {
            tempH5PList.push({
              id: item.id,
              title: data.title || "Interactive",
              description: data.description || "",
              embedCode: data.content,
              difficulty: data.difficulty || "Beginners",
              audience: data.audience || "Student",
              mediaUrl: data.mediaUrl,
              exerciseType: "H5P"
            });
          }
        });

        setExercisesList(tempExList);
        setH5pContents(tempH5PList);
        
        const heroArray = heroJson.data || heroJson;
        const match = heroArray.find((i: any) => (i.attributes?.subPurpose || i.subPurpose) === "Activities");
        if (match) setHeroData(match.attributes || match);

      } catch (err) {
        console.warn("API Error - Fallback to UI defaults");
      } finally { setLoading(false); }
    };
    fetchData();
  }, [CLIENT_KEY]);

  const filteredExercises = useMemo(() => {
    return exercisesList.filter(ex => 
      ex.title?.toLowerCase().includes(searchQuery.toLowerCase()) && 
      (activeAudience ? ex.audience?.toLowerCase() === activeAudience.toLowerCase() : true) &&
      (activeDifficulty !== "All" ? ex.difficulty === activeDifficulty : true)
    );
  }, [exercisesList, searchQuery, activeAudience, activeDifficulty]);

  const filteredH5P = useMemo(() => {
    return h5pContents.filter(h5p => 
      h5p.title?.toLowerCase().includes(searchQuery.toLowerCase()) && 
      (activeAudience ? h5p.audience?.toLowerCase() === activeAudience.toLowerCase() : true) &&
      (activeDifficulty !== "All" ? h5p.difficulty === activeDifficulty : true)
    );
  }, [h5pContents, searchQuery, activeAudience, activeDifficulty]);

  const currentExercises = filteredExercises.slice((mcqPage - 1) * itemsPerPage, mcqPage * itemsPerPage);
  const currentH5P = filteredH5P.slice((h5pPage - 1) * itemsPerPage, h5pPage * itemsPerPage);
  const totalMcqPages = Math.ceil(filteredExercises.length / itemsPerPage);
  const totalH5pPages = Math.ceil(filteredH5P.length / itemsPerPage);

  const score = useMemo(() => {
    if (!selectedEx || modalStage !== "result") return 0;
    const content = selectedEx.content as RawQuestion[];
    return content.reduce((acc, q, idx) => userAnswers[idx] === q.correctAnswer ? acc + 1 : acc, 0);
  }, [selectedEx, modalStage, userAnswers]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Workspace...</p>
      </div>
    );
  }

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen w-full overflow-y-auto">
      {/* Hero Section */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        <img src={heroData?.mediaUrl || MOCK_HERO.mediaUrl} className="absolute inset-0 w-full h-full object-cover z-0 opacity-70" alt="Hero" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-end px-8 md:px-24 pb-24 max-w-7xl mx-auto">
           <h1 className="text-white text-5xl md:text-8xl font-black mb-6 tracking-tighter max-w-4xl">{heroData?.title || MOCK_HERO.title}</h1>
           <p className="text-white/80 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">{heroData?.description || MOCK_HERO.description}</p>
        </div>
      </div>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-gray-100 mb-20 flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search activities..." className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-gray-50 outline-none text-sm font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex p-1.5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
              {["Student", "Teacher"].map(role => (
                <button key={role} onClick={() => { setActiveAudience(role); setMcqPage(1); setH5pPage(1); }} className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAudience === role ? "bg-white text-blue-600 shadow-md" : "text-gray-400 hover:text-gray-600"}`}>{role}</button>
              ))}
            </div>
          </div>
          {activeAudience && (
            <div className="flex flex-wrap gap-3 pt-8 border-t border-gray-100">
              {["All", "Beginners", "Intermediate", "Advanced"].map(d => (
                <button key={d} onClick={() => { setActiveDifficulty(d); setMcqPage(1); setH5pPage(1); }} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase border transition-all ${activeDifficulty === d ? "bg-slate-900 border-slate-900 text-white shadow-xl" : "bg-white border-gray-200 text-gray-500 hover:border-blue-400"}`}>{d}</button>
              ))}
            </div>
          )}
        </div>

        {/* 1. Language Exercises Section (Main) */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Language Exercises</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Skill Evaluation</p>
            </div>
            {totalMcqPages > 1 && (
                <div className="flex gap-3">
                  <button aria-label="something" disabled={mcqPage === 1} onClick={() => setMcqPage(p => p - 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all"><ChevronLeft size={24}/></button>
                  <button aria-label="something" disabled={mcqPage === totalMcqPages} onClick={() => setMcqPage(p => p + 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all"><ChevronRight size={24}/></button>
                </div>
              )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {currentExercises.map(ex => (
              <div key={ex.id} className="group bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    {ex.podcastId ? <Volume2 size={32}/> : <Book size={32}/>}
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-blue-100">{ex.exerciseType}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors tracking-tight">{ex.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-10 leading-relaxed font-medium">{ex.description}</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between pt-8 border-t border-gray-50 mb-10">
                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Layers size={16} className="text-blue-400"/> {ex.difficulty}</span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><User size={16}/> {ex.audience}</span>
                  </div>
                  <button onClick={() => { setSelectedEx(ex); setModalStage('info'); setUserAnswers({}); setTestPage(0); }} className="w-full py-6 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-4 hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95">
                    {ex.podcastId ? "Listen & Solve" : "Begin Quiz"} <ArrowRight size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Interactive Modules Section (More Exercises) */}
        {filteredH5P.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Interactive Modules</h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">H5P Learning Content</p>
              </div>
              {totalH5pPages > 1 && (
                <div className="flex gap-3">
                  <button aria-label="something" disabled={h5pPage === 1} onClick={() => setH5pPage(p => p - 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all"><ChevronLeft size={24}/></button>
                  <button aria-label="something" disabled={h5pPage === totalH5pPages} onClick={() => setH5pPage(p => p + 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all"><ChevronRight size={24}/></button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentH5P.map(h5p => (
                <div key={h5p.id} className="group bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer overflow-hidden flex flex-col" onClick={() => setSelectedH5P(h5p)}>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner">
                      <PlayCircle size={32}/>
                    </div>
                    <span className="bg-purple-50 text-purple-700 text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-purple-100">Interactive</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-purple-600 transition-colors tracking-tight">{h5p.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">{h5p.description}</p>
                  <div className="mt-auto flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-8 border-t border-gray-50">
                    <Layers size={16} className="text-purple-400"/> {h5p.difficulty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- EXERCISE MODAL --- */}
      {selectedEx && (
        <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-xl flex justify-center items-center p-4">
          <div className="relative bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in duration-500">
            <button aria-label="something" onClick={() => setSelectedEx(null)} className="absolute top-10 right-10 z-50 p-5 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><X size={22}/></button>
            <div ref={modalScrollRef} className="overflow-y-auto p-16 custom-scrollbar">
              {modalStage === 'info' && (
                <div className="text-center py-12">
                  <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                    {selectedEx.podcastId ? <Volume2 size={56}/> : <Book size={56}/>}
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">{selectedEx.title}</h2>
                  <p className="text-slate-500 text-xl max-w-xl mx-auto mb-16 leading-relaxed font-medium">{selectedEx.description}</p>
                  <button onClick={() => setModalStage('test')} className="px-16 py-7 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all">Launch Exercise</button>
                </div>
              )}

              {modalStage === 'test' && (
                <div className="space-y-12">
                  {selectedEx.podcastId && podcastsMap[selectedEx.podcastId] && (
                    <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-12 rounded-[4rem] text-white shadow-2xl shadow-blue-200 mb-16">
                      <div className="flex items-center gap-5 mb-8">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                           <Volume2 className="animate-pulse" size={28} />
                        </div>
                        <span className="font-black text-[12px] uppercase tracking-[0.35em] opacity-90">Audio Context</span>
                      </div>
                      <audio controls className="w-full h-16 accent-white bg-white/10 rounded-2xl p-2">
                        <source src={podcastsMap[selectedEx.podcastId].mediaUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  {(selectedEx.content as RawQuestion[]).slice(testPage * questionsPerPage, (testPage + 1) * questionsPerPage).map((q, localIdx) => {
                    const globalIdx = testPage * questionsPerPage + localIdx;
                    return (
                      <div key={globalIdx} className="p-12 rounded-[4rem] bg-gray-50 border border-gray-100 shadow-sm">
                        <h4 className="font-black text-2xl text-slate-900 mb-10 flex gap-6">
                          <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-sm shrink-0 shadow-lg shadow-blue-100">{globalIdx + 1}</span>
                          {q.question}
                        </h4>
                        <div className="grid gap-5">
                          {q.options.map((opt, i) => (
                            <button key={i} onClick={() => setUserAnswers(prev => ({ ...prev, [globalIdx]: i }))}
                              className={`p-8 rounded-3xl border-3 text-left font-bold transition-all flex items-center gap-6 ${userAnswers[globalIdx] === i ? "bg-white border-blue-600 text-blue-700 shadow-2xl" : "bg-white border-transparent hover:border-gray-200"}`}
                            >
                              <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[12px] font-black ${userAnswers[globalIdx] === i ? "border-blue-600 bg-blue-600 text-white" : "border-gray-100 text-gray-300"}`}>{String.fromCharCode(65 + i)}</span>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex gap-6 pt-10">
                    {testPage > 0 && <button onClick={() => setTestPage(p => p - 1)} className="flex-1 py-7 bg-gray-100 rounded-3xl font-black uppercase text-[12px] tracking-widest hover:bg-gray-200 transition-all">Go Back</button>}
                    {(testPage + 1) * questionsPerPage < (selectedEx.content as RawQuestion[]).length ? (
                      <button onClick={() => { setTestPage(p => p + 1); modalScrollRef.current?.scrollTo(0,0); }} className="flex-1 py-7 bg-blue-600 text-white rounded-3xl font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700">Next</button>
                    ) : (
                      <button onClick={() => setModalStage('result')} className="flex-1 py-7 bg-slate-900 text-white rounded-3xl font-black uppercase text-[12px] tracking-widest shadow-xl shadow-slate-200 hover:bg-black">Submit Answers</button>
                    )}
                  </div>
                </div>
              )}

              {modalStage === 'result' && (
                <div className="text-center py-20 space-y-12">
                   <div className="w-40 h-40 bg-yellow-400 text-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-yellow-200 animate-bounce">
                     <Trophy size={80} />
                   </div>
                   <div>
                     <h3 className="text-8xl font-black text-slate-900 mb-4">{Math.round((score / (selectedEx.content as RawQuestion[]).length) * 100)}%</h3>
                     <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[12px]">Achieved {score} / {(selectedEx.content as RawQuestion[]).length} Correct</p>
                   </div>
                   <button onClick={() => setSelectedEx(null)} className="w-full py-8 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest text-[12px] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all">Return to Dashboard</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- H5P MODAL --- */}
      {selectedH5P && (
        <div className="fixed inset-0 z-[999] bg-slate-900/95 backdrop-blur-2xl flex justify-center items-center p-4">
          <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[4rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-500">
             <div className="flex items-center justify-between p-12 border-b border-gray-50 bg-white">
                <div>
                  <h3 className="font-black text-3xl text-slate-900 tracking-tight">{selectedH5P.title}</h3>
                  <p className="text-[11px] font-black text-purple-600 uppercase tracking-[0.3em] mt-2">Interactive H5P Module</p>
                </div>
                <button aria-label="something" onClick={() => setSelectedH5P(null)} className="p-5 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                  <X size={24}/>
                </button>
             </div>
             <div className="flex-1 bg-gray-100 p-8">
                <iframe 
                  src={extractH5PUrl(selectedH5P.embedCode)!} 
                  className="w-full h-full rounded-[3rem] border-none shadow-2xl bg-white" 
                  allowFullScreen 
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
             </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 4px solid transparent; }
      `}</style>
    </main>
  );
}

export default Activities;