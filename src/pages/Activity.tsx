import { SplitSquareHorizontal, ArrowRight, PlayCircle, Book, PenTool, ChevronLeft, ChevronRight, CheckCircle2, X, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import pic from "../assets/img/_A1A5053.jpg";

interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string;
  difficulty: string;
  publishedAt: string;
  content?: any; 
}

function Activites() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeType, setActiveType] = useState<string>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 8;
  
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;
  const EXERCISE_TYPES = ['Multiple Choice', 'Gap Filling', 'Matching', 'Sequencing', 'True or False'];
  const DIFFICULTIES = ['Basic', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetch(`${CLIENT_KEY}api/exercises`)
      .then((res) => res.json())
      .then((data) => {
        const finalData = Array.isArray(data) ? data : (data.data || []);
        setExercises(finalData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [CLIENT_KEY]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesType = activeType === 'All' || ex.exerciseType?.toLowerCase() === activeType.toLowerCase();
      const matchesDifficulty = activeDifficulty === 'All' || ex.difficulty?.toLowerCase() === activeDifficulty.toLowerCase();
      const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesDifficulty && matchesSearch;
    });
  }, [exercises, activeType, activeDifficulty, searchQuery]);

  const handleOpenExercise = async (id: number) => {
    setIsPopupLoading(true);
    try {
      const res = await fetch(`${CLIENT_KEY}api/exercises/${id}`);
      const json = await res.json();
      setSelectedExercise(json.data || json);
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
      {/* Hero Section */}
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

      <section className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12 flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1 w-full">
            <p className="text-[10px] font-black uppercase text-blue-600 mb-2 ml-1">Search Activity</p>
            <input type="text" placeholder="Search..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-600" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="w-full lg:w-auto">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Format</p>
            <select className="w-full lg:w-48 px-4 py-4 rounded-2xl bg-gray-50 border-none font-bold text-xs" value={activeType} onChange={(e) => setActiveType(e.target.value)}>
              <option value="All">All Formats</option>
              {EXERCISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="w-full lg:w-auto">
            <p className="text-[10px] font-black uppercase text-red-600 mb-2 ml-1">Difficulty</p>
            <div className="flex gap-2">
              {['All', ...DIFFICULTIES].map(d => (
                <button key={d} onClick={() => setActiveDifficulty(d)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeDifficulty === d ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>{d}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {loading ? [1,2,3,4].map(n => <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-[2.5rem]" />) : 
            currentExercises.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between relative">
                <div className={`absolute top-0 right-8 px-3 py-1 rounded-b-lg text-[8px] font-black uppercase text-white ${item.difficulty?.toLowerCase() === 'advanced' ? 'bg-red-600' : 'bg-blue-600'}`}>{item.difficulty}</div>
                <div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white ${item.exerciseType?.toLowerCase().includes('choice') ? 'bg-blue-600' : 'bg-red-600'}`}>{getIcon(item.exerciseType)}</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-[10px] font-black text-blue-500 uppercase mb-4">{item.exerciseType}</p>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6">{item.description}</p>
                </div>
                <button onClick={() => handleOpenExercise(item.id)} className="flex items-center gap-2 font-bold text-blue-700 group/btn">
                  Start Activity <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform"/>
                </button>
              </div>
            ))
          }
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-3 rounded-xl border border-gray-200 disabled:opacity-30"><ChevronLeft size={20} /></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-12 h-12 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-white text-slate-600'}`}>{i + 1}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-3 rounded-xl border border-gray-200 disabled:opacity-30"><ChevronRight size={20} /></button>
          </div>
        )}
      </section>

      {/* MODAL POPUP */}
      {(selectedExercise || isPopupLoading) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedExercise(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            {isPopupLoading ? (
              <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Loading Activity Content...</p>
              </div>
            ) : selectedExercise && (
              <>
                <div className="flex items-center justify-between p-8 border-b">
                  <div>
                    <h3 className="font-bold text-slate-900 text-2xl">{selectedExercise.title}</h3>
                    <span className="text-xs font-black uppercase text-blue-600 tracking-tighter">{selectedExercise.exerciseType}</span>
                  </div>
                  <button onClick={() => setSelectedExercise(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={28} className="text-gray-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-gray-600 mb-8 leading-relaxed italic">"{selectedExercise.description}"</p>
                    {/* Placeholder for Dynamic Content Rendering */}
                    <div className="space-y-6">
                        <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 font-medium">
                            Interactive question components for {selectedExercise.exerciseType} would render here.
                        </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 border-t bg-white">
                    <button className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-200">
                        Check My Answers
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