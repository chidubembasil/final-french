import { Mail, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  const lastUpdated = "February 11, 2026";

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 font-sans">
      <div className="max-w-5xl w-full mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden shadow-xl flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock size={18} />
              <p className="text-lg">Last Updated: {lastUpdated}</p>
            </div>
          </div>
        </div>

        {/* Centered Main Container */}
        <div className="w-full flex flex-col items-center space-y-12">
          {/* Intro Section */}
          <section className="text-center max-w-3xl">
            <p className="text-lg text-gray-600 leading-relaxed">
              <strong className="text-slate-900">A toi Le Micro Naija</strong> (“we,” “our,” or “us”) respects your privacy. 
              This Privacy Policy explains how we collect, use, and protect information when you visit our website.
            </p>
          </section>

          {/* Section 1 */}
          <section id="info-collection" className="w-full flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-4 w-full">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">1</span>
              <h2 className="text-2xl font-bold text-slate-800 text-center">1. Information We Collect</h2>
            </div>
            <p className="text-gray-600 text-center max-w-2xl">
              We only collect information that helps us improve your experience and provide optional marketing content:
            </p>
            
            <div className="grid gap-6 w-full max-w-4xl">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Usage Information</h3>
                <p className="text-gray-500 text-sm mb-4">Automatically collected when you visit the website, including:</p>
                <ul className="space-y-4 text-gray-600 text-sm flex flex-col items-center">
                  <li className="flex flex-col items-center gap-2 max-w-lg">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Internet Protocol (IP) address, device/browser type and version, operating system and platform.</span>
                  </li>
                  <li className="flex flex-col items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Pages visited, time spent, and interactions.</span>
                  </li>
                  <li className="flex flex-col items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>
                      Cookies and similar technologies (
                      <Link to="/cookies" className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4">
                        See our Cookies Policy
                      </Link>)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Marketing Information</h3>
                <p className="text-gray-500 text-sm mb-4">Information collected if you interact with optional marketing content or accept marketing cookies:</p>
                <ul className="space-y-3 text-gray-600 text-sm flex flex-col items-center">
                  <li className="flex flex-col items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Interests and preferences</span>
                  </li>
                  <li className="flex flex-col items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Interaction with marketing messages</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center max-w-2xl">
              <p className="text-sm text-amber-800">
                <span className="font-bold uppercase tracking-tight mr-2">Note:</span> 
                We do not require or collect personal login or account information.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="w-full flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-4 w-full">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">2</span>
              <h2 className="text-2xl font-bold text-slate-800 text-center">2. How We Use Your Information</h2>
            </div>
            <p className="text-gray-600 text-center">We use the collected information to:</p>
            <ul className="space-y-3 flex flex-col items-center text-center">
              {[
                "Ensure the website functions correctly",
                "Understand how users interact with our website",
                "Improve performance and user experience",
                "Provide optional personalized marketing content"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <ArrowRight className="text-blue-500 shrink-0" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="w-full flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-4 w-full">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">3</span>
              <h2 className="text-2xl font-bold text-slate-800 text-center">3. Third-Party Services</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-center max-w-3xl">
              We may use third-party services, such as Google Analytics or advertising networks, to analyze usage and provide marketing content. 
              These services may collect anonymous information as described above.
            </p>
          </section>

          {/* Section 4 - Specific highlight for Cookies */}
          <section className="bg-[#45B1A8]/10 p-8 rounded-[2rem] border border-[#45B1A8]/20 w-full max-w-4xl flex flex-col items-center">
            <div className="flex flex-col items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#45B1A8] text-white font-bold">4</span>
              <h2 className="text-2xl font-bold text-slate-800 text-center">4. Cookies and Tracking</h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6 text-center max-w-2xl">
              Our website uses cookies and similar technologies to enhance your experience, analyze traffic, and deliver optional marketing content. 
            </p>
            <Link to="/cookies" className="inline-flex items-center gap-2 px-6 py-3 bg-[#45B1A8] text-white rounded-xl font-bold shadow-lg hover:bg-[#39968f] transition-all group">
              See our Cookies Policy for details <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>

          {/* Sections 5 - 8 */}
          <div className="space-y-12 w-full flex flex-col items-center">
            {[
              { id: 5, title: "5. Your Choices", content: "You can disable or manage cookies through your browser settings, opt-out of marketing cookies at any time, or contact us with questions about how we use data." },
              { id: 6, title: "6. Data Security", content: "We implement reasonable measures to protect the information that we collect to ensure the security, integrity, confidentiality, and availability of such data. However, no method is completely secure, and we cannot guarantee absolute security." },
              { id: 7, title: "7. Children’s Privacy", content: "Our website is not intended for children under 13. We do not knowingly collect personal information from children." },
              { id: 8, title: "8. Updates to This Policy", content: "We may update this Privacy Policy from time to time. The latest version will always be available on this page with the date of the last update." },
            ].map((section) => (
              <section key={section.id} className="w-full flex flex-col items-center space-y-4">
                <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-4 w-full">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold">{section.id}</span>
                  <h2 className="text-2xl font-bold text-slate-800 text-center">{section.title}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-center max-w-3xl">{section.content}</p>
              </section>
            ))}
          </div>

          {/* Section 9 - Contact Us */}
          <section className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden w-full max-w-4xl flex flex-col items-center text-center">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-6">9. Contact Us</h2>
              <p className="text-slate-300 mb-8 max-w-md">If you have questions about this Privacy Policy, please feel free to reach out to our team.</p>
              <a href="mailto:admin@atoilemicronaija.com" className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group w-full sm:w-auto">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Mail size={24} />
                </div>
                <div className="flex flex-col items-center sm:items-start gap-0.5">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Us At</p>
                  <p className="text-sm font-bold">admin@atoilemicronaija.com</p>
                </div>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}