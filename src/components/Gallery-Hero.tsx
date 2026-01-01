import { Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GalleryHero() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://atoilemicronaija-project-sunshine-production2.up.railway.app/api/gallery?limit=4')
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error("Gallery Hero fetch error:", err));
    }, []);

    return (
        <main className="w-full py-16 flex flex-col items-center bg-[#f9f7f4]">
            <div className="flex flex-col items-center gap-3 mb-12 text-center">
                <span className='px-4 py-1.5 rounded-full flex items-center gap-2 bg-blue-100 text-blue-600 text-sm font-medium'>
                    <Sparkles size={16}/> Visual documentation
                </span>
                <h2 className='font-serif text-5xl font-bold'>Gallery</h2>
                <div className='w-24 h-1 bg-blue-700 rounded-full'></div>
            </div>

            <div className="w-[90%] max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {items.map((item: any) => (
                    <div 
                        key={item.id} 
                        onClick={() => navigate('/gallery')}
                        className="group relative h-80 rounded-[2rem] overflow-hidden shadow-md bg-white border-4 border-white transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                    >
                        <img 
                            src={item.imageUrl || item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                            <h3 className="text-white font-bold text-lg">{item.title}</h3>
                            <p className="text-gray-300 text-xs line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => navigate('/gallery')}
                className='text-white bg-blue-700 px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-200'
            >
                View Gallery <ArrowRight size={18}/>
            </button>
        </main>
    );
}