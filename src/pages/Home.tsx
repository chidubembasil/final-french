import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

// Main Swiper Styles
import "swiper/css";
// Effect Styles (Ensure these match your Swiper version)
import "swiper/swiper-bundle.css"; 

import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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
    const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

    useEffect(() => {
        const fetchSliderData = async () => {
            try {
                const response = await fetch(`${CLIENT_KEY}api/galleries`);
                const json = await response.json();
                
                const rawData = Array.isArray(json) ? json : (json.data || []);
                
                const filtered = rawData
                    .map((item: any) => ({
                        id: item.id,
                        ...(item.attributes || item)
                    }))
                    .filter((item: GalleryItem) => item.purpose === "Homepage Image");

                setSliderItems(filtered);
            } catch (error) {
                console.error("Error fetching gallery data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSliderData();
    }, [CLIENT_KEY]);

    const getNavLinks = (subPurpose: string) => {
        const lowerSub = subPurpose?.toLowerCase();
        if (lowerSub === 'fef') return { page: "/resource", anchor: "#resource" };
        if (lowerSub === 'bac') return { page: "/bac", anchor: "#bac" };
        if (lowerSub === 'atoile') return { page: "/activities", anchor: "#activities" };
        return { page: "/", anchor: "#about" };
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className='w-full h-fit pt-12 bg-white'>
            
            {/* CLEAN AUTOMATIC SLIDER */}
            <div id="slider" className="relative w-full h-[90dvh] overflow-hidden">
                <Swiper 
                    key={`hero-${sliderItems.length}`}
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    autoplay={{ 
                        delay: 6000, 
                        disableOnInteraction: false 
                    }}
                    loop={sliderItems.length > 1}
                    speed={1000} // Speed of the fade transition
                    allowTouchMove={true}
                    className="h-full w-full"
                >
                    {sliderItems.map((item, index) => {
                        const links = getNavLinks(item.subPurpose);
                        const gradient = index % 2 === 0 
                            ? "from-blue-900/80 via-blue-800/40 to-transparent" 
                            : "from-red-900/80 via-red-800/40 to-transparent";

                        return (
                            <SwiperSlide key={item.id}>
                                <div className="relative w-full h-full">
                                    <img
                                        src={item.mediaUrl}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    
                                    <div className={`absolute inset-0 z-10 bg-gradient-to-r ${gradient}`} />
                                    
                                    <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-24 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1 }}
                                        >
                                            <h2 className="text-5xl md:text-8xl font-bold text-white max-w-4xl font-serif leading-[1.1] drop-shadow-2xl">
                                                {item.title}
                                            </h2>
                                            <p className="text-white/90 mt-6 max-w-2xl text-lg md:text-2xl font-light leading-relaxed drop-shadow-md">
                                                {item.description}
                                            </p>
                                            
                                            <div className="flex flex-wrap gap-5 mt-10">
                                                <a
                                                    href={links.anchor}
                                                    className="bg-white text-blue-900 px-12 py-5 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-blue-50 transition-colors shadow-xl"
                                                >
                                                    Get Started
                                                </a>
                                                
                                                <Link
                                                    to={links.page}
                                                    className="border-2 border-white/80 text-white px-12 py-5 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-blue-900 transition-all backdrop-blur-sm"
                                                >
                                                    Learn More
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            <div className="flex flex-col">
                <section id="about" className="scroll-mt-20"><AboutUs /></section>
                <section id="bac" className="scroll-mt-20"><BACSection /></section>
                <section id="activities" className="scroll-mt-20"><InteractiveActivities /></section>
                <PodcastHero />
                <section id="resource" className="scroll-mt-20"><ResourceHero /></section>
                <NewsHero />
                <GalleryHero />
                <PartnersSection />
            </div>
        </main>
    );
}