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
  correctAnswer: number; // comes as 1,2,3,4 from backend
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string;
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  const exercisesPerPage = 8;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || '';

  useEffect(() => {
    document.body.style.overflow = selectedEx || fetchError ? 'hidden' : 'unset';
  }, [selectedEx, fetchError]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, exRes] = await Promise.all([
          fetch(`${CLIENT_KEY}api/galleries`),
          fetch(`${CLIENT_KEY}api/exercises`)
        ]);

        if (!heroRes.ok || !exRes.ok) throw new Error("Fetch failed");

        const heroJson = await heroRes.json();
        const exJson = await exRes.json();

        const matchingHero = (heroJson.data || heroJson).find((item: any) =>
          (item.attributes?.purpose || item.purpose) === "Other Page" &&
          (item.attributes?.subPurpose || item.subPurpose) === "Activities"
        );
        if (matchingHero) {
          const data = matchingHero.attributes || matchingHero;
          setHeroData({
            title: data.title || '',
            description: data.description || '',
            mediaUrl: data.mediaUrl || ''
          });
        }

        const rawExercises = Array.isArray(exJson) ? exJson : (exJson.data || []);
        const tempMap: Record<number, DetailedExercise> = {};

        rawExercises.forEach((item: any) => {
          const data = item.attributes ? { id: item.id, ...item.attributes } : item;
          let parsedContent: RawQuestion[] = [];
          if (data.content) {
            const rawContent = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
            // We keep correctAnswer as-is (1-based), we only subtract when comparing
            parsedContent = rawContent;
          }
          tempMap[data.id] = { ...data, content: parsedContent };
        });

        setExercisesMap(tempMap);
        setExercisesList(Object.values(tempMap));
      } catch (err) {
        console.error(err);
        setFetchError("Failed to load activities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [CLIENT_KEY]);

  const typeOptions = useMemo(() => {
    const types = new Set(exercisesList.map(ex => ex.exerciseType).filter(Boolean));
    return ["All", ...Array.from(types).sort()];
  }, [exercisesList]);

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
      const matchesSearch =
        ex.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === "All" || ex.exerciseType === activeType;
      return matchesSearch && matchesType;
    });
  }, [exercisesList, searchQuery, activeType]);

  const currentExercises = filteredExercises.slice(
    (currentPage - 1) * exercisesPerPage,
    currentPage * exercisesPerPage
  );
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const score = useMemo(() => {
    if (!selectedEx || modalStage !== 'result') return 0;
    return selectedEx.content.reduce((acc, q, idx) => {
      // Compare with 1-based user answer
      return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
    }, 0);
  }, [selectedEx, modalStage, userAnswers]);

  const getIcon = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('mcq')) return <PlayCircle size={24} />;
    if (t.includes('gap')) return <PenTool size={24} />;
    return <Book size={24} />;
  };

  // Helper to convert 1-based index to letter (1→A, 2→B, etc.)
  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index - 1); // 1 → A, 2 → B, 3 → C, 4 → D
  };

  return (
    <main className="pt-16 sm:pt-20 bg-[#fcfaf8] min-h-screen">
      {/* HERO SECTION */}
      <div className="relative w-full h-[70dvh] sm:h-[80dvh] md:h-[90dvh] overflow-hidden bg-slate-900">
        {heroData && (
          <>
            <img
              src={heroData.mediaUrl}
              className="absolute inset-0 w-full h-full object-cover z-0"
              alt="Activities hero"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/40 to-red-700/60" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-5 sm:px-10 md:px-20 gap-4 sm:gap-6">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl text-sm sm:text-base">
                <SplitSquareHorizontal size={16} className="sm:size-17" />
                <p className="font-bold uppercase tracking-wider text-xs sm:text-sm">Interactive Learning</p>
              </div>
              <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold font-serif leading-tight max-w-4xl">
                {heroData.title}
              </h1>
              <p className="text-white text-base sm:text-xl max-w-xl opacity-90 leading-relaxed">
                {heroData.description}
              </p>
            </div>
          </>
        )}
      </div>

      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-20 max-w-7xl mx-auto">
        {/* FILTER BAR */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 mb-8 sm:mb-12 flex flex-col lg:flex-row gap-5 sm:gap-6">
          <div className="flex-1 w-full">
            <p className="text-[10px] sm:text-xs font-black uppercase text-blue-600 mb-2 ml-1">Search Activity</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full pl-12 pr-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gray-50 outline-none shadow-inner text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {typeOptions.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveType(t);
                  setCurrentPage(1);
                }}
                className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase transition-all flex-shrink-0 ${
                  activeType === t
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {loading ? (
            <div className="col-span-full flex justify-center py-16 sm:py-20">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : currentExercises.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              No activities found matching your filters.
            </div>
          ) : (
            currentExercises.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col hover:-translate-y-1"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-4 sm:mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  {getIcon(item.exerciseType)}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4 sm:mb-6 flex-grow">{item.description}</p>
                <button
                  onClick={() => handleOpenExercise(item.id)}
                  className="flex items-center gap-2 font-bold text-blue-700 mt-auto text-sm group/btn"
                >
                  Start Exercise
                  <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 sm:gap-4 py-6 sm:py-8 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <span className="font-bold text-gray-500 bg-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border text-sm sm:text-base hidden xs:block">
              Page {currentPage} / {totalPages}
            </span>

            <span className="font-bold text-gray-600 xs:hidden text-sm">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      {/* MODAL */}
      {(selectedEx || fetchError) && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0" onClick={() => { setSelectedEx(null); setFetchError(null); }} />

          <div className="relative bg-white w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh] sm:max-h-[88vh]">
            <button
              onClick={() => { setSelectedEx(null); setFetchError(null); }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-900 rounded-full transition-all z-50"
            >
              <X size={20} className="sm:size-24" strokeWidth={3} />
            </button>

            <div className="overflow-y-auto flex-1 p-5 sm:p-8 md:p-12 custom-scrollbar">
              {fetchError ? (
                // error content remains the same
                <div className="text-center py-8 sm:py-10">
                  <AlertCircle size={48} className="mx-auto text-red-500 mb-4 sm:size-60" />
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Error</h2>
                  <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">{fetchError}</p>
                  <button onClick={() => setFetchError(null)} className="px-8 sm:px-10 py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base">
                    Dismiss
                  </button>
                </div>
              ) : selectedEx && (
                <>
                  {modalStage === 'info' && (
                    <div className="text-center py-4 sm:py-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 text-blue-600 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mx-auto mb-6 sm:mb-8">
                        {getIcon(selectedEx.exerciseType)}
                      </div>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">{selectedEx.title}</h2>
                      <div className="bg-gray-50 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 mb-6 sm:mb-10">
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{selectedEx.description}</p>
                      </div>
                      <button
                        onClick={() => setModalStage('test')}
                        className="w-full py-4 sm:py-6 bg-blue-600 text-white rounded-[2rem] sm:rounded-[2.5rem] font-bold shadow-xl flex items-center justify-center gap-2 sm:gap-3 hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      >
                        Start Test <ArrowRight size={18} className="sm:size-22" />
                      </button>
                    </div>
                  )}

                  {modalStage === 'test' && (
                    <div className="space-y-6 sm:space-y-8 pt-2 sm:pt-4">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-800 border-b pb-3 sm:pb-4">{selectedEx.title}</h2>
                      {selectedEx.content.map((q, idx) => (
                        <div key={idx} className="p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] bg-gray-50/50 border border-gray-100">
                          <p className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 flex gap-3 sm:gap-4 items-start">
                            <span className="bg-blue-600 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-sm shrink-0 flex-none">
                              {idx + 1}
                            </span>
                            {q.question}
                          </p>
                          <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            {q.options.map((opt, i) => {
                              const optionNumber = i + 1; // 1,2,3,4
                              const isSelected = userAnswers[idx] === optionNumber;
                              return (
                                <button
                                  key={i}
                                  onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: optionNumber }))}
                                  className={`px-5 sm:px-7 py-4 sm:py-5 border-2 rounded-[1.5rem] sm:rounded-[1.8rem] text-left font-medium sm:font-bold transition-all text-sm sm:text-base flex items-center gap-3 ${
                                    isSelected
                                      ? "bg-blue-600 border-blue-600 text-white"
                                      : "bg-white border-gray-200 hover:border-blue-400"
                                  }`}
                                >
                                  <span className="font-black min-w-[1.8rem]">{getOptionLabel(optionNumber)}.</span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setModalStage('result')}
                        disabled={Object.keys(userAnswers).length !== selectedEx.content.length}
                        className="w-full py-4 sm:py-6 bg-slate-900 text-white rounded-[2rem] sm:rounded-[2.5rem] font-bold disabled:opacity-50 hover:bg-slate-800 transition-colors text-sm sm:text-base"
                      >
                        Check My Score
                      </button>
                    </div>
                  )}

                  {modalStage === 'result' && (
                    <div className="space-y-6 sm:space-y-8 pt-2 sm:pt-4">
                      <div className="bg-blue-600 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white text-center shadow-xl">
                        <Trophy size={48} className="mx-auto mb-3 sm:mb-4 sm:size-64 animate-bounce" />
                        <p className="uppercase tracking-widest font-bold text-xs sm:text-sm mb-1 sm:mb-2 opacity-80">Final Results</p>
                        <h3 className="text-4xl sm:text-5xl font-black">{score} / {selectedEx.content.length}</h3>
                      </div>
                      {selectedEx.content.map((q, idx) => (
                        <div
                          key={idx}
                          className={`p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 ${
                            userAnswers[idx] === q.correctAnswer ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
                          }`}
                        >
                          <p className="font-bold text-base sm:text-lg mb-2 sm:mb-3">{idx + 1}. {q.question}</p>
                          <p className={`text-sm font-medium ${userAnswers[idx] === q.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                            Your Answer: {userAnswers[idx] ? `${getOptionLabel(userAnswers[idx])}. ${q.options[userAnswers[idx] - 1]}` : '—'}
                          </p>
                          {userAnswers[idx] !== q.correctAnswer && (
                            <p className="text-sm text-slate-600 mt-1">
                              Correct: {getOptionLabel(q.correctAnswer)}. {q.options[q.correctAnswer - 1]}
                            </p>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setSelectedEx(null)}
                        className="w-full py-4 sm:py-6 bg-blue-600 text-white rounded-[2rem] sm:rounded-[2.5rem] font-bold shadow-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      >
                        Return to Activities
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          @media (min-width: 640px) { width: 8px; }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </main>
  );
}

export default Activities;