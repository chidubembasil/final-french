import { PlayCircle, Book, PenTool, Globe, X, Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string; // e.g., 'Listening', 'Vocabulary', 'Grammar', 'Cultural'
  level: string; // e.g., 'A1-B2'
  count: number;
  content?: string;
}

export default function InteractiveActivities() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // 1. Fetch Categories/Exercises
  useEffect(() => {
    fetch(`${CLIENT_KEY}api/exercises`)
      .then((res) => res.json())
      .then((data) => {
        setExercises(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 2. Open Exercise Detail (Popup)
  const handleOpenExercise = async (id: number) => {
    setIsPopupLoading(true);
    setAnswers({});
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${id}`);
      const data = await res.json();
      setSelectedExercise(data.data || data);
    } catch (err) {
      console.error("Error fetching exercise:", err);
    } finally {
      setIsPopupLoading(false);
    }
  };

  // 3. Submit Answers
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'listening': return <PlayCircle size={32} />;
      case 'vocabulary': return <Book size={32} />;
      case 'grammar': return <PenTool size={32} />;
      default: return <Globe size={32} />;
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfaf8] pt-32 pb-20 px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6">
          ⚡ Practice with our exercises
        </div>
        <h1 className="text-4xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Interactive Activities</h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          [1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-[2rem]" />)
        ) : (
          exercises.map((item, idx) => (
            <div 
              key={item.id}
              className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col justify-between"
            >
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
                onClick={() => handleOpenExercise(item.id)}
                className="mt-8 flex items-center gap-2 font-bold text-blue-600 hover:gap-4 transition-all"
              >
                Start Learning <ArrowRight size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 text-center">
        <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-red-100 transition-all active:scale-95">
          Start Learning →
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
                <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedExercise?.title}</h3>
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600">{selectedExercise?.exerciseType}</p>
                  </div>
                  <button onClick={() => setSelectedExercise(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="p-8 overflow-y-auto space-y-10">
                  {/* Mapping through Questions from content JSON */}
                  {(() => {
                    try {
                      const content = JSON.parse(selectedExercise?.content || '{}');
                      const questions = content.questions || [];
                      return questions.map((q: any, idx: number) => (
                        <div key={idx} className="space-y-4">
                          <p className="font-bold text-lg text-slate-800">{idx + 1}. {q.question}</p>
                          <div className="grid gap-3">
                            {q.options?.map((opt: string) => (
                              <label key={opt} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${answers[idx] === opt ? 'border-blue-600 bg-blue-50' : 'border-gray-100'}`}>
                                <input 
                                  type="radio" className="hidden" 
                                  name={`q-${idx}`}
                                  onChange={() => setAnswers({...answers, [idx]: opt})}
                                />
                                <div className={`w-4 h-4 rounded-full border-2 ${answers[idx] === opt ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`} />
                                <span className="text-slate-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ));
                    } catch {
                      return <p className="text-center text-gray-400">Exercise content is not available.</p>;
                    }
                  })()}
                </div>

                <div className="p-8 border-t bg-gray-50 flex justify-end">
                   <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
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