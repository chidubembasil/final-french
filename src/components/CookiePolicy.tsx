import { Cookie, ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CookiePolicy() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-white pt-24 pb-24 px-6 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto">
                
                {/* --- HERO SECTION - UNTOUCHED --- */}
                <div className="bg-blue-700 rounded-[2.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-xl mb-16">
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
                            <span className="flex items-center gap-2">
                                <Info size={20} /> Last Updated: February 11, 2026
                            </span>
                        </p>
                    </div>

                    <Cookie className="absolute right-[-30px] bottom-[-30px] text-white/10 w-72 h-72 -rotate-12 pointer-events-none" />
                </div>

                {/* --- PROFESSIONAL BODY CONTENT --- */}
                <div className="max-w-3xl mx-auto space-y-12">
                    
                    {/* Intro Section */}
                    <section>
                        <p className="text-lg leading-relaxed text-slate-700">
                            Our website uses cookies and similar technologies to enhance your experience, understand user behavior, and provide optional marketing content. This policy explains what cookies are, how we use them, and your choices regarding them.
                        </p>
                    </section>

                    <div className="space-y-12">
                        {/* 1. What Are Cookies */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-serif">1. What Are Cookies?</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, and interactions, enabling a smoother and more personalized experience.
                            </p>
                        </section>

                        {/* 2. Types of Cookies */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-serif">2. Types of Cookies We Use</h2>
                            
                            <div className="space-y-8 pl-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Necessary Cookies</h3>
                                    <ul className="list-disc pl-5 text-slate-700 text-sm">
                                        <li>These cookies are necessary for the basic functioning of the app like ensuring secure access.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Analytics Cookies</h3>
                                    <ul className="list-disc pl-5 text-slate-700 text-sm">
                                        <li>These cookies help us understand how users interact with our app. For example, we use Google Analytics to track page views.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Marketing Cookies (Optional)</h3>
                                    <ul className="list-disc pl-5 text-slate-700 text-sm">
                                        <li>These cookies track your activity to deliver personalized marketing content. You can choose to reject these.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 3. How We Use */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-serif">3. How We Use Cookies</h2>
                            <ul className="list-disc pl-9 space-y-3 text-slate-700 text-sm leading-relaxed">
                                <li>Ensure the app functions correctly.</li>
                                <li>Analyze app usage to improve performance and user experience.</li>
                                <li>Deliver optional marketing content tailored to your interests.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-serif">4. Third-Party Cookies</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">Our website may use cookies from third-party services like Google Analytics. These are subject to their own policies.</p>
                        </section>
                        <section className="space-y-3">
                            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-serif">5. Your Cookie Choices</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">You can manage or disable cookies via browser settings. Note that disabling some may affect functionality.</p>
                        </section>

                        {/* 6. Updates */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-serif">6. Updates to This Policy</h2>
                            <p className="text-sm text-slate-600">We may update this policy. The latest version will always be available on this page.</p>
                        </section>

                        {/* Contact Section */}
                        <section className="space-y-3 border-t border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 font-serif mb-4">Contact Us</h2>
                            <p className="text-slate-600 text-sm mb-6">
                                If you have any questions about our use of cookies, please contact us at:
                            </p>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                                <a 
                                    href="mailto:admin@atoilemicronaija.com" 
                                    className="text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors"
                                >
                                    admin@atoilemicronaija.com
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}