import { useState, useEffect, useMemo } from "react";
import {
  SplitSquareHorizontal,
  ArrowRight,
  PlayCircle,
  Book,
  PenTool,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Search,
  Trophy,
  AlertCircle,
} from "lucide-react";

// --- Interfaces ---
interface RawQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // JSON: 1=A, 2=B, 3=C, 4=D
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string;
  /* difficulty: string; */
  publishedAt: string | null;
  content: RawQuestion[];
}

interface DetailedExercise extends Exercise {}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function Activities() {
  const [exercisesMap, setExercisesMap] = useState<Record<number, DetailedExercise>>({});
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [selectedEx, setSelectedEx] = useState<DetailedExercise | null>(null);
  const [modalStage, setModalStage] = useState<'info' | 'test' | 'result'>('info');
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>("All");
 /*  const [activeDifficulty, setActiveDifficulty] = useState<string>("All"); */
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  const exercisesPerPage = 8;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  useEffect(() => {
    document.body.style.overflow = (selectedEx || fetchError) ? 'hidden' : 'unset';
  }, [selectedEx, fetchError]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, exRes] = await Promise.all([
          fetch(`${CLIENT_KEY}api/galleries`),
          fetch(`${CLIENT_KEY}api/exercises`)
        ]);
        
        const heroJson = await heroRes.json();
        const exJson = await exRes.json();

        const matchingHero = (heroJson.data || heroJson).find((item: any) => 
          (item.attributes?.purpose || item.purpose) === "Other Page" && 
          (item.attributes?.subPurpose || item.subPurpose) === "Activities"
        );
        if (matchingHero) setHeroData(matchingHero.attributes || matchingHero);

        const rawExercises = Array.isArray(exJson) ? exJson : (exJson.data || []);
        const tempMap: Record<number, DetailedExercise> = {};
        
        rawExercises.forEach((item: any) => {
          const data = item.attributes ? { id: item.id, ...item.attributes } : item;
          let parsedContent: RawQuestion[] = [];
          if (data.content) {
            const rawContent = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
            
            // CORRECTED INDEXING: Subtract 1 because 1=A (index 0), 2=B (index 1), etc.
            parsedContent = rawContent.map((q: RawQuestion) => ({
              ...q,
              correctAnswer: Number(q.correctAnswer) - 1
            }));
          }
          tempMap[data.id] = { ...data, content: parsedContent };
        });

