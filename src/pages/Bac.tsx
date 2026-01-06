import { Newspaper, Calendar, ExternalLink, Laptop, Users, Briefcase, ChevronRight, Target } from "lucide-react";
import pic from "../assets/img/_A1A4779.jpg"
import { useNavigate } from "react-router-dom";
import React from "react";

interface PillarCard {
    icon: React.ElementType; 
    title: string;
    sub: string;
}

function BAC() {
    const navigate = useNavigate();

    const handleRedirect = (isExternal: boolean) => {
        if (isExternal) {
            window.location.href = "https://bac-retour-ng.vercel.app/";
        } else {
            navigate("/dashboard");
        }
    };

    // Updated Pillars to match the BAC project's core objectives
    const card: PillarCard[] = [
        {
            icon: Target,
            title: 'French for Specific Purposes',
            sub: 'Specialized language training for sectors like business, diplomacy, healthcare, and technology.'
        },
        {
            icon: Briefcase,
            title: 'Enhanced Employability',
            sub: 'Helping students gain international certifications (DELF/DALF) and prepare for global job markets.'
        },
        {
            icon: Laptop,
            title: 'Modern Resource Centres',
            sub: 'Upgrading digital employability centres in "Gold" and "Silver" beneficiary universities.'
        },
        {
            icon: Users,
            title: 'Professional Networking',
            sub: 'Promoting student clubs and events that establish French as a key professional asset in Nigeria.'
        }
    ];

    return (
        <main className="pt-20 bg-white">
            {/* HERO SECTION */}
            <div className="relative w-full h-[85dvh] md:h-[90dvh] overflow-hidden">
                <img
                    src={pic}
                    alt="Bilingual and Competitive Hero"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* French Embassy Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-800/40 to-red-700/60" />

                <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-16 gap-6">
                    <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                        <Newspaper color="white" size={16} />
                        <p className="text-xs md:text-sm font-bold tracking-wide uppercase">French Embassy Fund (FEF)</p>
                    </div>

                    <h1 className="text-white text-4xl md:text-7xl font-bold font-serif max-w-4xl leading-tight">
                        Bilingual & <span className="text-red-400">Competitive</span>
                    </h1>

                    <p className="text-white/90 text-lg md:text-xl max-w-xl leading-relaxed">
                        A two-year programme empowering Nigerian graduates with French proficiency to compete for international jobs and scholarships.
                    </p>
                    
                    <button 
                        onClick={() => navigate("/activities")}
                        className="mt-4 px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 group shadow-xl active:scale-95"
                    >
                        Start Learning <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* UPDATED PILLARS SECTION */}
            <div className="w-full flex flex-col justify-center items-center py-24 gap-16 bg-gray-50/50">
                <div className="w-[90%] flex justify-center items-center flex-col gap-4 text-center">
                    <div className="w-12 h-1 bg-blue-600 rounded-full mb-2"></div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Project Goals</h1>
                    <p className="text-gray-500 max-w-2xl text-lg">
                        Bridging the gap between academic French and professional success through four strategic pillars.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl">
                    {card.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <div key={index} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between items-start gap-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <span className={`w-16 h-16 rounded-2xl flex justify-center items-center shadow-lg transition-transform group-hover:scale-110 ${index % 2 === 0 ? 'bg-blue-600 shadow-blue-100' : 'bg-red-600 shadow-red-100'}`}>
                                    <IconComponent color="white" size={32} />
                                </span>
                                <div className="space-y-3">
                                    <h2 className="font-bold text-xl font-serif text-slate-800 leading-tight">{item.title}</h2>
                                    <p className="text-gray-500 leading-relaxed text-sm md:text-base">{item.sub}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* EVALUATION SECTION */}
                <div className="w-[92%] max-w-6xl mt-10 py-16 px-8 rounded-[3.5rem] border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-10 bg-white shadow-2xl shadow-blue-50/50 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />
                    
                    <div className="flex flex-col items-center md:items-start gap-6 relative z-10 md:w-2/3 text-center md:text-left">
                        <span className="w-16 h-16 rounded-2xl bg-slate-900 flex justify-center items-center shadow-xl">
                            <Calendar color="white" size={30} />
                        </span>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Evaluation & Reporting</h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Designated technical officers can access the evaluation portal to submit institutional reports and monitor university performance.
                            </p>
                        </div>
                    </div>

                    <button 
                        type="button" 
                        className="w-full md:w-auto px-10 py-5 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all active:scale-95 flex justify-center items-center gap-3 shadow-xl relative z-10" 
                        onClick={() => handleRedirect(true)}
                    >
                        <ExternalLink color="white" size={20} /> Access Portal
                    </button>
                </div>
            </div>
        </main>
    );
}

export default BAC;