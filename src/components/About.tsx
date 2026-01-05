import { Users, Lightbulb } from "lucide-react";
import pic from "../assets/img/_A1A4779.jpg"

export default function AboutUs() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Visual Side */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
              <img 
                src={pic} // 2. Use the variable here
                alt="À toi le micro Naija Project" 
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest">
              Digital Initiative
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
              À toi le micro Naija
            </h2>
            <div className="w-20 h-1.5 bg-red-600 rounded-full"></div>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              Part of the broader **French Education Fund (FEF)** cooperation framework, this initiative 
              strengthens the learning and use of French among young Nigerians. We aim to improve the 
              professional relevance of language training and support teachers through innovative 
              pedagogical resources.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Innovative Pedagogy</h4>
                  <p className="text-sm text-slate-500">Supporting teachers with digital platforms and mediation activities.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Community Hub</h4>
                  <p className="text-sm text-slate-500">A central hub for French teachers' associations and institutional partners.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}