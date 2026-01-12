import { SplitSquareHorizontal, ArrowRight, PlayCircle, Book, PenTool, ChevronLeft, ChevronRight, CheckCircle2, X, Loader2, Eye, EyeOff, Search } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string;
  difficulty: string;
  publishedAt: string;
  content?: any; 
  answerKey?: any;
  showAnswerKey: boolean;
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
  purpose: string;
  subPurpose: string;
}

function Activites() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeType, setActiveType] = useState<string>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingHero, setLoadingHero] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [revealAnswers, setRevealAnswers] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 8;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_ENV;
  const EXERCISE_TYPES = ['Multiple Choice', 'Gap Filling', 'Matching', 'Sequencing', 'True or False'];
  const DIFFICULTIES = ['Basic', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetch(`${CLIENT_KEY}api/galleries`)
      .then((res) => res.json())
      .then((data: GalleryHero[]) => {
        const matchingHero = data.find((item) => item.purpose === "Other Page" && item.subPurpose === "Activities");
        if (matchingHero) setHeroData(matchingHero);
      })
      .catch((err) => console.error("Hero Fetch error:", err))
      .finally(() => setLoadingHero(false));
  }, [CLIENT_KEY]);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeType !== 'All') params.append('exerciseType', activeType);
      if (activeDifficulty !== 'All') params.append('difficulty', activeDifficulty);
      const res = await fetch(`${CLIENT_KEY}api/exercises?${params.toString()}`);
      const data = await res.json();
      setExercises(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [CLIENT_KEY, activeType, activeDifficulty]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => 
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exercises, searchQuery]);

  const handleOpenExercise = async (id: number) => {
    setIsPopupLoading(true);
    setRevealAnswers(false);
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${id}`);
      const json = await res.json();
      const rawData = json.data || json;
      const parsedExercise = {
        ...rawData,
        content: typeof rawData.content === 'string' ? JSON.parse(rawData.content) : rawData.content,
        answerKey: typeof rawData.answerKey === 'string' ? JSON.parse(rawData.answerKey) : rawData.answerKey,
        showAnswerKey: rawData.showAnswerKey === "true" || rawData.showAnswerKey === true || rawData.showAnswerKey === 1
      };
      setSelectedExercise(parsedExercise);
    } catch (err) {
      console.error("Error fetching exercise details:", err);
    } finally {
      setIsPopupLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'multiple choice': return <PlayCircle size={32} />;
      case 'gap filling': return <PenTool size={32} />;
      case 'matching': return <SplitSquareHorizontal size={32} />;
      case 'true or false': return <CheckCircle2 size={32} />;
      default: return <Book size={32} />;
    }
  };

  const currentExercises = filteredExercises.slice((currentPage - 1) * exercisesPerPage, currentPage * exercisesPerPage);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen">
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loadingHero ? (
          <div className="absolute inset-0 animate-pulse bg-slate-800 flex items-center justify-center"><Loader2 className="animate-spin text-white/20" size={40} /></div>
        ) : (
          <>
            <img src={heroData?.mediaUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover object-top z-0" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-red-700/80" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                <SplitSquareHorizontal color="white" size={17} />
                <p className="text-sm font-bold uppercase tracking-wider">Interactive Learning</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif leading-tight drop-shadow-2xl">{heroData?.title}</h1>
              <p className="text-white text-xl max-w-xl opacity-90 leading-relaxed drop-shadow-md">{heroData?.description}</p>
            </div>
          </>
        )}
      </div>

      <section className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12 flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative">
            <p className="text-[10px] font-black uppercase text-blue-600 mb-2 ml-1">Search Activity</p>
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Search..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-600 font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="w-full lg:w-auto">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Format</p>
            <select className="w-full lg:w-48 px-4 py-4 rounded-2xl bg-gray-50 border-none font-bold text-xs cursor-pointer" value={activeType} onChange={(e) => setActiveType(e.target.value)}>
              <option value="All">All Formats</option>
              {EXERCISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="w-full lg:w-auto">
            <p className="text-[10px] font-black uppercase text-red-600 mb-2 ml-1">Difficulty</p>
            <div className="flex gap-2">
              {['All', ...DIFFICULTIES].map(d => (
                <button key={d} onClick={() => setActiveDifficulty(d)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeDifficulty === d ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>{d}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {loading ? (
             [1,2,3,4].map(n => <div key={n} className="h-72 bg-white border border-gray-100 animate-pulse rounded-[2.5rem]" />)
          ) : filteredExercises.length > 0 ? (
            currentExercises.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden">
                <div className={`absolute top-0 right-8 px-3 py-1 rounded-b-lg text-[8px] font-black uppercase text-white z-10 ${item.difficulty?.toLowerCase() === 'advanced' ? 'bg-red-600' : 'bg-blue-600'}`}>{item.difficulty}</div>
                <div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white transition-transform group-hover:scale-110 duration-500 ${item.exerciseType?.toLowerCase().includes('choice') ? 'bg-blue-600' : 'bg-red-600'}`}>{getIcon(item.exerciseType)}</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-[10px] font-black text-blue-500 uppercase mb-4 tracking-widest">{item.exerciseType}</p>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">{item.description}</p>
                </div>
                <button onClick={() => handleOpenExercise(item.id)} className="flex items-center gap-2 font-bold text-blue-700 group/btn">
                  Start Activity <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform"/>
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 italic">No activities found matching your criteria.</div>
          )}
        </div>

        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-all"><ChevronLeft size={20} /></button>
                <span className="text-sm font-bold text-slate-400">Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-all"><ChevronRight size={20} /></button>
            </div>
        )}
      </section>

      {selectedExercise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedExercise(null)} />
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-8 md:p-12 shadow-2xl">
            <button onClick={() => setSelectedExercise(null)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{selectedExercise.exerciseType}</span>
                <h2 className="text-4xl font-bold text-slate-900 mt-2">{selectedExercise.title}</h2>
              </div>
              {selectedExercise.showAnswerKey && (
                <button onClick={() => setRevealAnswers(!revealAnswers)} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all shadow-sm ${revealAnswers ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {revealAnswers ? <EyeOff size={14}/> : <Eye size={14}/>} {revealAnswers ? 'Hide Answers' : 'Reveal Answers'}
                </button>
              )}
            </div>
            <div className="space-y-8">
              {selectedExercise.content?.questions?.map((q: any, idx: number) => {
                const questionId = `q${idx + 1}`;
                const correctAnswer = selectedExercise.answerKey?.[questionId];
                return (
                  <div key={idx} className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                    <p className="font-bold text-xl text-slate-800 mb-6 flex gap-4"><span className="text-blue-600 bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0">{idx + 1}</span> {q.questionText}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options?.map((opt: string, i: number) => {
                        const isCorrect = revealAnswers && opt === correctAnswer;
                        return (<div key={i} className={`px-6 py-4 border-2 rounded-2xl text-sm font-bold transition-all ${isCorrect ? 'bg-green-500 border-green-500 text-white shadow-lg' : 'bg-white border-gray-100 text-slate-600'}`}>{opt}</div>);
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setSelectedExercise(null)} className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold hover:bg-blue-600 transition-all shadow-xl">Complete Lesson</button>
          </div>
        </div>
      )}

      {isPopupLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/70 backdrop-blur-md"><Loader2 className="animate-spin text-blue-600" size={50} /></div>
      )}
    </main>
  );
}

export default Activites;