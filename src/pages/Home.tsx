import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Swiper Styles
// @ts-ignore
import "swiper/css";
// @ts-ignore
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

interface GalleryItem {
    id: number;
    title: string;
    description: string;
    mediaUrl: string;
    purpose: string;
    subPurpose: string;
}

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
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data: GalleryItem[] = await response.json();
                
                console.log("Full API Response:", data);
                console.log("Total items received:", data.length);
                
                // Filter items for the homepage - case insensitive comparison
                const filtered = data.filter(item => {
                    const purposeMatch = item.purpose?.toLowerCase().trim() === "homepage image";
                    console.log(`Item ${item.id}: purpose="${item.purpose}", matches: ${purposeMatch}`);
                    return purposeMatch;
                });
                
                console.log("Filtered homepage images:", filtered);
                console.log("Number of homepage images found:", filtered.length);
                
                if (filtered.length === 0) {
                    console.warn("No items matched 'Homepage Image'. Available purposes:", 
                        [...new Set(data.map(item => item.purpose))]);
                }
                
                setSliderItems(filtered);
            } catch (error) {
                console.error("Error fetching gallery data:", error);
                setError(error instanceof Error ? error.message : "Failed to load slider images");
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
        } else if (lowerSub === 'bac') {
            return { page: "/bac", anchor: "#bac" };
        } else if (lowerSub === 'atoile') {
            return { page: "/activities", anchor: "#activities" };
        }
        return { page: "/", anchor: "#about" };
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading Experience...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4 max-w-md text-center">
                    <div className="text-red-500 text-5xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-slate-800">Failed to Load</h2>
                    <p className="text-slate-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <main className='w-full h-fit pt-12 bg-white'>
                
                {/* Dynamic Hero Slider Section */}
                <div id="slider" className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
                    <AnimatePresence mode="wait">
                        {sliderItems.length > 0 ? (
                            <Swiper 
                                key={`home-swiper-${sliderItems.length}`}
                                modules={[Autoplay, Navigation, Pagination]}
                                autoplay={{ 
                                    delay: 7000, 
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true
                                }}
                                loop={sliderItems.length > 1}
                                slidesPerView={1}
                                spaceBetween={0}
                                speed={800}
                                observer={true}
                                observeParents={true}
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                navigation={sliderItems.length > 1}
                                className="h-full w-full"
                            >
                                {sliderItems.map((item, index) => {
                                    const links = getNavLinks(item.subPurpose);
                                    
                                    // Alternating Gradient Logic
                                    const gradientClass = index % 2 === 0 
                                        ? "from-blue-900/80 via-blue-700/50 to-red-700/80" 
                                        : "from-red-800/80 via-red-600/50 to-blue-900/80";

                                    return (
                                        <SwiperSlide key={`slide-${item.id}-${index}`}>
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={item.mediaUrl}
                                                    alt={item.title || `Slide ${index + 1}`}
                                                    className="absolute inset-0 w-full h-full object-cover z-0"
                                                    loading={index === 0 ? "eager" : "lazy"}
                                                />
                                                
                                                <div className={`absolute inset-0 z-[5] bg-gradient-to-br ${gradientClass}`} />
                                                
                                                <div className="absolute inset-0 flex flex-col justify-center items-start px-10 md:px-20 z-10">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 30 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: false }}
                                                        transition={{ duration: 0.8, delay: 0.2 }}
                                                        className="max-w-4xl"
                                                    >
                                                        <h2 className="text-4xl md:text-5xl font-bold text-white max-w-2xl font-serif leading-tight drop-shadow-lg">
                                                            {item.title}
                                                        </h2>
                                                        <p className="text-white/90 mt-4 max-w-lg text-lg md:text-xl drop-shadow-md">
                                                            {item.description}
                                                        </p>
                                                        <div className="flex flex-wrap gap-4 mt-8">
                                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                <a
                                                                    href={links.anchor}
                                                                    className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-10 py-4 rounded-xl shadow-xl font-bold transition-all uppercase text-sm tracking-widest"
                                                                >
                                                                    Get Started
                                                                </a>
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

                                                {/* Slide Counter */}
                                                <div className="absolute bottom-8 right-8 z-20 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                                                    {index + 1} / {sliderItems.length}
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                                <p className="text-white/50 italic text-xl">No homepage images found.</p>
                                <p className="text-white/30 text-sm">Check console for debugging information</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Page Content Sections */}
                <div className="flex flex-col gap-0 overflow-hidden">
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
        </>
    );
}