import { 
    Newspaper, Laptop, Users, Briefcase, ChevronRight, 
    Target, ExternalLink, Image as ImageIcon,
    Loader2, Maximize2, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import NigeriaMap from "../components/NigeriaMap";
import logo from "../assets/img/vecteezy_ms-office-logo-on-transparent-background_14018577.jpg";

interface GalleryHero {
    title: string;
    description: string;
    mediaUrl: string;
    purpose: string;
    subPurpose: string;
}

interface EventImage {
    id: number;
    title: string;
    coverImage: string;
    category: string;
}

function BAC() {
    const navigate = useNavigate();
    const projectGoalsRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null); 
    
    const [heroData, setHeroData] = useState<GalleryHero | null>(null);
    const [eventImages, setEventImages] = useState<EventImage[]>([]);
    const [loadingHero, setLoadingHero] = useState(true);
    const [loadingGallery, setLoadingGallery] = useState(true);
    const [selectedImg, setSelectedImg] = useState<string | null>(null); 
    
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

    useEffect(() => {
        // Fetch Hero
        fetch(`${CLIENT_KEY}api/galleries`)
            .then((res) => res.json())
            .then((data: GalleryHero[]) => {
                const matchingHero = data.find(
                    (item) => item.purpose === "Other Page" && item.subPurpose === "BAC"
                );
                if (matchingHero) setHeroData(matchingHero);
            })
            .finally(() => setLoadingHero(false));

        // Fetch Event Images
        fetch(`${CLIENT_KEY}api/news`)
            .then(res => res.json())
            .then((data: any) => {
                const rawData = Array.isArray(data) ? data : (data.data || []);
                const eventsOnly = rawData.filter((item: any) => item.category === "Event");
                setEventImages(eventsOnly);
            })
            .catch(err => console.error("Gallery Error:", err))
            .finally(() => setLoadingGallery(false));
    }, [CLIENT_KEY]);

    const scrollToProjectGoals = () => projectGoalsRef.current?.scrollIntoView({ behavior: 'smooth' });
    const scrollToGallery = () => galleryRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleRedirect = (isExternal: boolean) => {
        if (isExternal) {
            window.open("https://bac-retour-ng.vercel.app/", "_blank", "noopener,noreferrer");
        } else {
            navigate("/dashboard");
        }
    };

    const card = [
        { icon: Target, title: 'French for Specific Purposes', sub: 'Specialized language training for sectors like business, diplomacy, healthcare, and technology.' },
        { icon: Briefcase, title: 'Enhanced Employability', sub: 'Helping students gain international certifications (DELF/DALF) and prepare for global job markets.' },
        { icon: Laptop, title: 'Modern Resource Centres', sub: 'Upgrading digital employability centres in universities.' },
        { icon: Users, title: 'Professional Networking', sub: 'Promoting student clubs and events that establish French as a key professional asset.' }
    ];

    return (
        <main className="pt-20 bg-white">
            {/* LIGHTBOX MODAL */}
            {selectedImg && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10" onClick={() => setSelectedImg(null)}>
                    <button className="absolute top-10 right-10 text-white hover:rotate-90 transition-transform">
                        <X size={40} />
                    </button>
                    <img src={selectedImg} className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in duration-300" alt="Full view" />
                </div>
            )}

            {/* HERO SECTION */}
            <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
                {loadingHero ? (
                    <div className="absolute inset-0 animate-pulse bg-slate-800 flex items-center justify-center">
                        <Loader2 className="text-blue-600 animate-spin" size={40} />
                    </div>
                ) : (
                    <>
                        <img src={heroData?.mediaUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
                        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-800/40 to-red-700/60" />

                        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-16 gap-6">
                            <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                                <Newspaper color="white" size={16} />
                                <p className="text-xs md:text-sm font-bold tracking-wide uppercase">French Embassy Fund (FEF)</p>
                            </div>
                            <h1 className="text-white text-4xl md:text-7xl font-bold font-serif max-w-4xl leading-tight">{heroData?.title}</h1>
                            <p className="text-white/90 text-lg md:text-xl max-w-xl leading-relaxed">{heroData?.description}</p>
                            
                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={scrollToGallery}
                                    className="px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 group shadow-xl active:scale-95"
                                >
                                    See Events<ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button 
                                    onClick={scrollToProjectGoals}
                                    className="px-8 py-4 bg-blue-600/20 text-white backdrop-blur-md border border-white/30 font-bold rounded-2xl hover:bg-blue-600 transition-all flex items-center gap-2 group active:scale-95"
                                >
                                    About BAC <ChevronRight size={18} className="rotate-90 group-hover:translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* PROJECT GOALS */}
            <div ref={projectGoalsRef} className="w-full flex flex-col justify-center items-center py-24 gap-16 bg-gray-50/50 scroll-mt-24">
                <div className="w-[90%] flex justify-center items-center flex-col gap-4 text-center">
                    <div className="w-12 h-1 bg-blue-600 rounded-full mb-2"></div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Project Goals</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl">
                    {card.map((item, index) => (
                        <div key={index} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between gap-8 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                            <span className={`w-16 h-16 rounded-2xl flex justify-center items-center shadow-lg ${index % 2 === 0 ? 'bg-blue-600' : 'bg-red-600'}`}>
                                <item.icon color="white" size={32} />
                            </span>
                            <div className="space-y-3">
                                <h2 className="font-bold text-xl font-serif text-slate-800 leading-tight">{item.title}</h2>
                                <p className="text-gray-500 text-sm md:text-base">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* LMS SECTION */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3rem] shadow-xl border border-white/5 flex flex-col md:flex-row gap-8 w-[90%] max-w-6xl justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                            <img src={logo} alt="Microsoft 365" className="w-12 h-12" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">LMS Login Portal</h2>
                            <p className="text-gray-400 text-sm mt-1">Microsoft 365 Resources for Lecturers & Students</p>
                        </div>
                    </div>
                    <a href="https://login.microsoftonline.com" target="_blank" className="py-4 px-10 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-lg active:scale-95">
                        Access Resources
                    </a>
                </div>

                {/* MAP SECTION */}
                <div className="w-[90%] max-w-7xl flex flex-col gap-8 py-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">Partner Universities</h2>
                        <p className="text-gray-500">Explore the network of institutions participating in the French Embassy Fund project across Nigeria.</p>
                    </div>
                    <div className="rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl bg-white p-2">
                        {/* The component we just built */}
                        <NigeriaMap />
                    </div>
                </div>

                {/* EVALUATION SECTION */}
                <div className="w-[90%] max-w-6xl overflow-hidden rounded-[3rem] bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl relative group mb-12">
                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-inner">
                                <Target size={40} className="text-white" />
                            </div>
                            <div className="max-w-md">
                                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Evaluation Form</h1>
                                <p className="text-red-50/90 text-lg leading-relaxed">Access the official evaluation portal for faculty and students.</p>
                            </div>
                        </div>
                        <button onClick={() => handleRedirect(true)} className="whitespace-nowrap py-5 px-10 bg-white text-red-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3">
                            Access Portal <ExternalLink size={18} />
                        </button>
                    </div>
                </div>

                {/* IMAGE GALLERY */}
                <div ref={galleryRef} className="w-[90%] max-w-7xl py-20 scroll-mt-24">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                                <ImageIcon size={14} /> <span>Event Visuals</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Project Highlights</h2>
                        </div>
                        <p className="text-gray-500 max-w-sm text-sm">A visual journey through our latest French Embassy Fund workshops and events across Nigeria.</p>
                    </div>

                    {loadingGallery ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-[2.5rem]" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {eventImages.map((img) => (
                                <div 
                                    key={img.id} 
                                    className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700"
                                    onClick={() => setSelectedImg(img.coverImage)}
                                >
                                    <img 
                                        src={img.coverImage} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                        alt={img.title} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">{img.category}</p>
                                            <h3 className="text-white text-xl font-bold leading-tight">{img.title}</h3>
                                        </div>
                                    </div>
                                    <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-blue-600">
                                        <Maximize2 size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default BAC;