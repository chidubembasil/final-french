import { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  PlayCircle,
  Book,
  PenTool,
  X,
  Loader2,
  Search,
  Check
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, exRes] = await Promise.all([
          fetch(`${CLIENT_KEY}api/galleries`),
          fetch(`${CLIENT_KEY}api/exercises`)
        ]);

        const heroJson = await heroRes.json();
        const exJson = await exRes.json();

        const matchingHero = heroJson.find(
          (item: any) => item.purpose === "Other Page" && item.subPurpose === "Activities"
        );
        if (matchingHero) setHeroData(matchingHero);

        const rawExercises = Array.isArray(exJson) ? exJson : (exJson.data || []);
        setExercises(rawExercises);
      } catch (err) {
        console.error("Initialization Error:", err);
      } finally {
        setLoadingHero(false);
        setLoading(false);
      }
    };
    fetchData();
  }, [CLIENT_KEY]);

  const handleOpenExercise = async (id: number) => {
    setIsPopupLoading(true);
    setModalStage('info');
    setSubmitted(false);
    setUserAnswers({});
    
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${id}`);
      const json = await res.json();
      const rawData = json.data || json;

      let parsedContent: RawQuestion[] = [];
      try {
        parsedContent = typeof rawData.content === "string" 
          ? JSON.parse(rawData.content) 
          : (rawData.content || []);
      } catch (e) {
        console.error("JSON Parse Error:", e);
      }

      setSelectedEx({
        ...rawData,
        content: parsedContent
      });
    } catch (err) {
      console.error("Error fetching details:", err);
    } finally {
      setIsPopupLoading(false);
    }
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = (ex.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ex.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const normalizedExType = ex.exerciseType?.toLowerCase().trim() || '';
      const normalizedActiveType = activeType.toLowerCase().trim();
      const matchesType = activeType === "All" || normalizedExType === normalizedActiveType;
      
      return matchesSearch && matchesType;
    });
  }, [exercises, searchQuery, activeType]);

  const getIcon = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('mcq')) return <PlayCircle size={32} />;
    if (lowerType.includes('gap')) return <PenTool size={32} />;
    return <Book size={32} />;
  };

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen">
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[60dvh] overflow-hidden bg-slate-900">
        {!loadingHero && heroData && (
          <>
            <img src={heroData.mediaUrl} className="absolute inset-0 w-full h-full object-cover z-0" alt="Hero" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 to-slate-900/40" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif">{heroData.title}</h1>
              <p className="text-white text-xl max-w-xl opacity-90">{heroData.description}</p>
            </div>
          </>
        )}
      </div>

      <section className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
        {/* --- FILTER BAR --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search activities..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "MCQ", "Gap Filling"].map((t) => (
              <button 
                key={t} 
                onClick={() => setActiveType(t)} 
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                  activeType === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
             <div className="col-span-full flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : filteredExercises.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {getIcon(item.exerciseType)}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-6">{item.description}</p>
              <button onClick={() => handleOpenExercise(item.id)} className="flex items-center gap-2 font-bold text-blue-700 mt-auto">
                Start Activity <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODAL --- */}
      {selectedEx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedEx(null)} />
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-10">
            <button onClick={() => setSelectedEx(null)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>

            {modalStage === 'info' ? (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">{selectedEx.title}</h2>
                <p className="text-gray-600 mb-10">{selectedEx.description}</p>
                <button onClick={() => setModalStage('test')} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold">Start Exercise</button>
              </div>
            ) : (
              <div className="space-y-8">
                {selectedEx.content.map((q, idx) => {
                  const userAnswer = userAnswers[idx];
                  const correctAnswerText = q.options[q.correctAnswer];

                  return (
                    <div key={idx} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                      <p className="font-bold text-lg mb-4">{idx + 1}. {q.question}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt, i) => {
                          const isSelected = userAnswer === opt;
                          const isCorrect = submitted && opt === correctAnswerText;
                          const isWrong = submitted && isSelected && opt !== correctAnswerText;

                          return (
                            <button
                              key={i}
                              disabled={submitted}
                              onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: opt }))}
                              className={`px-6 py-3 border-2 rounded-xl text-left transition-all ${
                                isCorrect ? "bg-green-500 border-green-500 text-white" :
                                isWrong ? "bg-red-500 border-red-500 text-white" :
                                isSelected ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200"
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
                  <button onClick={() => setSubmitted(true)} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold flex items-center justify-center gap-2">
                    <Check size={20} /> Submit Answers
                  </button>
                ) : (
                  <button onClick={() => setSelectedEx(null)} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold">Finish Lesson</button>
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