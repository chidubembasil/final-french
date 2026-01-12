import { Newspaper, Laptop, Users, Briefcase, ChevronRight, Target, ExternalLink, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface GalleryHero {
    title: string;
    description: string;
    mediaUrl: string;
    purpose: string;
    subPurpose: string;
}

function BAC() {
    const navigate = useNavigate();
    const [heroData, setHeroData] = useState<GalleryHero | null>(null);
    const [loadingHero, setLoadingHero] = useState(true);
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

    // --- Fetch Dynamic Hero for BAC ---
    useEffect(() => {
        fetch(`${CLIENT_KEY}api/galleries`)
            .then((res) => res.json())
            .then((data: GalleryHero[]) => {
                const matchingHero = data.find(
                    (item) => item.purpose === "Other Page" && item.subPurpose === "BAC"
                );
                if (matchingHero) setHeroData(matchingHero);
            })
            .catch((err) => console.error("BAC Hero Error:", err))
            .finally(() => setLoadingHero(false));
    }, [CLIENT_KEY]);

    // FIX: handleRedirect is now connected to buttons below
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
        { icon: Laptop, title: 'Modern Resource Centres', sub: 'Upgrading digital employability centres in "Gold" and "Silver" beneficiary universities.' },
        { icon: Users, title: 'Professional Networking', sub: 'Promoting student clubs and events that establish French as a key professional asset in Nigeria.' }
    ];

    return (
        <main className="pt-20 bg-white">
            {/* HERO SECTION */}
            <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
                {loadingHero ? (
                    <div className="absolute inset-0 animate-pulse bg-slate-800 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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

                            <h1 className="text-white text-4xl md:text-7xl font-bold font-serif max-w-4xl leading-tight">
                                {heroData?.title}
                            </h1>

                            <p className="text-white/90 text-lg md:text-xl max-w-xl leading-relaxed">
                                {heroData?.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={() => navigate("/activities")}
                                    className="px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 group shadow-xl active:scale-95"
                                >
                                    Start Learning <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                
                                {/* FIX: handleRedirect usage for External Link */}
                                <button 
                                    onClick={() => handleRedirect(true)}
                                    className="px-8 py-4 bg-blue-600/20 text-white backdrop-blur-md border border-white/30 font-bold rounded-2xl hover:bg-blue-600 transition-all flex items-center gap-2 group active:scale-95"
                                >
                                    Visit Portal <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* PROJECT GOALS */}
            <div className="w-full flex flex-col justify-center items-center py-24 gap-16 bg-gray-50/50">
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

                {/* FIX: handleRedirect usage for Internal Dashboard */}
                <div className="mt-8">
                    <button 
                        onClick={() => handleRedirect(false)}
                        className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors"
                    >
                        <LayoutDashboard size={18} /> Access Internal Dashboard
                    </button>
                </div>
            </div>
        </main>
    );
}

export default BAC;