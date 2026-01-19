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
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const exercisesPerPage = 8;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, exRes] = await Promise.all([
          fetch(`${CLIENT_KEY}api/galleries`),
          fetch(`${CLIENT_KEY}api/exercises`)
        ]);

        const heroJson = await heroRes.json();
        const exJson = await exRes.json();

        const heroArray = Array.isArray(heroJson) ? heroJson : (heroJson.data || []);
        const matchingHero = heroArray.find(
          (item: any) => (item.attributes?.subPurpose || item.subPurpose) === "Activities"
        );
        if (matchingHero) {
          setHeroData(matchingHero.attributes || matchingHero);
        }

        const rawExercises = Array.isArray(exJson) ? exJson : (exJson.data || []);
        const normalized = rawExercises.map((ex: any) => {
          const data = ex.attributes || ex;
          return {
            id: ex.id,
            title: data.title,
            description: data.description,
            exerciseType: data.exerciseType || 'Unknown',
            difficulty: data.difficulty || 'Beginner',
            publishedAt: data.publishedAt
          };
        });
        
        setExercises(normalized);
      } catch (err) {
        console.error("Initialization Error:", err);
      } finally {
        setLoadingHero(false);
        setLoading(false);
      }
    };
    fetchData();
  }, [CLIENT_KEY]);

  // 2. Detailed Fetch
  const handleOpenExercise = async (id: number) => {
    setIsPopupLoading(true);
    setModalStage('info');
    setSubmitted(false);
    setUserAnswers({});
    
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${id}`);
      if (!res.ok) throw new Error(`Status ${res.status}: Exercise not found`);
      
      const json = await res.json();
      const rawData = json.data?.attributes ? { id: json.data.id, ...json.data.attributes } : (json.data || json);

      let questionsArray = [];
      try {
        questionsArray = typeof rawData.content === "string" 
          ? JSON.parse(rawData.content) 
          : (rawData.content?.questions || rawData.content || []);
      } catch (e) {
        console.error("JSON Parse Error:", e);
      }

      const transformedQuestions: any[] = [];
      const answerKey: Record<string, string> = {};

      if (Array.isArray(questionsArray)) {
        questionsArray.forEach((q: any, idx: number) => {
          const qKey = `q${idx + 1}`;
          const options = q.options || q.choices || [];
          transformedQuestions.push({
            questionText: q.question || q.questionText || "Untitled Question",
            options: options
          });
          const correctIndex = parseInt(q.correctAnswer) - 1;
          if (options[correctIndex]) {
            answerKey[qKey] = options[correctIndex];
          } else if (typeof q.correctAnswer === 'string') {
            answerKey[qKey] = q.correctAnswer;
          }
        });
      }

      setSelectedEx({
        ...rawData,
        content: { questions: transformedQuestions },
        answerKey: answerKey,
      });
    } catch (err: any) {
      console.error("Fetch Error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsPopupLoading(false);
    }
  };

  // 3. Search & Filter Logic
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = (ex.title + ex.description).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === "All" || ex.exerciseType.toLowerCase() === activeType.toLowerCase();
      const matchesDiff = activeDifficulty === "All" || ex.difficulty.toLowerCase() === activeDifficulty.toLowerCase();
      return matchesSearch && matchesType && matchesDiff;
    });
  }, [exercises, searchQuery, activeType, activeDifficulty]);

  const currentExercises = filteredExercises.slice((currentPage - 1) * exercisesPerPage, currentPage * exercisesPerPage);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const getIcon = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('mcq')) return <PlayCircle size={32} />;
    if (t.includes('gap')) return <PenTool size={32} />;
    if (t.includes('match')) return <SplitSquareHorizontal size={32} />;
    return <Book size={32} />;
  };

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[60dvh] overflow-hidden bg-slate-900">
        {!loadingHero && heroData && (
          <>
            <img src={heroData.mediaUrl} className="absolute inset-0 w-full h-full object-cover z-0" alt="Hero" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 to-red-700/80" />
            <div className="relative z-20 h-full flex flex-col items-start justify-center px-10 md:px-20">
              <div className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl mb-4">
                <CheckCircle2 size={17} />
                <p className="text-sm font-bold uppercase tracking-wider">Verified Activities</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif mb-4">{heroData.title}</h1>
              <p className="text-white text-xl max-w-xl opacity-90">{heroData.description}</p>
            </div>
          </>
        )}
      </div>

      <section className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border mb-10 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] font-bold uppercase text-gray-400 mr-2">Difficulty:</span>
            {["All", "Beginner", "Advanced"].map(d => (
              <button key={d} onClick={() => setActiveDifficulty(d)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${activeDifficulty === d ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{d}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {["All", "MCQ", "Matching"].map(t => (
              <button key={t} onClick={() => setActiveType(t)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${activeType === t ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
             <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
          ) : currentExercises.map(item => (
            <div key={item.id} className="bg-white rounded-[2rem] p-8 border hover:shadow-xl transition-all flex flex-col">
              <div className="text-blue-600 mb-6">{getIcon(item.exerciseType)}</div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-3">{item.description}</p>
              <button onClick={() => handleOpenExercise(item.id)} className="mt-auto flex items-center gap-2 font-bold text-blue-700">
                Start Activity <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Buttons (Fixes the Unused Variable Errors) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-full bg-white border hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="font-bold">Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-full bg-white border hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </section>

      {/* Popup Modal */}
      {selectedEx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedEx(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-8 md:p-12">
            <button onClick={() => setSelectedEx(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X /></button>
            
            {modalStage === 'info' ? (
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">{selectedEx.title}</h2>
                <p className="text-gray-600 text-lg mb-10">{selectedEx.description}</p>
                <button onClick={() => setModalStage('test')} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg">Proceed to Exercise</button>
              </div>
            ) : (
              <div className="space-y-8">
                {selectedEx.content.questions.map((q, idx) => {
                  const qKey = `q${idx + 1}`;
                  return (
                    <div key={idx} className="p-6 bg-gray-50 rounded-[2rem] border">
                      <p className="font-bold text-xl mb-6">{idx + 1}. {q.questionText}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt: string, i: number) => {
                          const isCorrect = submitted && opt === selectedEx.answerKey[qKey];
                          const isSelected = userAnswers[qKey] === opt;
                          return (
                            <button 
                              key={i} 
                              disabled={submitted}
                              onClick={() => setUserAnswers({...userAnswers, [qKey]: opt})}
                              className={`p-4 text-left border-2 rounded-2xl font-bold transition-all ${
                                isCorrect ? "bg-green-500 border-green-500 text-white" :
                                isSelected ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {!submitted ? (
                  <button onClick={() => setSubmitted(true)} className="w-full py-5 bg-black text-white rounded-[2rem] font-bold flex items-center justify-center gap-2">
                    <Check size={20} /> Submit Answers
                  </button>
                ) : (
                  <button onClick={() => setSelectedEx(null)} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold">Close Lesson</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isPopupLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/70 backdrop-blur-md">
          <Loader2 className="animate-spin text-blue-600" size={50} />
        </div>
      )}
    </main>
  );
}

export default Activities;