import { Mail, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // Assuming you use react-router, otherwise use <a>

export default function PrivacyPolicy() {
  const lastUpdated = "February 11, 2026";

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-blue-400 mb-6">
              <ShieldCheck size={32} />
              <span className="uppercase tracking-widest font-bold text-sm">Legal Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
              Privacy Policy
            </h1>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock size={18} />
              <p className="text-lg">Last Updated: {lastUpdated}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <p className="text-xl text-gray-600 leading-relaxed">
                <strong className="text-slate-900">A toi Le Micro Naija</strong> (“we,” “our,” or “us”) respects your privacy. 
                This Privacy Policy explains how we collect, use, and protect information when you visit our web app.
              </p>
            </section>

            {/* Section 1 */}
            <section id="info-collection" className="space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">1</span>
                <h2 className="text-2xl font-bold text-slate-800">Information We Collect</h2>
              </div>
              <p className="text-gray-600">We only collect information that helps us improve your experience and provide optional marketing content:</p>
              
              <div className="grid gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-2">1. Usage Information</h3>
                  <p className="text-gray-500 text-sm mb-3">Automatically collected when you visit the app, including:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                    <li>IP address and device/browser type</li>
                    <li>Pages visited, time spent, and interactions</li>
                    <li>
                      Cookies and similar technologies (
                      <Link to="/cookies" className="text-blue-600 font-semibold hover:underline decoration-2 underline-offset-4">
                        See our Cookies Policy
                      </Link>)
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-2">2. Marketing Information</h3>
                  <p className="text-gray-500 text-sm mb-3">Collected if you interact with optional marketing content or accept marketing cookies:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
                    <li>Interests and preferences</li>
                    <li>Interaction with marketing messages</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
                <p className="text-sm text-amber-800 italic"><strong>Note:</strong> We do not require or collect personal login or account information.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
               <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">2</span>
                <h2 className="text-2xl font-bold text-slate-800">How We Use Your Information</h2>
              </div>
              <ul className="space-y-3">
                {["Ensure the app functions correctly", "Understand how users interact with our app", "Improve performance and user experience", "Provide optional personalized marketing content (if you opted in)"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <ArrowRight className="text-blue-500 mt-1 shrink-0" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 4 - Specific highlight for Cookies */}
            <section className="bg-[#45B1A8]/10 p-8 rounded-[2rem] border border-[#45B1A8]/20">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#45B1A8] text-white font-bold">4</span>
                <h2 className="text-2xl font-bold text-slate-800">Cookies and Tracking</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our web app uses cookies and similar technologies to enhance your experience, analyze traffic, and deliver optional marketing content. 
              </p>
              <Link to="/cookies" className="inline-flex items-center gap-2 px-6 py-3 bg-[#45B1A8] text-white rounded-xl font-bold shadow-lg hover:bg-[#39968f] transition-all">
                Read our Cookies Policy <ArrowRight size={18} />
              </Link>
            </section>

            {/* Remaining Sections */}
            <div className="space-y-12">
                {[
                    { id: 3, title: "Third-Party Services", content: "We may use third-party services, such as Google Analytics or advertising networks, to analyze usage and provide marketing content. These services may collect anonymous information as described above." },
                    { id: 5, title: "Your Choices", content: "You can disable or manage cookies through your browser settings, opt-out of marketing cookies at any time, or contact us with questions about how we use data." },
                    { id: 6, title: "Data Security", content: "We implement reasonable measures to protect the information that we collect to ensure the security, integrity, confidentiality, and availability of such data. However, no method is completely secure, and we cannot guarantee absolute security." },
                    { id: 7, title: "Children’s Privacy", content: "Our web app is not intended for children under 13. We do not knowingly collect personal information from children." },
                ].map((section) => (
                    <section key={section.id} className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">{section.id}</span>
                            <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{section.content}</p>
                    </section>
                ))}
            </div>

            {/* Contact Section */}
            <section className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                <h2 className="text-3xl font-bold mb-6">Questions?</h2>
                <p className="text-slate-300 mb-8 max-w-md">If you have questions about this Privacy Policy, please feel free to reach out to our administration team.</p>
                <a href="mailto:admin@atoilemicronaija.com" className="inline-flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Us At</p>
                        <p className="text-lg font-bold">admin@atoilemicronaija.com</p>
                    </div>
                </a>
            </section>
          </div>

          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-blue-500" />
                  Quick Links
                </h3>
                <nav className="space-y-3">
                  <Link to="/cookies-policy" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Cookies Policy</Link>
                  <a href="#info-collection" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Information Collection</a>
                  <Link to="/terms" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Terms of Service</Link>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}