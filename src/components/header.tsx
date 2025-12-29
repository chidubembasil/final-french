import logo from '../assets/img/logo.png';
import { Globe, Menu, X } from "lucide-react";
import { useState } from 'react';
import { NavLink } from "react-router-dom"; // Switched to NavLink

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    type NavItem = {
        path: string,
        name: string
    }

    const navLink: NavItem[] = [
        { path: "/", name: "Home" },
        { path: "/bac", name: "Bilingual and Competitive" },
        { path: "/news&blog", name: "News & Blog" },
        { path: "/podcast", name: "Podcasts" },
        { path: "/resource", name: "Resources" },
        { path: "/activites", name: "Activities" },
        { path: "/gallery", name: "Gallery" },
    ];

    // Helper function for active styles
    const getLinkStyle = ({ isActive }: { isActive: boolean }) => 
        isActive 
            ? "text-blue-700 bg-blue-50 rounded-lg px-3 py-2 font-bold transition-all" 
            : "text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg px-3 py-2 transition-all";

    return (
        <header className="h-20 w-full px-6 fixed top-0 left-0 z-100 bg-white border-b border-gray-100 flex flex-row justify-between items-center shadow-sm">
            {/* Logo */}
            <div className="shrink-0">
                <img src={logo} alt="logo" className="w-12 h-12 md:w-14 object-contain" />
            </div>

            {/* Desktop Navigation */}
            <nav className='hidden lg:flex items-center gap-2'>
                {navLink.map((item, index) => (
                    <NavLink 
                        to={item.path} 
                        key={index} 
                        className={getLinkStyle}
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {/* Right Side: Language & Hamburger */}
            <div className="flex items-center gap-4">
                <form className='flex flex-row items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full'>
                    <Globe size={16} className="text-gray-500" />
                    <select name="lang" id="lang" className='bg-transparent text-xs font-bold outline-none cursor-pointer'>
                        <option value="english">EN</option>
                        <option value="french">FR</option>
                    </select>
                </form>

                <button 
                    className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Sidebar */}
            <div className={`
                fixed inset-0 top-20 bg-white z-90 transition-transform duration-300 ease-in-out lg:hidden
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <nav className="flex flex-col p-6 gap-2">
                    {navLink.map((item, index) => (
                        <NavLink 
                            to={item.path} 
                            key={index} 
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => 
                                `text-lg p-4 rounded-xl transition-all ${
                                    isActive 
                                    ? "bg-blue-600 text-white font-bold" 
                                    : "text-gray-800 hover:bg-gray-50"
                                }`
                            }
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