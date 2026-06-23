import { ArrowRight, Sparkles, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InteractiveActivities() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen pt-10 pb-5 px-6 bg-white" id="activities">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-7">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6">
          <Sparkles size={16} /> Practice with our exercises
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
          Learn French
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Explore Exercises Section */}
      <div className="max-w-7xl mx-auto">
        <div className=" rounded-[3rem] p-4 md:p-4 border border-gray-100 shadow-sm text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8">
            <LayoutGrid size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Explore All Exercises
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-7">
            Access practical resources, language tips, exercises, videos, and learning tools to help you improve your French at every level.
          </p>

          <button 
            onClick={() => navigate('/activities')}
            className="group relative bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-xl shadow-red-100 transition-all active:scale-95 flex items-center gap-3"
          >
            Explore
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          
        </div>
      </div>
    </main>
  );
}