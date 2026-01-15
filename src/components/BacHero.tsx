import { GraduationCap, Building2, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function BACSection() {
  const pillars = [
    {
      title: "Master's Programme",
      desc: "Developing 'French for Specific Purposes' curricula aligned with business, diplomacy, healthcare, and technology.",
      icon: <GraduationCap className="text-white" />,
      color: "bg-blue-600"
    },
    {
      title: "Resource Centres",
      desc: "Establishing employability hubs in Gold and Silver level universities with digital tools and teacher training.",
      icon: <Building2 className="text-white" />,
      color: "bg-red-600"
    },
    {
      title: "Global Mobility",
      desc: "Positioning French as an economic asset to reduce youth unemployment and open international opportunities.",
      icon: <Globe2 className="text-white" />,
      color: "bg-blue-600"
    }
  ];

  // Abbreviations updated based on the provided map data
  const universities = {
    gold: [
      "UNIABUJA", "RSU", "KASU", "UNILORIN", "LASU", 
      "OAU", "MAAUN", "UNIZIK", "UNIMAID", "LCU","MOUAU"
    ],
    silver: [
      "UNISOK", "ABU", "EBSU", "UI", 
      "OOU", "ACHIEVERS", "UNILAG", "UNN", "UNIPORT", "UNICAL", "UDUS"
    ]
  };

  return (
    <section className="py-24 bg-[#fcfaf8]" id="bac">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase mb-4">
              FEF Initiative • Embassy of France
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              Bilingual & <span className="text-red-600">Competitive</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Making Nigerian graduates bilingual in English and French to boost employability 
              and global competitiveness. Positioning French as a professional asset for the 21st century.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, i) => (
            <Link to={"/bac"} key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
              <div className={`w-14 h-14 ${pillar.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-gray-200`}>
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{pillar.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {pillar.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* University Tiers Card */}
        <div className="bg-blue-700 rounded-[3rem] p-8 md:p-12 text-white overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Participating Universities</h3>
              <p className="text-blue-100 mb-8">
                The Bilingual and Competitive project provides multi-level support to strengthen French departments 
                and establish Resource and Employability Centres across Nigeria.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/10">DELF/DALF Certifications</span>
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/10">Industry Links</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Gold Tier */}
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="font-black uppercase text-xs tracking-widest text-yellow-400">Gold Level</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {universities.gold.map(uni => (
                    <span key={uni} className="text-[10px] font-bold bg-blue-800/50 px-2 py-1 rounded-lg border border-white/5">{uni}</span>
                  ))}
                </div>
              </div>

              {/* Silver Tier */}
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="font-black uppercase text-xs tracking-widest text-slate-300">Silver Level</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {universities.silver.map(uni => (
                    <span key={uni} className="text-[10px] font-bold bg-blue-800/50 px-2 py-1 rounded-lg border border-white/5">{uni}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Building2 className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
        </div>
      </div>
    </section>
  );
}