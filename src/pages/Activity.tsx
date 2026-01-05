import { SplitSquareHorizontal, ArrowRight, X, Loader2, PlayCircle, Book, PenTool, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import pic from "../assets/img/_A1A5053.jpg";

interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string;
  publishedAt: string;
  content?: any; // Changed to any to handle both string and object
}

function Activites() {
  // Data States
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(8);

  // Exercise Progress State
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // 1. Fetch all exercises
  useEffect(() => {
    fetch(`${CLIENT_KEY}api/exercises`)
      .then((res) => res.json())
      .then((data) => {
        // Handle Strapi or direct array response
        const finalData = Array.isArray(data) ? data : (data.data || []);
        setExercises(finalData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [CLIENT_KEY]);

  // 2. Fetch specific exercise details
  const handleOpenExercise = async (id: number) => {
    setIsPopupLoading(true);
    setAnswers({}); 
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${id}`);
      const json = await res.json();
      
      // FIX: Accessing the correct data level (json.data for Strapi)
      const exerciseData = json.data || json; 
      setSelectedExercise(exerciseData);
    } catch (err) {
      console.error("Error fetching exercise details:", err);
    } finally {
      setIsPopupLoading(false);
    }
  };

  // 3. POST Answers to Server
  const handleSubmitAnswers = async () => {
    if (!selectedExercise) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${CLIENT_KEY}api/exercises/${selectedExercise.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId: selectedExercise.id,
          answers: answers,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      alert("Félicitations ! Your answers have been submitted successfully.");
      setSelectedExercise(null);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error: Could not submit answers. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper: Safely parse content (Fixes "questions not popping up")
  const getParsedContent = (content: any) => {
    if (!content) return { questions: [] };
    if (typeof content === 'object') return content;
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("JSON Parse error:", e);
      return { questions: [] };
    }
  };

  // Pagination Logic
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const totalPages = Math.ceil(exercises.length / exercisesPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'mcq': return <PlayCircle size={32} />;
      case 'vocabulary': return <Book size={32} />;
      case 'grammar': return <PenTool size={32} />;
      default: return <Globe size={32} />;
    }
  };

  const calculateProgress = () => {
    const content = getParsedContent(selectedExercise?.content);
    const totalQuestions = content.questions?.length || 0;
    const answeredCount = Object.keys(answers).length;
    return totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  };

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen">
      {/* HERO SECTION */}
      <div className="relative w-full h-[90dvh] overflow-hidden">
        <img src={pic} alt="Hero" className="absolute inset-0 w-full h-full object-cover object-top z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-red-700/80" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
          <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
            <SplitSquareHorizontal color="white" size={17} />
            <p className="text-sm font-bold uppercase tracking-wider">Interactive Learning</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif">Interactive Activities</h1>
          <p className="text-white text-xl max-w-xl opacity-90">Practice French with exercises based on our podcasts.</p>
        </div>
      </div>

      {/* GRID SECTION */}
      <section className="py-20 px-6 md:px-20">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900">Choose Your Activity</h2>
            <div className="w-20 h-1 bg-blue-700 mt-2"></div>
          </div>
          <p className="text-slate-500 font-medium">Showing {indexOfFirstExercise + 1}-{Math.min(indexOfLastExercise, exercises.length)} of {exercises.length} activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {loading ? (
             [1,2,3,4].map(n => <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-[2.5rem]" />)
          ) : (
            currentExercises.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between">
                <div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white ${item.exerciseType === 'mcq' ? 'bg-blue-600' : 'bg-red-600'}`}>
                    {getIcon(item.exerciseType)}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6">{item.description}</p>
                </div>
                <button 
                  onClick={() => handleOpenExercise(item.id)}
                  className="flex items-center gap-2 font-bold text-blue-700 group/btn"
                >
                  Start Activity <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform"/>
                </button>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30"><ChevronLeft size={20} /></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => paginate(i + 1)} className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-white border border-gray-200 text-slate-600'}`}>{i + 1}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30"><ChevronRight size={20} /></button>
          </div>
        )}
      </section>

      {/* MODAL POPUP */}
      {(selectedExercise || isPopupLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedExercise(null)} />
          <div className="relative z-10 bg-white w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col">
            {isPopupLoading ? (
              <div className="p-20 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-blue-700" size={48} />
                <p className="font-bold text-slate-600">Preparing your exercise...</p>
              </div>
            ) : (
              <>
                <div className="sticky top-0 bg-white z-20">
                  <div className="p-8 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedExercise?.title}</h3>
                      <p className="text-xs font-black uppercase tracking-widest text-blue-600 mt-1">{selectedExercise?.exerciseType}</p>
                    </div>
                    <button onClick={() => setSelectedExercise(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100">
                    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${calculateProgress()}%` }} />
                  </div>
                </div>

                <div className="p-8 overflow-y-auto">
                  <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 italic text-slate-700">
                    {selectedExercise?.description}
                  </div>
                  <div className="space-y-10">
                    {(() => {
                      const content = getParsedContent(selectedExercise?.content);
                      const questions = content.questions || [];
                      if (questions.length === 0) return <p className="text-center text-gray-400">Activity content could not be loaded.</p>;

                      return questions.map((q: any, idx: number) => (
                        <div key={idx} className="space-y-5">
                          <h4 className="font-bold text-lg text-slate-800 flex gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">{idx + 1}</span>
                            {q.question}
                          </h4>
                          <div className="grid grid-cols-1 gap-3 pl-11">
                            {q.options?.map((opt: string, optIdx: number) => (
                              <label key={optIdx} className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${answers[idx] === opt ? 'bg-blue-50 border-blue-600 text-blue-900 font-medium' : 'hover:bg-gray-50 border-gray-100'}`}>
                                <input type="radio" name={`q-${idx}`} className="hidden" onChange={() => setAnswers({...answers, [idx]: opt})} />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[idx] === opt ? 'border-blue-600' : 'border-gray-300'}`}>
                                  {answers[idx] === opt && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                </div>
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                <div className="p-8 border-t bg-gray-50 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">
                    {Object.keys(answers).length} of {getParsedContent(selectedExercise?.content).questions?.length || 0} completed
                  </span>
                  <button 
                    onClick={handleSubmitAnswers}
                    disabled={isSubmitting || Object.keys(answers).length === 0}
                    className="px-10 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-xl shadow-red-100"
                  >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    Submit Answers
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Activites;