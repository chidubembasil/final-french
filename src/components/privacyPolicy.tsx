import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  const lastUpdated = "29 April, 2026";

  return (
    <div className="min-h-screen bg-white pt-24 pb-24 font-sans text-slate-900">
      <div className="max-w-4xl w-full mx-auto px-6">
        
        {/* Header Section - UNTOUCHED */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-16 relative overflow-hidden shadow-xl flex flex-col items-center text-center">
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

        {/* Professional Body Content - Left Aligned & Formal */}
        <div className="space-y-12 max-w-3xl">
          
          {/* Intro */}
          <section>
            <p className="text-lg leading-relaxed text-slate-700">
              <strong className="text-slate-900">A toi Le Micro Naija</strong> (“we,” “our,” or “us”) respects your privacy. 
              This Privacy Policy explains how we collect, use, and protect information when you visit our website.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">1. Information We Collect</h2>
            <p className="text-slate-700">
              We only collect information that helps us improve your experience and provide optional marketing content:
            </p>
            
            <div className="pl-4 space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Usage Information</h3>
                <p className="text-sm text-slate-500 mb-3">Automatically collected when you visit the website, including:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                  <li>Internet Protocol (IP) address, device/browser type and version, operating system and platform.</li>
                  <li>Pages visited, time spent, and interactions.</li>
                  <li>Cookies and similar technologies (<Link to="/cookies" className="text-blue-600 hover:underline">See our Cookies Policy</Link>)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Marketing Information</h3>
                <p className="text-sm text-slate-500 mb-3">Information collected if you interact with optional marketing content or accept marketing cookies:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                  <li>Interests and preferences</li>
                  <li>Interaction with marketing messages</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 border-l-4 border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-600 italic">
                <span className="font-bold uppercase tracking-tight mr-2 text-slate-900">Note:</span> 
                We do not require or collect personal login or account information.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">2. How We Use Your Information</h2>
            <p className="text-slate-700">We use the collected information to:</p>
            <ul className="list-none space-y-3 pl-4">
              {[
                "Ensure the website functions correctly",
                "Understand how users interact with our website",
                "Improve performance and user experience",
                "Provide optional personalized marketing content"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">3. Third-Party Services</h2>
            <p className="text-slate-700 leading-relaxed text-sm">
              We may use third-party services, such as Google Analytics or advertising networks, to analyze usage and provide marketing content. 
              These services may collect anonymous information as described above.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">4. Cookies and Tracking</h2>
            <p className="text-slate-700 leading-relaxed text-sm">
              Our website uses cookies and similar technologies to enhance your experience, analyze traffic, and deliver optional marketing content. 
            </p>
            <Link to="/cookies" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              View full Cookies Policy <ArrowRight size={14} />
            </Link>
          </section>

          {/* Sections 5 - 8 */}
          <div className="space-y-10">
            {[
              { id: 5, title: "5. Your Choices", content: "You can disable or manage cookies through your browser settings, opt-out of marketing cookies at any time, or contact us with questions about how we use data." },
              { id: 6, title: "6. Data Security", content: "We implement reasonable measures to protect the information that we collect to ensure the security, integrity, confidentiality, and availability of such data. However, no method is completely secure, and we cannot guarantee absolute security." },
              { id: 7, title: "7. Children’s Privacy", content: "Our website is not intended for children under 7. We do not knowingly collect personal information from children." },
              { id: 8, title: "8. Updates to This Policy", content: "We may update this Privacy Policy from time to time. The latest version will always be available on this page with the date of the last update." },
            ].map((section) => (
              <section key={section.id} className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                <p className="text-slate-700 leading-relaxed text-sm">{section.content}</p>
              </section>
            ))}
          </div>

          {/* Section 9 - Contact Us */}
          <section className="pt-12 mt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Us</h2>
            <p className="text-slate-600 mb-6 text-sm">If you have questions about this Privacy Policy, please feel free to reach out to our team.</p>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</span>
              <a href="mailto:admin@atoilemicronaija.com" className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                admin@atoilemicronaija.com
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}