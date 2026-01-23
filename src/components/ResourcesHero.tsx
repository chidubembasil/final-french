import { BookOpen, FileText, Video, Link as LinkIcon, Download, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResourceHero() {
    // ✅ Keep as empty array to prevent .map() crashes
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Ensure the key exists or fallback to empty string
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

    useEffect(() => {
        setLoading(true);
        fetch(`${CLIENT_KEY}api/resources?limit=4`)
            .then((res) => {
                // Check if response is okay before parsing JSON
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((data) => {
                console.log("Resource Data:", data);
                
                // ✅ CRITICAL FIX: Robust check for Array
                // This handles cases where data is { data: [...] }, an array [...], or null
                let finalData = [];
                if (Array.isArray(data)) {
                    finalData = data;
                } else if (data && Array.isArray(data.data)) {
                    finalData = data.data;
                }

                setResources(finalData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Resource fetch error:", err);
                setResources([]); // ✅ Reset to empty array on error to prevent .map crash
                setLoading(false);
            });
    }, [CLIENT_KEY]); // Added CLIENT_KEY as dependency

    const getTypeStyles = (type: string) => {
        // Safe check for type
        const t = typeof type === 'string' ? type.toUpperCase() : 'DEFAULT';
        if (t === 'PDF') return { bg: 'bg-blue-50', text: 'text-blue-600', icon: <FileText size={24} /> };
        if (t === 'VIDEO') return { bg: 'bg-red-50', text: 'text-red-600', icon: <Video size={24} /> };
        if (t === 'LINK' || t === 'EXTERNAL') return { bg: 'bg-rose-50', text: 'text-rose-600', icon: <LinkIcon size={24} /> };
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: <Download size={24} /> };
    };

    return (
        <main className="w-full py-20 flex flex-col items-center bg-[#fcfaf8]" id='resource'>
            <div className="flex flex-col items-center gap-3 mb-16 text-center">
                <span className='px-4 py-1.5 rounded-full flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-bold border border-blue-200'>
                    <BookOpen size={16}/> Tools for educators
                </span>
                <h2 className='font-serif text-4xl text-center font-bold text-slate-900'>Teaching Resources</h2>
                <div className='w-24 h-1 bg-blue-700 rounded-full mt-2'></div>
            </div>

            <div className="w-[90%] max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {loading ? (
                    [1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-32 w-full bg-gray-200 animate-pulse rounded-[2.5rem]" />
                    ))
                ) : (Array.isArray(resources) && resources.length > 0) ? (
                    resources.map((res: any, index: number) => {
                        // Safe access to styles
                        const styles = getTypeStyles(res?.type);
                        return (
                            <div 
                                key={res?.id || res?._id || index}
                                onClick={() => navigate(res.url)}
                                className="group flex items-center p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden cursor-pointer"
                            >
                                <div className={`w-16 h-16 shrink-0 rounded-2xl ${styles.bg} ${styles.text} flex items-center justify-center`}>
                                    {styles.icon}
                                </div>
                                <div className="ml-6 flex-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">
                                        {res?.type || 'Resource'}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700">
                                        {res?.title || res?.name || "Untitled Resource"} 
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                        {res?.description || res?.summary || "No description available"}
                                    </p>
                                </div>
                                <div className="ml-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className='text-black bg-black text'><ArrowRight size={20}  /></a>
                                    
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-400">
                        No resources found. Check your API connection.
                    </div>
                )}
            </div>

            <button 
                onClick={() => navigate('/resource')}
                className='text-white bg-blue-800 px-10 py-4 rounded-2xl flex items-center gap-3 font-bold hover:bg-blue-900 transition-all shadow-lg'
            >
                Explore Resources <ArrowRight size={18}/>
            </button>
        </main>
    );
}