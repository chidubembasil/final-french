import logo from '../assets/img/logo.png';
import { Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

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

    const navLink = [
        { path: "/", name: "Home" },
        { path: "/bac", name: "Bilingual and Competitive" },
        { path: "/news&blog", name: "News & Blog" },
        { path: "/podcast", name: "Podcasts" },
        { path: "/resource", name: "Resources" },
        { path: "/activities", name: "Activities" },
        { path: "/gallery", name: "Gallery" },
    ];

    return (
        <header className="h-20 w-full px-6 fixed top-0 left-0 z-[100] bg-white border-b border-gray-100 flex flex-row justify-between items-center shadow-sm">
            {/* CSS to hide Google Popups and Banners */}
            <style>
                {`
                    .goog-te-banner-frame.skiptranslate, .goog-te-gadget-simple { display: none !important; }
                    body { top: 0px !important; }
                    .goog-te-balloon-frame { display: none !important; }
                    #goog-gt-tt { display: none !important; visibility: hidden !important; }
                .skiptranslate { display: none !important; }
                `}
            </style>

            <div id="google_translate_element" style={{ display: 'none' }}></div>

            <div className="shrink-0">
                <img src={logo} alt="logo" className="w-12 h-12 md:w-14 object-contain" />
            </div>

            <nav className='hidden lg:flex items-center gap-2'>
                {navLink.map((item, index) => (
                    <NavLink 
                        to={item.path} 
                        key={index} 
                        className={({ isActive }) => isActive ? "text-blue-700 bg-blue-50 rounded-lg px-3 py-2 font-bold" : "text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg px-3 py-2"}
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="flex items-center gap-4">
                <div className='flex flex-row items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200'>
                    <Globe size={16} className={isLoaded ? "text-blue-600" : "text-gray-400"} />
                    <select onChange={handleLanguageChange} className='bg-transparent text-xs font-bold outline-none cursor-pointer uppercase'>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                    </select>
                </div>

                <button className="lg:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 top-20 bg-white z-90 transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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