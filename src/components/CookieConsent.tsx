import { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = { necessary: true, analytics: false, marketing: false };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly));
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* --- Cookie Banner --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-blue-600 shadow-[0_-10px_50px_rgba(0,0,0,0.2)] z-[999] animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Blue Icon Section */}
            <div className="flex-shrink-0 bg-blue-50 p-4 rounded-2xl">
              <Cookie className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Privacy <span className="text-blue-600">Preferences</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                We use cookies to optimize your experience on our French language platform. 
                By clicking <span className="font-bold text-blue-600">"Accept All"</span>, you agree to our use of analytics and marketing tools. 
                You can choose to <span className="font-bold text-red-500">Decline</span> non-essential tracking.
              </p>
              
              <div className="mt-4 flex gap-4 text-[10px] font-black uppercase tracking-widest">
                <a href="/privacy-policy" className="text-blue-600 hover:text-red-600 transition-colors underline">Privacy Policy</a>
                <a href="/cookie-policy" className="text-blue-600 hover:text-red-600 transition-colors underline">Cookie Policy</a>
              </div>
            </div>

            {/* Buttons: Blue and Red Theme */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 pt-2">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs uppercase tracking-widest"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={acceptNecessary}
                className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
              >
                Necessary Only
              </button>
              <button
                onClick={acceptAll}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-bold text-xs uppercase tracking-widest"
              >
                Accept All
              </button>
            </div>

            <button onClick={acceptNecessary} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Settings Modal --- */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden border-t-8 border-blue-600">
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Cookie <span className="text-blue-600">Control</span></h2>
                </div>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Necessary (Red Badge) */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900">Essential Data</h3>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white bg-red-500 px-3 py-1 rounded-full">Always On</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">Required for core site features and security.</p>
                </div>

                {/* Analytics (Blue Toggle) */}
                <div className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-900">Analytics</h3>
                    <p className="text-xs text-slate-500">Helps us understand how you use the platform.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })} className="sr-only peer"/>
                    <div className="w-12 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Marketing (Blue Toggle) */}
                <div className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-900">Marketing</h3>
                    <p className="text-xs text-slate-500">Enables personalized content and social media features.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })} className="sr-only peer"/>
                    <div className="w-12 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <button
                  onClick={acceptAll}
                  className="w-full py-4 text-blue-600 font-black uppercase tracking-widest bg-blue-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-[10px]"
                >
                  Accept All
                </button>
                <button
                  onClick={savePreferences}
                  className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all text-[10px]"
                >
                  Save My Choice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;