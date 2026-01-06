import { PlayCircle, Book, PenTool, Globe, X, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

// --- Types ---
interface Question {
  question: string;
  options: string[];
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string;
  level: string;
  count: number;
  content?: string;
}

// --- Sub-Component: Exercise Card ---
const ExerciseCard = ({ 
  item, 
  idx, 
  onOpen 
}: { 
  item: Exercise, 
  idx: number, 
  onOpen: (id: number) => void 
}) => {
  const navigate = useNavigate(); // 2. Initialize navigate inside the card

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'listening': return <PlayCircle size={32} />;
      case 'vocabulary': return <Book size={32} />;
      case 'grammar': return <PenTool size={32} />;
      default: return <Globe size={32} />;
    }
  };

  const handleStart = () => {
    // Navigate to the route first, then trigger the modal logic
    navigate('/activities');
    onOpen(item.id);
  };

  return (
    <div className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col justify-between">
      <div>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-white ${idx % 2 === 0 ? 'bg-blue-600' : 'bg-red-600'}`}>
          {getIcon(item.exerciseType)}
        </div>
        <div className="flex gap-2 mb-4">
          <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-500 uppercase">{item.level}</span>
          <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-500 uppercase">{item.count} exercises</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
      </div>
      <button 
        onClick={handleStart} // 3. Updated click handler
        className="mt-8 flex items-center gap-2 font-bold text-blue-600 hover:gap-4 transition-all w-fit"
      >
        Start Learning <ArrowRight size={18} />
      </button>
    </div>
  );
};

// --- Main Component ---
export default function InteractiveActivities() {
  const navigate = useNavigate(); // 4. Initialize navigate for bottom CTA
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  useEffect(() => {
    document.body.style.overflow = (selectedExercise || isPopupLoading) ? 'hidden' : 'unset';
  }, [selectedExercise, isPopupLoading]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(`${CLIENT_KEY}api/exercises`);
        if (!res.ok) throw new Error("Failed to fetch exercises");
        const data = await res.json();
        setExercises(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        setError("Could not load activities. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [CLIENT_KEY]);

  const handleOpenExercise = async (id: number) => {
    setIsPopupLoading(true);
    setAnswers({});
    setError(null);
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${id}`);
      if (!res.ok) throw new Error("Failed to load exercise details");
      const data = await res.json();
      setSelectedExercise(data.data || data);
    } catch (err) {
      alert("Error loading exercise. Please try again.");
    } finally {
      setIsPopupLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedExercise) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${selectedExercise.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) {
        alert("Assessment submitted successfully!");
        setSelectedExercise(null);
      }
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestions = () => {
    try {
      const content = JSON.parse(selectedExercise?.content || '{"questions": []}');
      const questions: Question[] = content.questions || [];
      if (questions.length === 0) return <p className="text-center text-gray-400 py-10">No questions available.</p>;

      return questions.map((q, idx) => (
        <div key={idx} className="space-y-4">
          <p className="font-bold text-lg text-slate-800">{idx + 1}. {q.question}</p>
          <div className="grid gap-3">
            {q.options?.map((opt) => (
              <label key={opt} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${answers[idx] === opt ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input 
                  type="radio" className="hidden" name={`q-${idx}`}
                  checked={answers[idx] === opt}
                  onChange={() => setAnswers({...answers, [idx]: opt})}
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[idx] === opt ? 'border-blue-600' : 'border-gray-300'}`}>
                  {answers[idx] === opt && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>
                <span className="text-slate-700 font-medium">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ));
    } catch (e) {
      return <div className="flex flex-col items-center p-10 text-red-500"><AlertCircle className="mb-2" /><p>Error parsing content.</p></div>;
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfaf8] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6">
          ⚡ Practice with our exercises
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Interactive Activities</h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {error && (
            <div className="text-center p-10 bg-red-50 rounded-2xl text-red-600 mb-10">
                <AlertCircle className="mx-auto mb-2" />
                <p className="font-bold">{error}</p>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-[2rem]" />)
            ) : (
              exercises.map((item, idx) => (
                <ExerciseCard key={item.id} item={item} idx={idx} onOpen={handleOpenExercise} />
              ))
            )}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="mt-20 text-center">
        <button 
          onClick={() => navigate('/activities')} // 5. Added navigate logic here
          className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-red-100 transition-all active:scale-95"
        >
          Browse All Activities →
        </button>
      </div>

      {/* POPUP MODAL */}
      {(selectedExercise || isPopupLoading) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedExercise(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col">
            {isPopupLoading ? (
              <div className="p-20 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="font-bold text-slate-600">Loading Assessment...</p>
              </div>
            ) : (
              <>
                <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedExercise?.title}</h3>
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600">{selectedExercise?.exerciseType}</p>
                  </div>
                  <button onClick={() => setSelectedExercise(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="p-8 overflow-y-auto space-y-10">{renderQuestions()}</div>

                <div className="p-8 border-t bg-gray-50 flex justify-end">
                   <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || Object.keys(answers).length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                   >
                     {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                     Submit Assessment
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