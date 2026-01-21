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
  correctAnswer: number;
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string;
  difficulty: string;
  publishedAt: string | null;
  content: RawQuestion[]; // Included in base interface for easy mapping
}

interface DetailedExercise extends Exercise {}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function Activities() {
  // --- State ---
  const [exercisesMap, setExercisesMap] = useState<Record<number, DetailedExercise>>({});
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [selectedEx, setSelectedEx] = useState<DetailedExercise | null>(null);
  const [modalStage, setModalStage] = useState<'info' | 'test' | 'result'>('info');
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>("All");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  const exercisesPerPage = 8;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // --- 1. Fetch and Organize Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, exRes] = await Promise.all([
          fetch(`${CLIENT_KEY}api/galleries`),
          fetch(`${CLIENT_KEY}api/exercises`)
        ]);
        
        const heroJson = await heroRes.json();
        const exJson = await exRes.json();

        // Handle Hero Data
        const matchingHero = (heroJson.data || heroJson).find((item: any) => 
          (item.attributes?.purpose || item.purpose) === "Other Page" && 
          (item.attributes?.subPurpose || item.subPurpose) === "Activities"
        );
        if (matchingHero) {
          setHeroData(matchingHero.attributes || matchingHero);
        }

        // Process Exercises into a Lookup Object
        const rawExercises = Array.isArray(exJson) ? exJson : (exJson.data || []);
        const tempMap: Record<number, DetailedExercise> = {};
        
        rawExercises.forEach((item: any) => {
          const data = item.attributes ? { id: item.id, ...item.attributes } : item;
          
          // Pre-parse the questions (content) so they are ready for the popup
          let parsedContent: RawQuestion[] = [];
          if (data.content) {
            parsedContent = typeof data.content === 'string' 
              ? JSON.parse(data.content) 
              : data.content;
          }

          tempMap[data.id] = { ...data, content: parsedContent };
        });

        setExercisesMap(tempMap);
        setExercisesList(Object.values(tempMap));
      } catch (err) {
        console.error("Fetch Error:", err);
        setFetchError("Failed to load activities from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [CLIENT_KEY]);

  // --- 2. Interaction Handlers ---
  const handleOpenExercise = (id: number) => {
    const activity = exercisesMap[id];
    if (activity) {
      setSelectedEx(activity);
      setModalStage('info');
      setUserAnswers({});
    } else {
      setFetchError("Activity details not found.");
    }
  };

  const handleSubmit = () => {
    if (selectedEx) setModalStage('result');
  };

  // --- 3. Computed Logic (Filtering/Scoring) ---
  const filteredExercises = useMemo(() => {
    return exercisesList.filter((ex) => {
      const matchesSearch = ex.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === "All" || ex.exerciseType?.toLowerCase() === activeType.toLowerCase().replace(/ /g, '');
      const matchesDiff = activeDifficulty === "All" || ex.difficulty?.toLowerCase() === activeDifficulty.toLowerCase();
      return matchesSearch && matchesType && matchesDiff;
    });
  }, [exercisesList, searchQuery, activeType, activeDifficulty]);

  const currentExercises = filteredExercises.slice((currentPage - 1) * exercisesPerPage, currentPage * exercisesPerPage);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const score = useMemo(() => {
    if (!selectedEx || modalStage !== 'result') return 0;
    return selectedEx.content.reduce((acc, q, idx) => {
      return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
    }, 0);
  }, [selectedEx, modalStage, userAnswers]);

  const getIcon = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('mcq')) return <PlayCircle size={32} />;
    if (t.includes('gap')) return <PenTool size={32} />;
    return <Book size={32} />;
  };

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen">
      {/* HERO SECTION */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {heroData && (
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
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600 shadow-inner" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
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
                Start Exercise <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
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
                <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                <p className="text-gray-500 mb-8">{fetchError}</p>
                <button onClick={() => setFetchError(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold">Close</button>
              </div>
            ) : selectedEx && (
              <>
                {/* STAGE 1: Info */}
                {modalStage === 'info' && (
                  <div className="text-center py-4">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">{getIcon(selectedEx.exerciseType)}</div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">{selectedEx.title}</h2>
                    <div className="bg-gray-50 rounded-[2rem] p-8 mb-8">
                      <p className="text-gray-700 text-lg leading-relaxed">{selectedEx.description}</p>
                    </div>
                    <button onClick={() => setModalStage('test')} className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-bold shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700">
                      Start Test <ArrowRight size={22} />
                    </button>
                  </div>
                )}

                {/* STAGE 2: Test */}
                {modalStage === 'test' && (
                  <div className="space-y-8">
                    {selectedEx.content.map((q, idx) => (
                      <div key={idx} className="p-8 rounded-[3rem] bg-gray-50 shadow-inner">
                        <p className="font-bold text-xl mb-6 flex gap-4">
                          <span className="bg-blue-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0">{idx + 1}</span>
                          {q.question}
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {q.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: i }))}
                              className={`px-7 py-5 border-2 rounded-[1.8rem] text-left font-bold transition-all ${
                                userAnswers[idx] === i ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-100 hover:border-blue-400"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={handleSubmit} 
                      disabled={Object.keys(userAnswers).length !== selectedEx.content.length}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-bold disabled:opacity-50"
                    >
                      Check Results
                    </button>
                  </div>
                )}

                {/* STAGE 3: Result */}
                {modalStage === 'result' && (
                  <div className="space-y-8">
                    <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white text-center">
                      <Trophy size={60} className="mx-auto mb-4" />
                      <h3 className="text-3xl font-bold">Score: {score} / {selectedEx.content.length}</h3>
                    </div>
                    {selectedEx.content.map((q, idx) => (
                      <div key={idx} className={`p-6 rounded-[2rem] border-2 ${userAnswers[idx] === q.correctAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                        <p className="font-bold mb-2">{idx + 1}. {q.question}</p>
                        <p className="text-sm">Correct Answer: <span className="font-bold">{q.options[q.correctAnswer]}</span></p>
                      </div>
                    ))}
                    <button onClick={() => setSelectedEx(null)} className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-bold">Finish</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Activities;