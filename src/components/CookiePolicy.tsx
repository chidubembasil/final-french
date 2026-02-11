import { motion } from 'framer-motion';
import { Cookie, ShieldCheck, BarChart3, Megaphone, ArrowLeft, Mail, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CookiePolicy() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-[#f9f7f4] pt-24 pb-16 px-6 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
            >
                {/* --- HERO SECTION --- */}
                <div className="bg-blue-700 p-8 md:p-14 text-white relative overflow-hidden">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-100 hover:text-white mb-8 transition-colors group relative z-10"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>
                    
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Cookies Policy</h1>
                        <p className="text-blue-100 text-lg font-medium flex items-center gap-2">
                            <Info size={20} /> Last Updated: February 11, 2026
                        </p>
                    </div>

                    {/* Decorative Background Icon */}
                    <Cookie className="absolute right-[-30px] bottom-[-30px] text-white/10 w-72 h-72 -rotate-12 pointer-events-none" />
                </div>

                {/* --- CONTENT SECTION --- */}
                <div className="p-8 md:p-14 text-gray-700 leading-relaxed space-y-12">
                    
                    <section className="bg-blue-50/70 p-8 rounded-[2rem] border border-blue-100">
                        <p className="text-lg md:text-xl italic text-blue-900 leading-relaxed">
                            Our website uses cookies and similar technologies to enhance your experience, understand user behavior, and provide optional marketing content. This policy explains what cookies are, how we use them, and your choices regarding them.
                        </p>
                    </section>

                    {/* 1. What Are Cookies */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white font-bold shrink-0">1</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">What Are Cookies?</h2>
                        </div>
                        <p className="md:pl-14 text-gray-600 text-lg">
                            Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, and interactions, enabling a smoother and more personalized experience.
                        </p>
                    </section>

                    {/* 2. Types of Cookies */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white font-bold shrink-0">2</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">Types of Cookies We Use</h2>
                        </div>
                        
                        <div className="md:pl-14 grid grid-cols-1 gap-5">
                            {/* Necessary */}
                            <div className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white group">
                                <div className="p-3 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">Necessary Cookies</h3>
                                    <p className="text-gray-600">These cookies are necessary for the basic functioning of the app like ensuring secure access.</p>
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white group">
                                <div className="p-3 rounded-xl bg-green-100 text-green-700 group-hover:bg-green-700 group-hover:text-white transition-colors">
                                    <BarChart3 size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">Analytics Cookies</h3>
                                    <p className="text-gray-600">These cookies help us understand how users interact with our app. For example, we use Google Analytics to track page views.</p>
                                </div>
                            </div>

                            {/* Marketing */}
                            <div className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white group">
                                <div className="p-3 rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                                    <Megaphone size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">Marketing Cookies (Optional)</h3>
                                    <p className="text-gray-600">These cookies track your activity to deliver personalized marketing content. You can choose to reject these.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. How We Use */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white font-bold shrink-0">3</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">How We Use Cookies</h2>
                        </div>
                        <ul className="md:pl-14 space-y-4">
                            {[
                                "Ensure the app functions correctly.",
                                "Analyze app usage to improve performance and user experience.",
                                "Deliver optional marketing content tailored to your interests."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-gray-600 text-lg">
                                    <div className="mt-2.5 w-2 h-2 rounded-full bg-blue-700 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 4 & 5. Choice and Third Party */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:pl-14">
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-900 underline decoration-blue-200 decoration-4 underline-offset-4">4. Third-Party Cookies</h2>
                            <p className="text-gray-600">Our website may use cookies from third-party services like Google Analytics. These are subject to their own policies.</p>
                        </section>
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-900 underline decoration-blue-200 decoration-4 underline-offset-4">5. Your Cookie Choices</h2>
                            <p className="text-gray-600">You can manage or disable cookies via browser settings. Note that disabling some may affect functionality.</p>
                        </section>
                    </div>

                    {/* 6. Updates */}
                    <section className="space-y-4 md:pl-14">
                        <h2 className="text-xl font-bold text-gray-900">6. Updates to This Policy</h2>
                        <p className="text-gray-600">We may update this policy. The latest version will always be available on this page.</p>
                    </section>

                    <hr className="border-gray-100" />

                    {/* --- FOOTER / CONTACT --- */}
                    <section className="bg-gray-50 p-10 rounded-[2.5rem] text-center border border-gray-100">
                        <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-6 text-blue-700">
                            <Mail size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 font-serif mb-2">Contact Us</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto ">
                            If you have any questions about our use of cookies, please contact us at:
                        </p>
                        <a 
                            href="mailto:admin@atoilemicronaija.com" 
                            className="text-sm text-center font-bold text-blue-700 hover:text-blue-800 transition-all underline underline-offset-8 decoration-blue-200 hover:decoration-blue-700"
                        >
                            admin@atoilemicronaija.com
                        </a>
                    </section>
                </div>
            </motion.div>
        </main>
    );
}