import { useState, useEffect } from 'react'; // Added hooks
import logo from '../assets/img/logo.png';
import logo2 from '../assets/img/ambassade de france.png'
import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Linkedin, ArrowUp } from "lucide-react"; // Added ArrowUp
import { Link } from "react-router-dom";

function Footer() {
    // --- Scroll to Top Logic ---
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the scroll event listener
    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    // ---------------------------

    return (
        <footer className="w-full bg-[#1d2330] pt-16 pb-8 px-6 md:px-12 lg:px-24 text-[#b2bdb8] relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                
                {/* Brand Section with Logo */}
                <div className="flex flex-col items-start gap-5">
                    <div className="flex items-center gap-3">
                         <Link to="/" className="shrink-0 flex flex-row gap-0.5">
                            <img src={logo2} alt="logo" className="w-12 h-12 md:w-14 object-contain" />
                            <img src={logo} alt="logo" className="w-12 h-12 md:w-14 object-contain" />
                           
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl text-white font-bold font-serif leading-tight">
                                À toi le micro
                            </h1>
                            <span className="text-xs text-gray-400">Naija</span>
                        </div>
                    </div>
                    
                    <p className="text-sm leading-relaxed max-w-xs">
                        A French Education Fund Initiative. Empowering Nigerian learners through digital storytelling.
                    </p>

                    <div className="flex flex-row gap-2.5">
                        {[
                            { icon: <Facebook size={18} />, link: "https://www.facebook.com/profile.php?id=100095181674120" },
                            { icon: <Instagram size={18} />, link: "https://www.instagram.com/reel/DRR_PogEd-o/?igsh=MWFjd3g2cjcydm41bQ==" },
                            { icon: <Linkedin size={18} />, link: "https://www.linkedin.com/company/embassy-of-france-in-nigeria/" },
                            { icon: <Twitter size={18} />, link: "https://x.com/ATLM_Naija" },
                            { icon: <Youtube size={18} />, link: "https://www.youtube.com/@ATLM_Naija" }
                            
                        ].map((social, i) => (
                            <a 
                                key={i} 
                                href={social.link} 
                                className="w-9 h-9 rounded-full bg-white/5 flex justify-center items-center hover:bg-blue-600 hover:text-white transition-all duration-300 border border-white/10"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-white font-bold text-sm uppercase tracking-widest">Quick Links</h2>
                    <nav className="flex flex-col gap-3 text-sm">
                        <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
                        <Link to="/bac" className="hover:text-blue-400 transition-colors">Bilingual & Competitive</Link>
                        <Link to="/activities" className="hover:text-blue-400 transition-colors">Learn French</Link>
                        <Link to="/podcast" className="hover:text-blue-400 transition-colors">Podcasts</Link>
                        <Link to="/resource" className="hover:text-blue-400 transition-colors">If Classe</Link>
                        <Link to="/news&blog" className="hover:text-blue-400 transition-colors">News & Blog</Link>
                        <Link to="/gallery" className="hover:text-blue-400 transition-colors">Gallery</Link>

                    </nav>
                </div>

                {/* Resources (External Links) */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-white font-bold text-sm uppercase tracking-widest">Resources</h2>
                    <div className="flex flex-col gap-3 text-sm">
                        <a href="https://enseigner.tv5monde.com/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">TV5 Monde</a>
                        <a href="https://savoirs.rfi.fr/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">RFI Savoirs</a>
                        <a href="https://www.ifprofs.org/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">IFprofs</a>
                        <a href="https://www.afnigeria.org/lagos/" className="hover:text-blue-400 transition-colors">Alliance Française</a>
                    </div>
                </div>

                {/* Contact Us */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-white font-bold text-sm uppercase tracking-widest">Contact</h2>
                    <ul className="flex flex-col gap-4 text-sm">
                        <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                <MapPin className="text-red-500" size={16} />
                            </div>
                            <span>Institut Français du Nigéria, Abuja, Nigeria</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                <Mail className="text-red-500" size={16} />
                            </div>
                            <a href="mailto:atoilemicronaijawebsite@gmail.com" className="hover:text-white transition-colors">
                                atoilemicronaijawebsite@gmail.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-[11px] uppercase tracking-tighter opacity-60">
                <p>© 2026 À TOI LE MICRO NAIJA. ALL RIGHTS RESERVED.</p>
            </div>

            {/* Scroll to Top Button */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 animate-bounce md:animate-none"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </footer>
    );
}

export default Footer;