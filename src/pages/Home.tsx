import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import pic from "../assets/img/_A1A4704.jpg"
import pic2 from "../assets/img/_A1A4765.jpg"
import pic3 from "../assets/img/_A1A4739.jpg"
import { motion } from 'framer-motion';
import GalleryHero from "../components/Gallery-Hero"
import PodcastHero from "../components/PodcastHero"
import NewsHero from "../components/NewsHero"
import ResourceHero from "../components/ResourcesHero"
import AboutUs from "../components/About"
import BACSection from "../components/BacHero"
import InteractiveActivities from "../components/ActiHero"
import PartnersSection from "../components/Partners"



// // install Swiper modules
// SwiperCore.use([Autoplay]);



export default function Home() {
    type text = {
        title : string,
        subTitle : string,
        img : string,
        color: string
    }

    
    const sliderItem : text[] = [
        {
            title: "À toi le micro Naija",
            subTitle: "Discover an innovative educational platform to master the French language",
            img : pic,
            color: "bg-gradient-to-br from-blue-900/70 via-blue-700/50 to-red-700/70"
        },
        {
            title: "Learn French in Nigeria",
            subTitle: "Empowering teachers from the Badagary Inter-University Center with french training programs",
            img : pic2,
            color: "bg-gradient-to-br from-red-600/70 via-red-500/50 to-blue-800/70"
        },
        {
            title: "Bilingual & Competitive",
            subTitle: "Using varieties of motivating activites to improve learning of french language in classroom",
            img : pic3,
            color: "bg-gradient-to-br from-blue-900/70 via-blue-700/50 to-red-700/70"
        }
    ]
   /*    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }; */
    return (
        <>
            <main className='w-full h-fit  pt-20'>
               <div id="slider" className="relative w-full h-[90dvh] md:h-[90dvh] overflow-hidden">

                    <Swiper 
                        key="home-swiper"
                        modules={[Autoplay]}
                        autoplay={{ delay: 7000, disableOnInteraction: false }}
                        loop
                        slidesPerView={1}
                        >
                        {sliderItem?.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-screen">

                                    {/* Background image */}
                                    <img
                                        src={item.img}
                                        alt="Slide"
                                        className="absolute inset-0 w-full h-full object-cover z-0"
                                    />

                                    {/* Gradient overlay */}
                                    <div className={`absolute inset-0 z-5 ${item.color}`} />

                                    {/* Animated shapes */}
                                    {/* Floating gradient blob */}
                                    <motion.div
                                        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/40 to-red-500/40 blur-3xl z-6"
                                        animate={{ 
                                        rotate: 360, 
                                        scale: [1, 1.2, 1] 
                                        }}
                                        transition={{ 
                                        duration: 25, 
                                        repeat: Infinity, 
                                        ease: "linear" 
                                        }}
                                    />

                                    {/* Pulsing circle */}
                                    <motion.div
                                        className="absolute bottom-24 left-16 w-32 h-32 rounded-full border border-white/30 z-6"
                                        animate={{ 
                                        scale: [1, 1.4, 1], 
                                        opacity: [0.3, 0.1, 0.3] 
                                        }}
                                        transition={{ 
                                        duration: 4, 
                                        repeat: Infinity 
                                        }}
                                    />

                                    {/* Moving line */}
                                    <motion.div
                                        className="absolute bottom-1/3 right-1/4 w-48 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent z-6"
                                        animate={{ 
                                        x: [-80, 80, -80], 
                                        opacity: [0, 1, 0] 
                                        }}
                                        transition={{ 
                                        duration: 5, 
                                        repeat: Infinity 
                                        }}
                                    />

                                    {/* Content */}
                                    <motion.div
                                        className="absolute inset-0 flex flex-col justify-center items-start pl-10 z-10"
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1 }}
                                    >
                                        <h2 className="text-5xl md:text-6xl font-bold text-white max-w-xl font-serif">
                                        {item.title}
                                        </h2>

                                        <p className="text-white/90 mt-4 max-w-lg">
                                        {item.subTitle}
                                        </p>

                                        <motion.div className="flex flex-row gap-2.5">
                                            <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className=" cursor-pointer mt-6 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg shadow-xl"
                                            >
                                            Get Started
                                            </motion.button>
                                            <motion.a
                                            href="#about"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="mt-6 bg-transparent border-2 border-solid border-white text-white hover:bg-transparent hover:text-white px-8 py-3 rounded-lg shadow-xl cursor-pointer"
                                            >
                                            Learn More
                                            </motion.a>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                
<AboutUs/>
<BACSection/>
<InteractiveActivities/>
<PodcastHero />
<ResourceHero/>
<NewsHero />
<GalleryHero />
<PartnersSection/>

               {/*  <div className="w-full h-100 border-2 border-solid border-amber-400">
                    <GalleryHero />
                </div>
 */}
               
               
            </main>

        </>
    );
}