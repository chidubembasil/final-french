import { Info, Send, User, Mail, MessageSquare, Tag, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function AboutWithContactForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('https://atoilemicronaija-project-sunshine-production2.up.railway.app/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Submission error:", error);
            setStatus('error');
        }
    };

    return (
        <section className="w-full py-20 bg-[#f9f7f4]" id="about">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* LEFT SIDE: ABOUT */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                            <Info size={16} />
                            À propos de l'initiative
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 leading-tight">
                            A Multimedia Hub for <span className="text-blue-700">French Education</span> in <span className="text-red-600">Nigeria</span>
                        </h2>
                        
                        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                            <p>
                                <strong>“À toi le micro Naija”</strong> is a pedagogical platform 
                                designed to strengthen the use of French among young Nigerians, supporting 
                                the <strong>“Bilingual and Competitive”</strong> project.
                            </p>

                            {/* Red Callout Box */}
                            <div className="bg-red-600 text-white p-6 rounded-[2rem] shadow-lg shadow-red-200 transform -rotate-1">
                                <p className="text-base font-medium italic">
                                    "Our mission is to encourage the production of podcasts and promote innovative pedagogical practices based on mediation."
                                </p>
                            </div>
                            
                            <div className="pt-4 space-y-4">
                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-8 h-0.5 bg-red-600"></span>
                                    Our Target Audience
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {["University Students", "FLE Teachers", "French Clubs", "Institutional Partners"].map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-white text-gray-700 rounded-lg text-xs font-semibold border border-red-100 shadow-sm hover:bg-red-50 transition-colors">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: CONTACT FORM (RED & BLUE THEME) */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-red-900/5 border border-gray-100 relative overflow-hidden">
                            
                            {status === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">Message Envoyé!</h3>
                                    <p className="text-gray-500 mt-2">Merci beaucoup. Our team will get back to you shortly.</p>
                                    <button 
                                        onClick={() => setStatus('idle')}
                                        className="mt-8 text-red-600 font-bold hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-bold text-slate-900">Contact Us</h3>
                                        <p className="text-gray-500 mt-2">Have questions? Let's connect and build the future of FLE together.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={18} />
                                                <input 
                                                    type="text" 
                                                    value={formData.name}
                                                    placeholder="Full Name"
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm"
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={18} />
                                                <input 
                                                    type="email" 
                                                    value={formData.email}
                                                    placeholder="Email Address"
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm"
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={18} />
                                            <select 
                                                value={formData.subject}
                                                className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm appearance-none"
                                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                            >
                                                <option>General Inquiry</option>
                                                <option>Podcast Submission</option>
                                                <option>Teacher Resource Help</option>
                                                <option>Technical Support</option>
                                            </select>
                                        </div>

                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-5 text-red-400" size={18} />
                                            <textarea 
                                                value={formData.message}
                                                placeholder="How can we help you?"
                                                rows={4}
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm resize-none"
                                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            ></textarea>
                                        </div>

                                        {status === 'error' && (
                                            <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">Something went wrong. Please try again later.</p>
                                        )}

                                        <button 
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
                                        >
                                            {status === 'loading' ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <Send size={18} />
                                            )}
                                            {status === 'loading' ? "Sending..." : "Send Message"}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}