import { useState, useEffect } from 'react';
import { Link, NavLink } from "react-router-dom";
import { Globe, Menu, X, Volume2, VolumeX } from "lucide-react";
import { useSpeech } from './SpeechContext';
import logo from '../assets/img/logo.png';
import logo2 from '../assets/img/img2026.jpg';

function Header() {
    const { speak, isSpeaking, stop } = useSpeech();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const navLink = [
        { path: "/", name: "Home" },
        { path: "/bac", name: "Bilingual and Competitive" },
        { path: "/activities", name: "Learn French" },
        { path: "/podcast", name: "Podcasts" },
        { path: "/resource", name: "If Classe" },
        { path: "/news&blog", name: "News & Blog" },
        { path: "/gallery", name: "Gallery" }
    ];

    const handleSpeak = () => {
        if (isSpeaking) {
            stop();
        } else {
            // Calling speak() with no arguments tells the engine to skip the header
            speak(); 
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (googleSelect) {
            googleSelect.value = lang;
            googleSelect.dispatchEvent(new Event('change'));
        }
    };

    useEffect(() => {
        if (window.document.getElementById('google-translate-script')) return;
        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,fr',
                autoDisplay: false,
            }, 'google_translate_element');
            setIsLoaded(true);
        };
        const addScript = document.createElement('script');
        addScript.id = 'google-translate-script';
        addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        addScript.async = true;
        document.body.appendChild(addScript);
    }, []);

    return (
        <header className="h-20 w-full px-6 fixed top-0 left-0 z-[1000] bg-white border-b border-gray-100 flex justify-between items-center shadow-sm">
            <style>{`.goog-te-banner-frame.skiptranslate, .goog-te-gadget-simple, .goog-te-balloon-frame, #goog-gt-tt, .skiptranslate { display: none !important; } body { top: 0px !important; }`}</style>
            <div id="google_translate_element" style={{ display: 'none' }}></div>

            <Link to="/" className="shrink-0 flex flex-row gap-0.5">
                <img src={logo2} alt="Ambassade" className="w-12 h-12 md:w-14 object-contain" />
                <img src={logo} alt="Logo" className="w-12 h-12 md:w-14 object-contain" />
            </Link>

            <nav className='hidden lg:flex items-center gap-2'>
                {navLink.map((item, index) => (
                    <NavLink to={item.path} key={index} className={({ isActive }) => isActive ? "text-blue-700 bg-blue-50 rounded-lg px-3 py-2 font-bold" : "text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg px-3 py-2"}>
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="flex items-center gap-4">
                <button 
                    onClick={handleSpeak}
                    className={`p-2 rounded-full transition-all duration-300 ${isSpeaking ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-blue-600 hover:bg-blue-100'}`}
                    aria-label="Listen to content"
                >
                    {isSpeaking ? <VolumeX size={22} className="animate-pulse" /> : <Volume2 size={22} />}
                </button>

                <div className='flex flex-row items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200'>
                    <Globe size={16} className={isLoaded ? "text-blue-600" : "text-gray-400"} />
                    <select onChange={handleLanguageChange} className='bg-transparent text-[10px] md:text-xs font-bold outline-none cursor-pointer uppercase'>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                    </select>
                </div>

                <button className="lg:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <div className={`fixed inset-0 top-20 bg-white z-[900] transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <nav className="flex flex-col p-6 gap-2">
                    {navLink.map((item, index) => (
                        <NavLink to={item.path} key={index} onClick={() => setIsOpen(false)} className={({ isActive }) => `text-lg p-4 rounded-xl ${isActive ? "bg-blue-600 text-white" : "text-gray-800"}`}>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default Header;