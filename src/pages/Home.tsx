import { Swiper, SwiperSlide } from "swiper/react";
import  Autoplay  from "swiper"; // this works in v12
import "swiper/css";   
// import "swiper/css";
// import "swiper/css/autoplay";
import { Languages, FileText, Users, Edit, Image, Podcast  } from "lucide-react";
import { Link } from 'react-router-dom';
import pic from "../assets/img/_A1A4704.jpg"
import pic2 from "../assets/img/_A1A4765.jpg"
import pic3 from "../assets/img/_A1A4739.jpg"
import { motion } from 'framer-motion';

// // install Swiper modules
// SwiperCore.use([Autoplay]);



export default function Home() {
    type text = {
        title : string,
        subTitle : string,
        img : string,
        color: string
    }

    type cardTxt = {
        icon : React.FC<React.SVGProps<SVGSVGElement>>,
        title : string,
        direction : string,
        text: string



    }


    const card : cardTxt[] = [
        {
            icon: Podcast,
            title: "Podcasts",
            direction: "/podcast",
            text: "Listen to engaging French language learning podcasts"
        },
         {
            icon: FileText,
            title: "News & Blog",
            direction: "/news&blog",
            text: "Stay updated with latest news and articles about French education"
        },
         {
            icon: Edit,
            title: "Interactive Exercises",
            direction: "/interactive-exercises",
            text: "Practice with interactive exercises and quizzes"
        },
         {
            icon: Image,
            title: "Galleries",
             direction: "/gallery",
            text: "View photos and videos from our educational events"
        },
         {
            icon: Languages,
            title: "Resources",
            direction: "/interactive-exercises",
            text: "Explore mediation activities, lesson plans, and recommended platforms"
        },
         {
            icon: Users,
            title: "Community",
            direction: "/B.A.C",
            text: "Connect with teachers, learners, and associations from across the region"
        },
    ]

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
            color: "bg-gradient-to-br from-red-800/70 via-blue-800/50 to-blue-900/70"
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
               <div id="slider" className="w-full h-screen relative overflow-hidden">

                <Swiper
                     modules={[Autoplay] as any}
  autoplay={{ delay: 7000 }}
  loop
  slidesPerView={1}
                >
                    {sliderItem.map((item, index) => (
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
                            <h2 className="text-5xl md:text-6xl font-bold text-white max-w-xl">
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
                                <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-6 bg-transparent border-2 border-solid border-white text-white hover:bg-transparent hover:text-white px-8 py-3 rounded-lg shadow-xl cursor-pointer"
                                >
                                Learn More
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        </div>
                    </SwiperSlide>
                    ))}
                </Swiper>
                </div>



                <div className="w-full h-fit flex flex-col justify-center items-center p-7 mb-20 gap-20 bg-[#fafbfc]">
                    <div className="w-[90%] flex flex-col h-fit justify-center items-center gap-4">
                        <h2 className="text-5xl font-bold text-center text-blue-800">Welcome to À toi le micro Naija</h2>
                        <p className='text-xl text-gray-500 text-center'>A digital initiative to strengthen French language learning in Nigeria</p>
                        <h3 className="text-2xl font-bold text-center ">
                            Featured Projects
                        </h3>
                    </div>

                    <div className="w-[90%] grid grid-cols-1 h-fit grid-rows-1 place-items-center  md:grid-cols-2 grid-rows-3 gap-4.5 lg:grid-cols-3 grid-rows-2 ">

                        {
                            card.map((item, index)=>{
                                const IconName : any = item.icon
                                return (
                                    <Link to={item.direction} className="w-60 h-60 rounded-xl border border-t-4 border-t-blue-800 border-r-0 border-l-0 border-b-0 drop-shadow-sm p-3 bg-white flex flex-col space-y-2  md: w-70 h-70" key={index}>
                                    <div className="w-15 h-15 flex justify-center items-center bg-blue-100 rounded-lg" key={index}>
                                        <IconName className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className='text-black font-extrabold font-serif text-xl'>{item.title}</h3>
                                    <p className='text-gray-500 text-lg'>{item.text}</p>
                                    </Link>
                                );
                            })
                        }
                        
                    </div>
                </div>
                                
                    <div className='flex flex-col justify-between px-20 lg: flex flex-row gap-16 mb-15'>
                        <div className='w-full flex flex-col gap-10 rounded-xl border border-t-4 border-t-red-700 border-r-0 border-l-0 border-b-0 drop-shadow-sm h-fit  shadow-md drop-shadow-sm rounded-3xl p-5'>
                            <h1 className='text-red-700 text-center text-3xl font-bold'>About Us</h1>
                            <p className='text-justify'>
                                À toi le micro Naija is a digital initiative supported by the Embassy of France in Nigeria and developed within the framework of the French Education Fund (FEF). It forms part of the wider “Bilingual and Competitive” project, which aims to strengthen the learning and use of French among Nigerian youth, empower teachers with modern pedagogical tools, and highlight innovative educational cooperation across the country.
                                Our platform brings together key actors in French language education—teachers, students, institutions, and associations—and provides a dedicated online space to promote collaboration, creativity, and high-quality learning resources.

                            </p>
                        </div>
                        <div className='w-full flex flex-col gap-10 rounded-xl border border-t-4 border-t-red-700 border-r-0 border-l-0 border-b-0 drop-shadow-sm h-fit shadow-md drop-shadow-sm rounded-3xl p-5 flex justify-center items-center flex-col'>
                            <h1 className='text-red-700 text-center text-3xl font-bold'>Contact Us</h1>
                            <form action="" method="get" className='w-[90%] h-fit  '>
                                <ul className='w-full flex flex-col'>
                                    <label htmlFor="name">Fullname</label>
                                    <input type="text" name="name" id="name"  className='h-10 w-[80%] border border-solid p-1 border-black rounded-lg '/>
                                </ul>
                                <ul className='w-full flex flex-col'>
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" id="email"  className='h-10 w-[80%] border border-solid p-1 border-black rounded-lg '/>
                                </ul>
                                <ul className='w-full flex flex-col'>
                                    <label htmlFor="message">Message</label>
                                    <textarea name="message" id="message" className='h-30 w-[80%] p-1 border border-solid border-black rounded-lg'></textarea>
                                </ul>
                            </form>
                        </div>
                    </div>
                    
                    <div className='bg-gradient-to-r from-blue-800 from-[60%] to-red-700 h-80 w-full flex justify-center items-center flex-col gap-5 mb-20'>
                        <h1 className='text-white text-5xl text-center '>Ready to Learn French?</h1>
                        <p className="text-white text-lg">Join thousands of students learning French with À toi le micro Naija</p>
                        <button type="button" className='bg-white text-blue-800 h-10 w-40 rounded-xl cursor-pointer'>Get Started Now</button>
                    </div>
               
            </main>

        </>
    );
}