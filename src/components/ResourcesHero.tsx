import { BookOpen,ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';


export default function ResourceHero() {
   const navigate = useNavigate();
    return (
        <main className="w-full py-10 flex flex-col items-center bg-[#fcfaf8]" id='resource'>
            <div className="flex flex-col items-center gap-3 mb-16 text-center">
                <span className='px-4 py-1.5 rounded-full flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-bold border border-blue-200'>
                    <BookOpen size={16}/> Tools for educators
                </span>
                <h2 className='font-serif text-4xl text-center font-bold text-slate-900'>Teaching Resources</h2>
                <div className='w-24 h-1 bg-blue-700 rounded-full mt-2'></div>
                <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-10">
                    Find teaching resources, classroom activities, training opportunities, digital tools, and professional development content for French language educators.
                </p>
                <button 
                onClick={() => navigate('/resource')}
                className='text-white bg-blue-800 px-10 py-4 rounded-2xl flex items-center gap-3 font-bold hover:bg-blue-900 transition-all shadow-lg'
            >
                Explore Resources <ArrowRight size={18}/>
            </button>
            </div>

           

            
        </main>
    );
}
      {/* Explore Exercises Section */}
      {/* Explore Exercises Section */}
