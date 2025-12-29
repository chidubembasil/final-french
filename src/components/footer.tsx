import { Instagram, Facebook, Twitter, Mail, Phone, Pin } from "lucide-react";
import { Link } from "react-router-dom";
function Footer() {
    
    return (
        <footer className="w-full h-fit pt-20 px-2 bg-[#1d2330] flex flex-col gap-3 font-serif">
            <div className="flex flex-col justify-between items-center w-full bg-transparent h-fit pb-2.5 md:flex md:flex-row md:items-start md:h-50 md:mb-4" >
                <div className="w-full flex flex-col justify-start items-start gap-2.5 md:justify-center md:items-center">
                    <h1 className="text-xl text-white font-bold ">À toi le micro Naija</h1>
                    <p className="text-center text-sm text-[#b2bdb8] text-sm md:text-left">A French Education Fund Initiative</p>
                    <div className="flex flex-row gap-1">

                        <span className="bg-[#343945] w-10 h-10 rounded-xl flex justify-center items-center"> <Instagram color="white" size={20}/></span>
                        <span className="bg-[#343945] w-10 h-10 rounded-xl flex justify-center items-center"><Facebook color="white" size={20}/></span>
                        <span className="bg-[#343945] w-10 h-10 rounded-xl flex justify-center items-center"><Twitter color="white" size={20}/></span>
                       
                           
                     
                    </div>
                </div>
                <div className="w-full text-white flex flex-col justify-start items-start gap-2.5 md:justify-center md:items-center ">
                    <h1 className="text-xl text-white font-bold">Quick Link</h1>
                    <div className="flex flex-col gap-1 text-sm">
                        <Link to="/" className="text-[#b2bdb8]">Home</Link>
                        <Link to="/Bac" className="text-[#b2bdb8]">Bilingual and Competitive</Link>
                        <Link to="/podcast" className="text-[#b2bdb8]">Podcast</Link>
                        <Link to="/gallery" className="text-[#b2bdb8]">Gallery</Link>
                        <Link to="/resource" className="text-[#b2bdb8]">Resources</Link>
                        <Link to="/news&blog" className="text-[#b2bdb8]">News & Blog</Link>
                    </div>
                </div>
                <div className="w-full text-white flex justify-start items-start flex-col gap-2.5 md:justify-center md:items-center">
                    <h1 className="text-xl text-white font-bold font-Playfair">Contact Us</h1>
                    <ul className="text-sm flex flex-col gap-1 p-2">
                        <li className="flex flex-row gap-1 items-center text-[#b2bdb8]"><Mail color={'red'} size={17}/> info@atoilenaija.com </li>
                        <li className="flex flex-row gap-1 text-[#b2bdb8]"><Phone color={'red'} size={17}/> +234 XXX XXX XXXX</li>
                        <li className="flex flex-row gap-1 text-[#b2bdb8]"><Pin color={'red'} size={17}/> Lagos, Nigeria</li>
                    </ul>
                </div>
                <div className="w-full text-white flex justify-start items-start flex-col gap-2.5 md:justify-center md:items-center">
                    <h1 className="text-xl text-white font-bold">Resources</h1>
                    <div className="flex flex-col gap-1 text-sm">
                        <a href="#" className="text-[#b2bdb8]">TV5 Monde</a>
                        <a href="#" className="text-[#b2bdb8]">TV5 Monde</a>
                        <a href="#" className="text-[#b2bdb8]">TV5 Monde</a>
                        <a href="#" className="text-[#b2bdb8]">TV5 Monde</a>
                        <a href="#" className="text-[#b2bdb8]">TV5 Monde</a>
                    </div>
                </div>
            </div>
            <hr className="border-b border-solid border-[#b2bdb8] "/>
            <div className="flex flex-row justify-between items-center w-full h-30 bg-transparent  text-[#b2bdb8]">
                <p>© 2025 French Naija. All rights reserved.</p>
                <p>Designed by TEDPRIME</p>
            </div>
        </footer>
    );
}

export default Footer;