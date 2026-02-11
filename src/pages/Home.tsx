import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Swiper Styles
import "swiper/css";
// @ts-expect-error - CSS bundle may not have type declarations in some environments
import "swiper/css/bundle";

// Component Imports
import GalleryHero from "../components/Gallery-Hero";
import PodcastHero from "../components/PodcastHero";
import NewsHero from "../components/NewsHero";
import ResourceHero from "../components/ResourcesHero";
import AboutUs from "../components/About";
import BACSection from "../components/BacHero";
import InteractiveActivities from "../components/ActiHero";
import PartnersSection from "../components/Partners";
import img1 from "../assets/img/Bac.jpg"
import img2 from "../assets/img/Atoile.jpg"
import img3 from "../assets/img/_A1A4779.jpg"

interface GalleryItem {
    id: number;
    title: string;
    description: string;
    mediaUrl: string;
    purpose: string;
    subPurpose: string;
}

interface RawGalleryResponse {
    id: number;
    attributes?: Omit<GalleryItem, 'id'>;
    title?: string;
    description?: string;
    mediaUrl?: string;
    purpose?: string;
    subPurpose?: string;
}

// --- MOCK DATA FOR FALLBACK ---
const MOCK_SLIDER_DATA: GalleryItem[] = [
    {
        id: 101,
        title: "Atoile",
        description: "Atoile Micro Naija is giving teachers and lovers of the French language and culture the platform for personal development and to express themselves.",
        mediaUrl: img2, 
        purpose: "homepage image",
        subPurpose: "atoile"
    },
    {
        id: 102,
        title: "Bilingual and Competitive",
        description: "The Bilingual and Competitive (BAC) is a project of the French Embassy Fund to promote French language in Nigerian Universities across the Six geo-political zones.",
        mediaUrl: img3,
        purpose: "homepage image",
        subPurpose: "bac"
    },
    {
        id: 103,
        title: "French Embassy Fund",
        description: "The French Embassy Fund (FEF) is a program that aims to promote French language and culture in Nigeria and beyond.",
        mediaUrl: img1,
        purpose: "homepage image",
        subPurpose: "fef"
    }
];

export default function Home() {
    const [sliderItems, setSliderItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

    useEffect(() => {
        const fetchSliderData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${CLIENT_KEY}api/galleries`);
                
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                const rawData: RawGalleryResponse[] = Array.isArray(data) ? data : (data.data || []);
                
                const filtered = rawData.map((item: RawGalleryResponse) => ({
                    id: item.id,
                    ...(item.attributes || item)
                } as GalleryItem)).filter((item: GalleryItem) => 
                    item.purpose?.toLowerCase().trim() === "homepage image"
                );
                
                // If API returns valid items, use them. Otherwise, use mock data.
                if (filtered.length > 0) {
                    setSliderItems(filtered);
                } else {
                    setSliderItems(MOCK_SLIDER_DATA);
                }
            } catch (err) {
                console.error("Error fetching gallery data, loading mock data instead:", err);
                setError("Using offline data"); // This uses the 'error' state to fix the warning
                setSliderItems(MOCK_SLIDER_DATA);
            } finally {
                setLoading(false);
            }
        };
        fetchSliderData();
    }, [CLIENT_KEY]);

    const getNavLinks = (subPurpose: string) => {
        const lowerSub = subPurpose?.toLowerCase().trim();
        if (lowerSub === 'fef') {
            return { page: "/resource", anchor: "#resource" };
        } else if (lowerSub === 'atoile') {
            return { page: "/activities", anchor: "#activities" };
        } else if (lowerSub === 'bac') {
            return { page: "/bac", anchor: "#bac" };
        }
        return { page: "/", anchor: "#about" };
    };

    const scrollToSection = (subPurpose: string) => {
        const lower = subPurpose?.toLowerCase().trim();
        let targetId = "about"; 

        if (lower === "fef")      targetId = "resource";
        else if (lower === "atoile") targetId = "activities";
        else if (lower === "bac")    targetId = "bac";

        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className='w-full h-fit pt-12 bg-white scroll-smooth'>
            {/* API Status Indicator (Fixes unused 'error' warning) */}
            {error && <span className="hidden">{error}</span>}

            <div id="slider" className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
                <AnimatePresence mode="wait">
                    {sliderItems.length > 0 ? (
                        <Swiper 
                            key={`home-swiper-${sliderItems.length}`}
                            modules={[Autoplay, Navigation, Pagination]}
                            autoplay={{ delay: 7000, disableOnInteraction: false }}
                            loop={sliderItems.length > 1}
                            slidesPerView={1}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            navigation={sliderItems.length > 1}
                            className="h-full w-full"
                        >
                            {sliderItems.map((item, index) => {
                                const links = getNavLinks(item.subPurpose);
                                const gradientClass = index % 2 === 0 
                                    ? "from-blue-900/80 via-blue-700/50 to-red-700/80" 
                                    : "from-red-800/80 via-red-600/50 to-blue-900/80";

                                return (
                                    <SwiperSlide key={`slide-${item.id}-${index}`}>
                                        <div className="relative w-full h-full">
                                            <img
                                                src={item.mediaUrl}
                                                alt={item.title}
                                                className="absolute inset-0 w-full h-full object-cover z-0"
                                            />
                                            <div className={`absolute inset-0 z-[5] bg-gradient-to-br ${gradientClass}`} />
                                            
                                            <div className="absolute inset-0 flex flex-col justify-center items-start px-10 md:px-20 z-10">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.8, delay: 0.2 }}
                                                    className="max-w-4xl"
                                                >
                                                    <h2 className="text-5xl md:text-7xl font-bold text-white max-w-2xl font-serif leading-tight drop-shadow-lg">
                                                        {item.title}
                                                    </h2>
                                                    <p className="text-white/90 text-justify mt-4 max-w-lg text-lg md:text-xl drop-shadow-md ">
                                                        {item.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-4 mt-8">
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <button
                                                                onClick={() => scrollToSection(item.subPurpose)}
                                                                className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-10 py-4 rounded-xl shadow-xl font-bold transition-all uppercase text-sm tracking-widest"
                                                            >
                                                                Get Started
                                                            </button>
                                                        </motion.div>
                                                        
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Link
                                                                to={links.page}
                                                                className="inline-block bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-10 py-4 rounded-xl shadow-xl font-bold transition-all uppercase text-sm tracking-widest"
                                                            >
                                                                Learn More
                                                            </Link>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/50 italic">
                            No homepage images found.
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col gap-0 overflow-hidden w-full">
                <section id="about" className="scroll-mt-20">
                    <AboutUs />
                </section>
                
                <section id="bac" className="scroll-mt-20">
                    <BACSection />
                </section>

                <section id="activities" className="scroll-mt-20">
                    <InteractiveActivities />
                </section>

                <PodcastHero />

                <section id="resource" className="scroll-mt-20">
                    <ResourceHero />
                </section>

                <NewsHero />
                <GalleryHero />
                <PartnersSection />
            </div>
        </main>
    );
}