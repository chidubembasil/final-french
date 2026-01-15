import { useState, useEffect, useMemo } from "react";
import {
  SplitSquareHorizontal,
  ArrowRight,
  PlayCircle,
  Book,
  PenTool,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Loader2,
  Search,
  Check
} from "lucide-react";

// --- Interfaces ---
interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string;
  difficulty: string;
  publishedAt: string;
}

interface DetailedExercise extends Exercise {
  content: {
    questions: Array<{
      questionText: string;
      options: string[];
    }>;
  };
  answerKey: Record<string, string>;
  showAnswerKey: boolean;
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function Activities() {
  // Data Arrays (Populated from API)
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  
  // Selection & Modal Flow States
  const [selectedEx, setSelectedEx] = useState<DetailedExercise | null>(null);
  const [modalStage, setModalStage] = useState<'info' | 'test'>('info');
  const [submitted, setSubmitted] = useState(false);

  // UI States
  const [loading, setLoading] = useState(true);
  const [loadingHero, setLoadingHero] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  
  // Filter States
  const [activeType, setActiveType] = useState<string>("All");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 8;
  
  // Answer Tracking
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  // Replace with your actual API base URL
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // ── 1. Initial Data Fetch (Hero & List) ────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, exRes] = await Promise.all([
          fetch(`${CLIENT_KEY}api/galleries`),
          fetch(`${CLIENT_KEY}api/exercises`)
        ]);

        const heroJson = await heroRes.json();
        const exJson = await exRes.json();

        // Find specific hero
        const matchingHero = heroJson.find(
          (item: any) => item.purpose === "Other Page" && item.subPurpose === "Activities"
        );
        if (matchingHero) setHeroData(matchingHero);

        // Store all exercises - handle both array and object responses
        const rawExercises = Array.isArray(exJson) ? exJson : (exJson.data || []);
        
        // Map and normalize the exercise data
        const normalizedExercises = rawExercises.map((ex: any) => ({
          ...ex,
          // Normalize exerciseType for display
          exerciseType: ex.exerciseType || 'Unknown',
          difficulty: ex.difficulty || 'Beginner'
        }));
        
        console.log("Fetched exercises:", normalizedExercises);
        setExercises(normalizedExercises);
      } catch (err) {
        console.error("Initialization Error:", err);
      } finally {
        setLoadingHero(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [CLIENT_KEY]);

  // ── 2. Detailed Fetch (Triggered on Start) ──────────────────────
  const handleOpenExercise = async (id: number) => {
    setIsPopupLoading(true);
    setModalStage('info');
    setSubmitted(false);
    setUserAnswers({});
    
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${id}`);
      const json = await res.json();
      const rawData = json.data || json;

      // Parse JSON strings safely
      let parsedContent = rawData.content;
      let parsedAnswerKey = rawData.answerKey;

      try {
        parsedContent = typeof rawData.content === "string" ? JSON.parse(rawData.content) : rawData.content;
      } catch (e) {
        console.error("Failed to parse content:", e);
        parsedContent = { questions: [] };
      }

      try {
        parsedAnswerKey = typeof rawData.answerKey === "string" ? JSON.parse(rawData.answerKey) : rawData.answerKey;
      } catch (e) {
        console.error("Failed to parse answerKey:", e);
        parsedAnswerKey = {};
      }

      const parsedExercise: DetailedExercise = {
        ...rawData,
        content: parsedContent,
        answerKey: parsedAnswerKey,
      };

      console.log("Parsed Exercise:", parsedExercise);
      console.log("Questions:", parsedExercise.content?.questions);

      setSelectedEx(parsedExercise);
    } catch (err) {
      console.error("Error fetching details:", err);
    } finally {
      setIsPopupLoading(false);
    }
  };

  // ── 3. Local Search & Filter Logic ──────────────────────────────
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ex.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Normalize types for comparison
      const normalizedExType = ex.exerciseType?.toLowerCase().trim() || '';
      const normalizedActiveType = activeType.toLowerCase().trim();
      
      const matchesType = activeType === "All" || normalizedExType === normalizedActiveType;
      
      const matchesDiff = activeDifficulty === "All" || 
                          ex.difficulty?.toLowerCase() === activeDifficulty.toLowerCase();
      
      return matchesSearch && matchesType && matchesDiff;
    });
  }, [exercises, searchQuery, activeType, activeDifficulty]);

  const currentExercises = filteredExercises.slice(
    (currentPage - 1) * exercisesPerPage,
    currentPage * exercisesPerPage
  );
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const getIcon = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('multiple') || lowerType === 'mcq') return <PlayCircle size={32} />;
    if (lowerType.includes('gap') || lowerType.includes('fill')) return <PenTool size={32} />;
    if (lowerType.includes('match')) return <SplitSquareHorizontal size={32} />;
    if (lowerType.includes('true') || lowerType.includes('false')) return <CheckCircle2 size={32} />;
    return <Book size={32} />;
  };

  const formatExerciseType = (type: string) => {
    if (!type) return 'Exercise';
    const lowerType = type.toLowerCase();
    if (lowerType === 'mcq') return 'Multiple Choice';
    return type.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen">
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loadingHero ? (
          <div className="absolute inset-0 animate-pulse bg-slate-800 flex items-center justify-center">
            <Loader2 className="animate-spin text-white/20" size={40} />
          </div>
        ) : (
          <>
            <img src={heroData?.mediaUrl} className="absolute inset-0 w-full h-full object-cover z-0" alt="Hero" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-red-700/80" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <div className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                <SplitSquareHorizontal size={17} />
                <p className="text-sm font-bold uppercase tracking-wider">Interactive Learning</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif leading-tight drop-shadow-2xl">
                {heroData?.title}
              </h1>
              <p className="text-white text-xl max-w-xl opacity-90 leading-relaxed drop-shadow-md">
                {heroData?.description}
              </p>
            </div>
          </>
        )}
      </div>

      <section className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
        {/* --- FILTER BAR --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12 flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 w-full relative">
            <p className="text-[10px] font-black uppercase text-blue-600 mb-2 ml-1">Search Activity</p>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <p className="text-[10px] font-black uppercase text-blue-600 mb-2 ml-1">Type</p>
            <div className="flex gap-2 flex-wrap">
              {["All", "MCQ", "Gap Filling", "Matching", "True or False"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeType === t ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <p className="text-[10px] font-black uppercase text-red-600 mb-2 ml-1">Difficulty</p>
            <div className="flex gap-2 flex-wrap">
              {["All", "Beginner", "Intermediate", "Advanced"].map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDifficulty(d)}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeDifficulty === d ? "bg-red-600 text-white shadow-lg" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- EXERCISE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {loading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 bg-white border border-gray-100 animate-pulse rounded-[2.5rem]" />
            ))
          ) : currentExercises.length > 0 ? (
            currentExercises.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden">
                <div className={`absolute top-0 right-8 px-3 py-1 rounded-b-lg text-[8px] font-black uppercase text-white z-10 ${
                  item.difficulty?.toLowerCase() === "advanced" ? "bg-red-600" : 
                  item.difficulty?.toLowerCase() === "intermediate" ? "bg-orange-600" : 
                  "bg-blue-600"
                }`}>
                  {item.difficulty || 'Beginner'}
                </div>
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    {getIcon(item.exerciseType)}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{item.title || 'Untitled Exercise'}</h3>
                  <p className="text-[10px] font-black text-blue-500 uppercase mb-4 tracking-widest">{formatExerciseType(item.exerciseType)}</p>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">{item.description || 'No description available'}</p>
                </div>
                <button
                  onClick={() => handleOpenExercise(item.id)}
                  className="flex items-center gap-2 font-bold text-blue-700 group/btn mt-auto"
                >
                  Start Activity <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 italic">No activities found.</div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-30"><ChevronLeft size={20}/></button>
            <span className="text-sm font-bold text-slate-400">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-30"><ChevronRight size={20}/></button>
          </div>
        )}
      </section>

      {/* --- TWO-STEP POPUP MODAL --- */}
      {selectedEx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedEx(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 shadow-2xl">
            <button onClick={() => setSelectedEx(null)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>

            {modalStage === 'info' ? (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  {getIcon(selectedEx.exerciseType)}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedEx.title}</h2>
                <div className="flex justify-center gap-3 mb-8">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500">{selectedEx.difficulty || 'Beginner'}</span>
                  <span className="px-3 py-1 bg-blue-100 rounded-full text-[10px] font-black uppercase text-blue-600">{formatExerciseType(selectedEx.exerciseType)}</span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-10">{selectedEx.description || 'No description available'}</p>
                <button 
                  onClick={() => setModalStage('test')}
                  className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Proceed to Exercise <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="border-b pb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedEx.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">Submit your answers when you are finished.</p>
                </div>

                <div className="space-y-6">
                  {selectedEx.content?.questions?.length > 0 ? (
                    selectedEx.content.questions.map((q: any, idx: number) => {
                      const qKey = `q${idx + 1}`;
                      const correctVal = selectedEx.answerKey?.[qKey];
                      const userAnswer = userAnswers[qKey];

                      return (
                        <div key={idx} className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                          <p className="font-bold text-xl text-slate-800 mb-6 flex gap-4">
                            <span className="text-blue-600 bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0">{idx + 1}</span>
                            {q.questionText || q.question || 'Question not available'}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(q.options || []).map((opt: string, i: number) => {
                              const isSelected = userAnswer === opt;
                              const isCorrect = submitted && opt === correctVal;
                              const isWrong = submitted && isSelected && opt !== correctVal;
                              
                              return (
                                <button
                                  key={i}
                                  onClick={() => !submitted && setUserAnswers(prev => ({ ...prev, [qKey]: opt }))}
                                  disabled={submitted}
                                  className={`px-6 py-4 border-2 rounded-2xl text-sm font-bold transition-all text-left ${
                                    isCorrect 
                                      ? "bg-green-500 border-green-500 text-white shadow-lg" 
                                      : isWrong
                                      ? "bg-red-500 border-red-500 text-white shadow-lg"
                                      : isSelected
                                      ? "bg-blue-500 border-blue-500 text-white shadow-md"
                                      : "bg-white border-gray-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50"
                                  } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-lg font-semibold mb-2">No questions available</p>
                      <p className="text-sm">This exercise hasn't been set up yet.</p>
                    </div>
                  )}
                </div>

                {!submitted ? (
                  <button 
                    onClick={() => setSubmitted(true)}
                    className="w-full py-5 bg-slate-900 text-white rounded-[2.5rem] font-bold hover:bg-green-600 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <Check size={20} /> Submit My Answers
                  </button>
                ) : (
                  <button 
                    onClick={() => setSelectedEx(null)}
                    className="w-full py-5 bg-blue-600 text-white rounded-[2.5rem] font-bold hover:bg-blue-700 transition-all shadow-xl"
                  >
                    Finish Lesson
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* GLOBAL POPUP LOADER */}
      {isPopupLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/70 backdrop-blur-md">
          <Loader2 className="animate-spin text-blue-600" size={50} />
        </div>
      )}
    </main>
  );
}

export default Activities;