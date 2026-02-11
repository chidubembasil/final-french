import { Mail, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  const lastUpdated = "February 11, 2026";

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-blue-400 mb-6">
              <ShieldCheck size={32} />
              <span className="uppercase tracking-widest font-bold text-sm">Legal Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
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
                This Privacy Policy explains how we collect, use, and protect information when you visit our website.
              </p>
            </section>

            {/* Section 1 */}
            <section id="info-collection" className="space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">1</span>
                <h2 className="text-2xl font-bold text-slate-800">1. Information We Collect</h2>
              </div>
              <p className="text-gray-600">
                We only collect information that helps us improve your experience and provide optional marketing content:
              </p>
              
              <div className="grid gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-lg mb-4">Usage Information</h3>
                  <p className="text-gray-500 text-sm mb-4">Automatically collected when you visit the website, including:</p>
                  <ul className="space-y-4 text-gray-600 text-sm">
                    <li className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>Internet Protocol (IP) address, device/browser type and version, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>Pages visited, time spent, and interactions.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>
                        Cookies and similar technologies (
                        <Link to="/cookies" className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4">
                          See our Cookies Policy
                        </Link>)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-lg mb-4">Marketing Information</h3>
                  <p className="text-gray-500 text-sm mb-4">Information collected if you interact with optional marketing content or accept marketing cookies:</p>
                  <ul className="space-y-3 text-gray-600 text-sm">
                    <li className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>Interests and preferences</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>Interaction with marketing messages</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
                <p className="text-sm text-amber-800">
                  <span className="font-bold uppercase tracking-tight mr-2">Note:</span> 
                  We do not require or collect personal login or account information.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">2</span>
                <h2 className="text-2xl font-bold text-slate-800">2. How We Use Your Information</h2>
              </div>
              <p className="text-gray-600">We use the collected information to:</p>
              <ul className="space-y-3">
                {[
                  "Ensure the website functions correctly",
                  "Understand how users interact with our website",
                  "Improve performance and user experience",
                  "Provide optional personalized marketing content (if you opted in)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <ArrowRight className="text-blue-500 mt-1 shrink-0" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">3</span>
                <h2 className="text-2xl font-bold text-slate-800">3. Third-Party Services</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We may use third-party services, such as Google Analytics or advertising networks, to analyze usage and provide marketing content. 
                These services may collect anonymous information as described above.
              </p>
            </section>

            {/* Section 4 - Specific highlight for Cookies */}
            <section className="bg-[#45B1A8]/10 p-8 rounded-[2rem] border border-[#45B1A8]/20">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#45B1A8] text-white font-bold">4</span>
                <h2 className="text-2xl font-bold text-slate-800">4. Cookies and Tracking</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-6">
                Our website uses cookies and similar technologies to enhance your experience, analyze traffic, and deliver optional marketing content. 
              </p>
              <Link to="/cookies" className="inline-flex items-center gap-2 px-6 py-3 bg-[#45B1A8] text-white rounded-xl font-bold shadow-lg hover:bg-[#39968f] transition-all group">
                See our Cookies Policy for details <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </section>

            {/* Sections 5 - 8 */}
            <div className="space-y-12">
              {[
                { id: 5, title: "5. Your Choices", content: "You can disable or manage cookies through your browser settings, opt-out of marketing cookies at any time, or contact us with questions about how we use data." },
                { id: 6, title: "6. Data Security", content: "We implement reasonable measures to protect the information that we collect to ensure the security, integrity, confidentiality, and availability of such data. However, no method is completely secure, and we cannot guarantee absolute security." },
                { id: 7, title: "7. Children’s Privacy", content: "Our website is not intended for children under 13. We do not knowingly collect personal information from children." },
                { id: 8, title: "8. Updates to This Policy", content: "We may update this Privacy Policy from time to time. The latest version will always be available on this page with the date of the last update." },
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

            {/* Section 9 - Contact Us */}
            <section className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6">9. Contact Us</h2>
                <p className="text-slate-300 mb-8 max-w-md">If you have questions about this Privacy Policy, please feel free to reach out to our team.</p>
                <a href="mailto:admin@atoilemicronaija.com" className="inline-flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group w-full sm:w-auto">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Us At</p>
                    <p className="text-lg font-bold">admin@atoilemicronaija.com</p>
                  </div>
                </a>
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-blue-500" />
                  Navigation
                </h3>
                <nav className="space-y-3">
                  <a href="#info-collection" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">1. Info Collection</a>
                  <Link to="/cookies" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Cookies Policy</Link>
                  <Link to="/terms" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Terms of Use</Link>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}