import { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { useSpeech } from './SpeechContext';
import logo from '../assets/img/logo.png';
import logo2 from '../assets/img/ambassade de france.png';

function Header() {
    const { speak, isSpeaking, stop } = useSpeech();
    const [isOpen, setIsOpen] = useState(false);

    const navLink = [
        { path: "/", name: "Home" },
        { path: "/bac", name: "Bilingual and Competitive" },
        { path: "/activities", name: "Learn French" },
        { path: "/podcast", name: "Podcasts" },
        { path: "/resource", name: "Resources" },
        { path: "/news&blog", name: "News & Blog" },
        { path: "/gallery", name: "Gallery" }
    ];

    const handleSpeak = () => {
        if (isSpeaking) {
            stop();
        } else {
            speak(); 
        }
    };

    return (
        <header className="h-20 w-full px-6 fixed top-0 left-0 z-1000 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm">
            <Link to="/" className="shrink-0 flex flex-row gap-0.5">
                <img src={logo2} alt="Ambassade" className="w-12 h-12 md:w-14 object-contain" />
                <img src={logo} alt="Logo" className="w-12 h-12 md:w-14 object-contain" />
            </Link>

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
                <button 
                    type="button"
                    onClick={handleSpeak}
                    className={`p-2 rounded-full transition-all duration-300 ${isSpeaking ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-blue-600 hover:bg-blue-100'}`}
                    aria-label="Listen to content"
                >
                    {isSpeaking ? <VolumeX size={22} className="animate-pulse" /> : <Volume2 size={22} />}
                </button>

                <button type="button" className="lg:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <div className={`fixed inset-0 top-20 bg-white z-900 transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <nav className="flex flex-col p-6 gap-2">
                    {navLink.map((item, index) => (
                        <NavLink 
                            to={item.path} 
                            key={index} 
                            onClick={() => setIsOpen(false)} 
                            className={({ isActive }) => `text-lg p-4 rounded-xl ${isActive ? "bg-blue-600 text-white" : "text-gray-800"}`}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default Header;