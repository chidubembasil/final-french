import { Newspaper, Calendar, ExternalLink, GraduationCap, Circle, Users, Award } from "lucide-react";
import pic from "../assets/img/_A1A4779.jpg"
import { useNavigate } from "react-router-dom";
import React from "react";

// Define the interface to accept a React Component type for the icon
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

    // Removed quotes from icons so they are treated as Component references
    const card: PillarCard[] = [
        {
            icon: GraduationCap,
            title: 'Quality Teaching',
            sub: 'Training and professional development for French language teachers.'
        },
        {
            icon: Circle,
            title: 'Modern Resources',
            sub: 'Equipping institutions with up-to-date pedagogical materials.'
        },
        {
            icon: Users,
            title: 'Student Engagement',
            sub: 'Creating opportunities for learners to practice and showcase their French.'
        },
        {
            icon: Award,
            title: 'Recognition & Awards',
            sub: 'Celebrating excellence in French language learning and teaching.'
        }
    ];

    return (
        <main className="pt-20">
            <div className="relative w-full h-[90dvh] overflow-hidden">
                {/* Background image */}
                <img
                    src={pic}
                    alt="Bilingual and Competitive Hero"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Red + Blue gradient overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/70 via-blue-700/50 to-red-700/70" />

                {/* Content */}
                <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 gap-5">
                    {/* Glass badge */}
                    <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                        <Newspaper color="white" size={17} />
                        <p className="text-sm">French Education Fund</p>
                    </div>

                    <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl">
                        Bilingual & Competitive
                    </h1>

                    <p className="text-white text-lg md:text-xl max-w-xl">
                        Strengthening French language learning and usage among young Nigerians for a bilingual, competitive future.
                    </p>
                </div>
            </div>

            <div className="w-full h-fit flex flex-col justify-center items-center py-20 gap-12 bg-gray-50/50">
                <div className="w-[90%] h-fit flex justify-center items-center flex-col gap-2">
                    <h1 className="text-4xl font-serif font-bold text-slate-900">Our Pillars</h1>
                    <p className="text-gray-500 text-center max-w-2xl">
                        The "Bilingual & Competitive" project is built on four fundamental pillars designed to revolutionize French education.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-7xl">
                    {card.map((item, index) => {
                        // Create a local capitalized variable for the icon component
                        const IconComponent = item.icon;
                        return (
                            <div key={index} className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col justify-center items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <span className="w-16 h-16 rounded-2xl bg-[#dc2828] flex justify-center items-center group-hover:scale-110 transition-transform">
                                    <IconComponent color="white" size={32} />
                                </span>
                                <h2 className="font-bold text-xl font-serif text-slate-800 text-center">{item.title}</h2>
                                <p className="text-center text-gray-500 leading-relaxed">{item.sub}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Evaluation Form Section */}
                <div className="w-[90%] max-w-5xl py-16 px-6 rounded-[3rem] border border-red-100 flex flex-col justify-center items-center gap-6 bg-gradient-to-br from-red-50 via-white to-blue-50 shadow-inner">
                    <span className="w-16 h-16 rounded-2xl bg-[#dc2828] flex justify-center items-center shadow-lg shadow-red-200">
                        <Calendar color="white" size={30} />
                    </span>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 text-center">Evaluation Form</h1>
                    <p className="text-gray-600 text-center max-w-lg leading-relaxed">
                        For technical officers: Access the evaluation form to submit your reports and observations accurately and efficiently.
                    </p>
                    <button 
                        type="button" 
                        className="px-8 py-4 rounded-2xl bg-[#dc2828] text-white font-bold hover:bg-red-700 transition-colors cursor-pointer flex justify-center items-center gap-2 shadow-lg shadow-red-100" 
                        onClick={() => handleRedirect(true)}
                    >
                        <ExternalLink color="white" size={18} /> Access Form
                    </button>
                </div>
            </div>
        </main>
    );
}

export default BAC;