        setExercisesMap(tempMap);
        setExercisesList(Object.values(tempMap));
      } catch (err) {
        setFetchError("Failed to load activities from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [CLIENT_KEY]);

  const typeOptions = useMemo(() => {
    const types = new Set(exercisesList.map(ex => ex.exerciseType).filter(Boolean));
    return ["All", ...Array.from(types)];
  }, [exercisesList]);

  /* const difficultyOptions = useMemo(() => {
    const diffs = new Set(exercisesList.map(ex => ex.difficulty).filter(Boolean));
    return ["All", ...Array.from(diffs)];
  }, [exercisesList]); */

  const handleOpenExercise = (id: number) => {
    const activity = exercisesMap[id];
    if (activity) {
      setSelectedEx(activity);
      setModalStage('info');
      setUserAnswers({});
    }
  };

  const filteredExercises = useMemo(() => {
    return exercisesList.filter((ex) => {
      const matchesSearch = ex.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === "All" || ex.exerciseType === activeType;
      /* const matchesDiff = activeDifficulty === "All" || ex.difficulty === activeDifficulty; */
      return matchesSearch && matchesType 
    });
  }, [exercisesList, searchQuery, activeType]);

  const currentExercises = filteredExercises.slice((currentPage - 1) * exercisesPerPage, currentPage * exercisesPerPage);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const score = useMemo(() => {
    if (!selectedEx || modalStage !== 'result') return 0;
    return selectedEx.content.reduce((acc, q, idx) => {
      return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
    }, 0);
  }, [selectedEx, modalStage, userAnswers]);

  // REDUCED ICON SIZES
  const getIcon = (type: string, size: number = 20) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('mcq')) return <PlayCircle size={size} />;
    if (t.includes('gap')) return <PenTool size={size} />;
    return <Book size={size} />;
  };

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen">
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {heroData && (
          <>
            <img src={heroData.mediaUrl} className="absolute inset-0 w-full h-full object-cover z-0" alt="Hero" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/40 to-red-700/60" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <div className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                <SplitSquareHorizontal size={16} />
                <p className="text-xs font-bold uppercase tracking-wider">Interactive Learning</p>
              </div>
              <h1 className="text-white text-4xl md:text-6xl font-bold font-serif leading-tight max-w-3xl">{heroData.title}</h1>
              <p className="text-white text-lg max-w-xl opacity-90">{heroData.description}</p>
            </div>
          </>
        )}
      </div>

      <section className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
        {/* FILTER BAR */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-12 flex flex-col items-center justify-center lg:flex-row lg:gap-6 lg:items-end">
          <div className="flex-1 w-full">
            <p className="text-[10px] font-black uppercase text-blue-600 mb-2 ml-1">Search Activity</p>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search..." className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-gray-50 outline-none text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:flex sm:justify-center sm:items-center sm:flex-row">
            {typeOptions.map((t) => (
              <button key={t} onClick={() => {setActiveType(t); setCurrentPage(1);}} className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeType === t ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-400"}`}>{t}</button>
            ))}
          </div>
          {/* <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((d) => (
              <button key={d} onClick={() => {setActiveDifficulty(d); setCurrentPage(1);}} className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeDifficulty === d ? "bg-red-600 text-white shadow-md" : "bg-gray-100 text-gray-400"}`}>{d}</button>
            ))}
          </div> */}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
          ) : currentExercises.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                {getIcon(item.exerciseType, 20)}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-gray-500 text-xs line-clamp-2 mb-6">{item.description}</p>
              <button onClick={() => handleOpenExercise(item.id)} className="flex items-center gap-2 font-bold text-blue-700 mt-auto text-sm group/btn">
                Start <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-8">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-white rounded-xl border disabled:opacity-20"><ChevronLeft size={20} /></button>
            <span className="font-bold text-gray-500 bg-white px-5 py-2.5 rounded-xl border text-sm">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-white rounded-xl border disabled:opacity-20"><ChevronRight size={20} /></button>
          </div>
        )}
      </section>

      {/* EXERCISE MODAL */}
      {(selectedEx || fetchError) && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-xl flex justify-center items-center p-4">
          <div className="fixed inset-0" onClick={() => {setSelectedEx(null); setFetchError(null);}} />
          
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <button 
              onClick={() => {setSelectedEx(null); setFetchError(null);}} 
              className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-900 rounded-full transition-all z-50"
            >
              <X size={20} strokeWidth={3} />
            </button>

            <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
              {fetchError ? (
                <div className="text-center py-10">
                  <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                  <h2 className="text-xl font-bold mb-2">Error</h2>
                  <p className="text-gray-500 mb-8">{fetchError}</p>
                  <button onClick={() => setFetchError(null)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold">Dismiss</button>
                </div>
              ) : selectedEx && (
                <>
                  {modalStage === 'info' && (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        {getIcon(selectedEx.exerciseType, 32)}
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedEx.title}</h2>
                      <div className="bg-gray-50 rounded-2xl p-6 mb-10">
                        <p className="text-gray-700 text-base leading-relaxed">{selectedEx.description}</p>
                      </div>
                      <button onClick={() => setModalStage('test')} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors">
                        Start Test <ArrowRight size={20} />
                      </button>
                    </div>
                  )}

                  {modalStage === 'test' && (
                    <div className="space-y-6 pt-2">
                      <h2 className="text-xl font-black text-slate-800 border-b pb-4">{selectedEx.title}</h2>
                      {selectedEx.content.map((q, idx) => (
                        <div key={idx} className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
                          <p className="font-bold text-lg mb-4 flex gap-3">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0">{idx + 1}</span>
                            {q.question}
                          </p>
                          <div className="grid grid-cols-1 gap-3">
                            {q.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: i }))}
                                className={`px-6 py-4 border-2 rounded-2xl text-left font-bold transition-all flex items-center gap-4 ${
                                  userAnswers[idx] === i ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-100 hover:border-blue-400"
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border ${userAnswers[idx] === i ? 'bg-white/20 border-white/30' : 'bg-gray-100'}`}>
                                  {i + 1}
                                </span>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setModalStage('result')} 
                        disabled={Object.keys(userAnswers).length !== selectedEx.content.length}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-50 hover:bg-slate-800 transition-colors"
                      >
                        Check My Score
                      </button>
                    </div>
                  )}

                  {modalStage === 'result' && (
                    <div className="space-y-6 pt-2">
                      <div className="bg-blue-600 rounded-3xl p-8 text-white text-center shadow-xl">
                        <Trophy size={48} className="mx-auto mb-3 animate-bounce" />
                        <p className="uppercase tracking-widest font-bold text-[10px] mb-1 opacity-80">Final Results</p>
                        <h3 className="text-4xl font-black">{score} / {selectedEx.content.length}</h3>
                      </div>
                      {selectedEx.content.map((q, idx) => (
                        <div key={idx} className={`p-6 rounded-3xl border-2 ${userAnswers[idx] === q.correctAnswer ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                          <p className="font-bold text-base mb-2">{idx + 1}. {q.question}</p>
                          <p className={`text-sm font-bold flex gap-2 ${userAnswers[idx] === q.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                            <span className="opacity-60 text-[10px] uppercase">Your Pick ({userAnswers[idx] + 1}):</span> {q.options[userAnswers[idx]]}
                          </p>
                          {userAnswers[idx] !== q.correctAnswer && (
                            <p className="text-sm text-slate-600 mt-1 flex gap-2">
                              <span className="opacity-60 text-[10px] uppercase">Correct ({q.correctAnswer + 1}):</span> {q.options[q.correctAnswer]}
                            </p>
                          )}
                        </div>
                      ))}
                      <button onClick={() => setSelectedEx(null)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-colors">Return to Activities</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STYLES FOR SCROLLER */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </main>
  );
}

export default Activities;