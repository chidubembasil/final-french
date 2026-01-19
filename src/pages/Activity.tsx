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
  Check,
  Trophy,
  AlertCircle
} from "lucide-react";

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
  publishedAt: string | null;
}

interface DetailedExercise extends Exercise {
  content: RawQuestion[]; 
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function Activities() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [selectedEx, setSelectedEx] = useState<DetailedExercise | null>(null);
  const [modalStage, setModalStage] = useState<'info' | 'test'>('info');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingHero, setLoadingHero] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [activeType, setActiveType] = useState<string>("All");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 8;
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // 1. Load List View
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, exRes] = await Promise.all([
          fetch(`${CLIENT_KEY}api/galleries`),
          fetch(`${CLIENT_KEY}api/exercises`)
        ]);
        const heroJson = await heroRes.json();
        const exJson = await exRes.json();

        const matchingHero = heroJson.find((item: any) => 
          item.purpose === "Other Page" && item.subPurpose === "Activities"
        );
        if (matchingHero) setHeroData(matchingHero);

        // Normalize Strapi array response
        const rawExercises = Array.isArray(exJson) ? exJson : (exJson.data || []);
        setExercises(rawExercises.map((item: any) => ({
            id: item.id,
            ...(item.attributes || item)
        })));
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoadingHero(false);
        setLoading(false);
      }
    };
    fetchData();
  }, [CLIENT_KEY]);

  // 2. Load Single Exercise (Corrects the 404/Parsing issues)
  const handleOpenExercise = async (id: number) => {
    setIsPopupLoading(true);
    setFetchError(null);
    setModalStage('info');
    setSubmitted(false);
    setUserAnswers({});
    
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${id}`);
      
      if (!res.ok) {
        throw new Error(`Exercise ${id} not found (404). Check if it's published.`);
      }

      const json = await res.json();
      const rawData = json.data || json;
      
      // Flatten Strapi v4 attributes if they exist
      const data = rawData.attributes ? { id: rawData.id, ...rawData.attributes } : rawData;

      let parsedContent: RawQuestion[] = [];
      if (data.content) {
        try {
          parsedContent = typeof data.content === 'string' 
            ? JSON.parse(data.content) 
            : data.content;
        } catch (e) {
          console.error("JSON Parsing failed for exercise content", e);
        }
      }

      setSelectedEx({ ...data, content: parsedContent });
    } catch (err: any) {
      setFetchError(err.message || "Failed to load activity");
      console.error("Detail Fetch Error:", err);
    } finally {
      setIsPopupLoading(false);
    }
  };

  // 3. Logic & Filtering
  const score = useMemo(() => {
    if (!selectedEx || !submitted) return 0;
    return selectedEx.content.reduce((acc, q, idx) => {
      return userAnswers[idx] === q.options[q.correctAnswer] ? acc + 1 : acc;
    }, 0);
  }, [selectedEx, submitted, userAnswers]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === "All" || ex.exerciseType?.toLowerCase() === activeType.toLowerCase().replace(/ /g, '');
      const matchesDiff = activeDifficulty === "All" || ex.difficulty?.toLowerCase() === activeDifficulty.toLowerCase();
      return matchesSearch && matchesType && matchesDiff;
    });
  }, [exercises, searchQuery, activeType, activeDifficulty]);

  const currentExercises = filteredExercises.slice((currentPage - 1) * exercisesPerPage, currentPage * exercisesPerPage);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const getIcon = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('mcq')) return <PlayCircle size={32} />;
    if (t.includes('gap')) return <PenTool size={32} />;
    return <Book size={32} />;
  };

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen">
      {/* HERO SECTION */}
      <div className="relative w-full h-[70dvh] overflow-hidden bg-slate-900">
        {!loadingHero && heroData && (
          <>
            <img src={heroData.mediaUrl} className="absolute inset-0 w-full h-full object-cover z-0" alt="Hero" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/40 to-red-700/60" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
               <div className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                <SplitSquareHorizontal size={17} />
                <p className="text-sm font-bold uppercase tracking-wider">Interactive Learning</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif leading-tight">{heroData.title}</h1>
              <p className="text-white text-xl max-w-xl opacity-90">{heroData.description}</p>
            </div>
          </>
        )}
      </div>

      <section className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
        {/* FILTER BAR */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12 flex flex-col lg:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <p className="text-[10px] font-black uppercase text-blue-600 mb-2 ml-1">Search Activity</p>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600 shadow-inner" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            {["All", "MCQ", "Gap Filling"].map((t) => (
              <button key={t} onClick={() => {setActiveType(t); setCurrentPage(1);}} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeType === t ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}>{t}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {["All", "Beginner", "Advanced"].map((d) => (
              <button key={d} onClick={() => {setActiveDifficulty(d); setCurrentPage(1);}} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeDifficulty === d ? "bg-red-600 text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}>{d}</button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {loading ? (
            <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
          ) : currentExercises.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between transform hover:-translate-y-2">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  {getIcon(item.exerciseType)}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">{item.description}</p>
              </div>
              <button onClick={() => handleOpenExercise(item.id)} className="flex items-center gap-2 font-bold text-blue-700 mt-auto group/btn">
                Start Activity <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-8">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-white rounded-2xl border hover:bg-gray-50 disabled:opacity-20 transition-all shadow-sm"><ChevronLeft /></button>
            <span className="font-bold text-gray-500 bg-white px-6 py-3 rounded-2xl border shadow-sm">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-white rounded-2xl border hover:bg-gray-50 disabled:opacity-20 transition-all shadow-sm"><ChevronRight /></button>
          </div>
        )}
      </section>

      {/* EXERCISE MODAL */}
      {(selectedEx || fetchError) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => {setSelectedEx(null); setFetchError(null);}} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-10 shadow-2xl">
            <button onClick={() => {setSelectedEx(null); setFetchError(null);}} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>

            {fetchError ? (
              <div className="text-center py-10">
                <AlertCircle size={60} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-500 mb-8">{fetchError}</p>
                <button onClick={() => setFetchError(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold">Close</button>
              </div>
            ) : selectedEx && (
              modalStage === 'info' ? (
                <div className="text-center py-4">
                  <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">{getIcon(selectedEx.exerciseType)}</div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">{selectedEx.title}</h2>
                  <p className="text-gray-600 text-lg mb-10 leading-relaxed">{selectedEx.description}</p>
                  <button onClick={() => setModalStage('test')} className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-bold shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all">
                    Proceed to Exercise <ArrowRight size={22} />
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {submitted && (
                    <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white flex items-center justify-between mb-8 shadow-2xl">
                      <div>
                        <h3 className="text-2xl font-bold flex items-center gap-2"><Trophy size={28}/> Well Done!</h3>
                        <p className="opacity-80">Activity completed successfully.</p>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl font-black">{score}</span>
                        <span className="text-xl opacity-60"> / {selectedEx.content.length}</span>
                      </div>
                    </div>
                  )}

                  <div className="border-b pb-6">
                      <h2 className="text-3xl font-bold text-slate-900">{selectedEx.title}</h2>
                      <p className="text-gray-400 mt-1">{submitted ? "Review your results below." : "Carefully select the best answer for each question."}</p>
                  </div>
                  
                  {selectedEx.content.map((q, idx) => (
                    <div key={idx} className={`p-8 rounded-[3rem] border transition-all ${submitted ? "bg-white border-gray-100" : "bg-gray-50 border-transparent shadow-inner"}`}>
                      <p className="font-bold text-xl mb-6 flex gap-4 leading-snug">
                          <span className="bg-blue-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-md">{idx + 1}</span>
                          {q.question}
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt, i) => {
                          const isSelected = userAnswers[idx] === opt;
                          const isCorrect = submitted && i === q.correctAnswer;
                          const isWrong = submitted && isSelected && i !== q.correctAnswer;

                          return (
                            <button
                              key={i}
                              disabled={submitted}
                              onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: opt }))}
                              className={`px-7 py-5 border-2 rounded-[1.8rem] text-left font-bold transition-all relative ${
                                isCorrect ? "bg-green-500 border-green-500 text-white shadow-lg" :
                                isWrong ? "bg-red-500 border-red-500 text-white shadow-lg" :
                                isSelected ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-gray-100 hover:border-blue-400 hover:shadow-md"
                              }`}
                            >
                              {opt}
                              {isCorrect && submitted && <Check className="absolute right-6 top-1/2 -translate-y-1/2" size={24}/>}
                              {isWrong && submitted && <X className="absolute right-6 top-1/2 -translate-y-1/2" size={24}/>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  
                  {!submitted ? (
                    <button onClick={() => setSubmitted(true)} className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-bold hover:bg-green-600 flex items-center justify-center gap-2 transition-all shadow-xl">
                      <Check size={22} /> Finalize and Submit
                    </button>
                  ) : (
                    <button onClick={() => {setSelectedEx(null); setSubmitted(false);}} className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-bold shadow-lg hover:bg-blue-700 transition-all">Back to Activities</button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* GLOBAL LOADING OVERLAY */}
      {isPopupLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={60} />
            <p className="font-bold text-blue-900 animate-pulse">Loading Activity...</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Activities;