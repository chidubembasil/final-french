import {
  Loader2,
  Library,
  ExternalLink,
  CalendarDays,
  Trophy,
  BookOpen,
  Link2,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from "../assets/img/_A1A4786.jpg"
 
// --- Interfaces ---
interface Celebration {
  id: number;
  title: string;
  slug: string;
  content: string;
  celebrationImage?: string;
  eventDate?: string;
  externalUrl?: string;
  status: 'draft' | 'published';
  celebrationType: 'Celebrations' | 'Achievements';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
 
interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}
 
interface StrapiAttributes extends Partial<GalleryHero> {
  purpose?: string;
  subPurpose?: string;
}
 
interface StrapiItem {
  id: number;
  attributes?: StrapiAttributes;
  title?: string;
  description?: string;
  mediaUrl?: string;
  purpose?: string;
  subPurpose?: string;
}
 
interface StrapiResponse {
  data: StrapiItem[];
}
 
function Pedagogies() {
  const navigate = useNavigate();
 
  const IfClasseLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="15" fill="#45B1A8"/>
      <rect x="23" y="27" width="10" height="46" fill="white"/>
      <rect x="42" y="27" width="10" height="46" fill="white"/>
      <rect x="61" y="27" width="16" height="10" fill="white"/>
      <rect x="61" y="45" width="16" height="10" fill="white"/>
    </svg>
  );
 
  const MOCK_HERO: GalleryHero = {
    title: "Education Resources",
    description: "Learn more about the French language, and other resources for teachers and students' development.",
    mediaUrl: img1
  };
 
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
 
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;
 
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [heroRes, celebRes] = await Promise.all([
          fetch(`${CLIENT_KEY}/api/galleries`),
          fetch(`${CLIENT_KEY}/api/celebrations`),
        ]);
 
        const heroes: StrapiResponse = await heroRes.json();
        const celebData = await celebRes.json();
 
        const sortedCelebs = (celebData.data || celebData).sort(
          (a: Celebration, b: Celebration) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setCelebrations(sortedCelebs);
 
        const heroArray = Array.isArray(heroes)
          ? (heroes as unknown as StrapiItem[])
          : heroes.data || [];
 
        const hero = heroArray.find((item: StrapiItem) => {
          const attr = item.attributes || item;
          return (
            attr.purpose?.toLowerCase().trim() === "other page" &&
            attr.subPurpose?.toLowerCase().trim() === "resources"
          );
        });
 
        setHeroData(hero ? ((hero.attributes || hero) as GalleryHero) : MOCK_HERO);
      } catch (err) {
        console.error("Failed to fetch data, showing mock hero:", err);
        setHeroData(MOCK_HERO);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [CLIENT_KEY]);
 
  const achievements = celebrations.filter(c => c.celebrationType === "Achievements");
  const upcomingEvents = celebrations.filter(c => c.celebrationType === "Celebrations");
 
  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen">
 
      {/* HERO */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loading && !heroData ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-white/40" size={48} />
          </div>
        ) : (
          <>
            <img
              src={heroData?.mediaUrl || MOCK_HERO.mediaUrl}
              alt={heroData?.title || MOCK_HERO.title}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 via-blue-800/60 to-red-700/60" />
            <div className="relative z-30 w-full h-full flex flex-col items-start justify-center px-6 md:px-20 gap-5">
              <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Library size={18} />
                <p className="text-sm font-bold uppercase tracking-widest">Resources Library</p>
              </div>
              <h1 className="text-white text-4xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">
                {heroData?.title || MOCK_HERO.title}
              </h1>
              <p className="text-white/90 text-xl max-w-xl">
                {heroData?.description || MOCK_HERO.description}
              </p>
            </div>
          </>
        )}
      </div>
 
      {/* IFCLASSE BANNER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-40">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-8 text-slate-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-600 to-red-600" />
          <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 shrink-0">
            <IfClasseLogo className="w-20 h-20 md:w-24 md:h-24" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold mb-2">IfClasse Pedagogical Portal</h2>
            <p className="text-gray-600 max-w-2xl text-lg">Explore our library of pedagogical PDF resources.</p>
          </div>
          <a
            href="http://ifclasse.institutfrancais.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all"
          >
            Visit Portal <ExternalLink size={18} />
          </a>
        </div>
      </div>
 
      {/* TEACHERS HALL OF FAME */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 gap-8">
        <p className="font-bold text-5xl w-full text-center mt-8 underline">Teachers Hall of fame</p>
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-stretch">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="w-full md:w-1/3 min-h-[150px] rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center relative border border-white/10">
            {achievements[0]?.celebrationImage ? (
              <img src={achievements[0].celebrationImage} alt="Achievements" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-yellow-500/20">
                <Trophy size={64} />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-2xl text-yellow-500">
                  <Trophy size={28} />
                </div>
                <h3 className="text-3xl font-bold">Teachers Hall of Fame</h3>
              </div>
            </div>
            <div className="space-y-3">
              {achievements.length > 0 ? (
                achievements.slice(0, 3).map((rank) => (
                  <div key={rank.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate">{rank.title}</h4>
                      <p>{rank.eventDate ? new Date(rank.eventDate).toLocaleDateString() : 'No Date'}</p>
                      <p className="text-[10px] text-white/50 truncate line-clamp-1">{rank.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-white/20 italic">No rankings available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
 
      {/* EVENTS */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 gap-8">
        <p className="font-bold text-5xl w-full text-center mt-8 underline">Events</p>
        <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-stretch">
          <div className="w-full md:w-1/3 min-h-[150px] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center relative">
            {upcomingEvents[0]?.celebrationImage ? (
              <img src={upcomingEvents[0].celebrationImage} alt="Events" loading="eager" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-red-100">
                <CalendarDays size={64} />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                <CalendarDays size={28} />
              </div>
              <div>
                <h3 className="text-3xl font-bold">Upcoming & Special Events</h3>
                <p className="text-md text-gray-500">Celebrations Calendar</p>
              </div>
            </div>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-red-200 transition-all group flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-sm text-slate-800 truncate">{event.title}</h4>
                      <p className="text-[10px] font-bold text-red-600 uppercase truncate">
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Special Event"}
                        <p className="text-[10px] text-black truncate line-clamp-1">{event.content}</p>
                      </p>
                    </div>
                    {event.externalUrl && (
                      <a href={event.externalUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-xl shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-400 italic">No events currently listed.</div>
              )}
            </div>
          </div>
        </div>
      </div>
 
      {/* ── RESOURCES: 2 MAIN THUMBNAILS ── */}
      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <h1 className="font-bold text-5xl w-full text-center mt-8 underline mb-10">Resources</h1>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 
          {/* Card 1 — Pedagogical Worksheets */}
          <button
            onClick={() => navigate('/worksheet')}
            className="group relative h-80 rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left w-full cursor-pointer"
          >
            {/* BACKGROUND IMAGE */}
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format"
              alt="French worksheets"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

           

            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />

            <div className="relative z-10 h-full flex flex-col justify-end p-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all border border-white/20">
                <BookOpen size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Pedagogical Worksheets</h3>
              <p className="text-white/85 font-medium mb-4 text-sm">
                Structured exercises for Children, Adolescents & Adults · A1 → B2
              </p>
              <div className="flex items-center gap-2 text-white text-sm font-black uppercase tracking-widest">
                Browse Worksheets <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        
         {/* Card 2 — External Resource Links */}
          <button
            onClick={() => navigate('/links')}
            className="group relative h-80 rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left w-full cursor-pointer"
          >
            {/* BACKGROUND IMAGE */}
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format"
              alt="External pedagogical resources"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark overlay + subtle grid */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/70 to-slate-900/40" />
            <div
              className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />

            <div className="relative z-10 h-full flex flex-col justify-end p-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all border border-white/20">
                <Link2 size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">External Resource Links</h3>
              <p className="text-white/80 font-medium mb-4 text-sm">
                Curated collection of external pedagogical links and references
              </p>
              <div className="flex items-center gap-2 text-white text-sm font-black uppercase tracking-widest">
                View All Links <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
          
        </div>
      </div>
    </main>
  );
}
 
export default Pedagogies;