import { useState, useEffect } from "react";
import { Users, Lightbulb } from "lucide-react";

export default function AboutUs() {
  const [aboutImg, setAboutImg] = useState<string | null>(null);

  useEffect(() => {
    const loadAboutImage = async () => {
      try {
        const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;
        const res = await fetch(`${CLIENT_KEY}/api/galleries`);
        const data = await res.json();

        const items = Array.isArray(data)? data : data.data || [];

        const found = items.find((item: any) => {
          const slug = (item.slug || "").toLowerCase();
          const purpose = (item.purpose || "").toLowerCase().trim();
          return purpose === "regular image" && slug.endsWith("-about");
        });

        if (found?.mediaUrl) {
          setAboutImg(found.mediaUrl);
        }
        // if API fails or not found, aboutImg stays null - no fallback
      } catch (err) {
        console.error("About image fetch failed:", err);
      }
    };

    loadAboutImage();
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Visual Side */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded- overflow-hidden border-8 border-white shadow-2xl">
              {aboutImg? (
                <img
                  src={aboutImg}
                  alt="À toi le micro Naija Project"
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-gray-100 animate-pulse" />
              )}
            </div>
            {/* Decorative element */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2 space-y-8" id="about-text" >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest">
              Digital Initiative
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
              À toi le micro Naija
            </h2>
            <div className="w-20 h-1.5 bg-red-600 rounded-full"></div>

            <div className="max-w-2xl text-slate-700 text- md:text-base leading-[1.7] text-justify hyphens-none break-normal space-y-4">
              <p className="font-semibold text-slate-800">
                Welcome to À toi le micro, Naija!
              </p>

              <p>
                À toi le micro, Naija! is a dynamic digital platform dedicated to promoting the French language, intercultural dialogue, and educational opportunities in Nigeria.
              </p>

              <p>
                Created with the support of the French Embassy in Nigeria and its partners, the platform brings together learners, teachers, students, and French-language enthusiasts through engaging content, innovative resources, inspiring stories, and professional opportunities.
              </p>

              <p>
                Whether you want to improve your French, discover new learning tools, explore podcasts, access teaching resources, or stay informed about Francophone events and projects such as FEF Bilingual and Competitive, À toi le micro, Naija! is your space to learn, share, and grow.
              </p>

              <p>
                Because French is more than a language, it is a bridge to culture, creativity, education, mobility, and international opportunities.
              </p>
            </div>

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