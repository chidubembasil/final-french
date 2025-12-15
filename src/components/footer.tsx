import { Instagram, Facebook, Twitter, Mail, Phone, Pin } from "lucide-react";
function Footer() {
    return (
        <footer className="w-full h-fit pt-20 px-20 bg-blue-800 flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center w-full bg-transparent h-50 md: flex flex-col items-start" >
                <div className="w-full ">
                    <h1 className="text-2xl text-white font-bold">À toi le micro Naija</h1>
                    <p className="text-white text-center md: text-left">An educational platform for French language learning and cultural activities in West Africa</p>
                </div>
                <div className="w-full text-white ">
                    <h1 className="text-2xl text-white font-bold">Quick Link</h1>
                    <div>

                    </div>
                </div>
                <div className="w-full text-white ">
                    <h1 className="text-2xl text-white font-bold">Contact Us</h1>
                    <ul >
                        <li className="flex flex-row gap-0.5 items-center"><Mail size={17}/> info@atoilenaija.com </li>
                        <li className="flex flex-row gap-0.5"><Phone size={17}/> +234 XXX XXX XXXX</li>
                        <li className="flex flex-row gap-0.5"><Pin size={17}/> Lagos, Nigeria</li>
                    </ul>
                </div>
                <div className="w-full text-white">
                    <h1 className="text-2xl text-white font-bold">Follow Us</h1>
                    <div className="flex flex-row gap-1">
                        <Instagram/>
                        <Facebook/>
                        <Twitter/>
                    </div>
                </div>
            </div>
            <hr className="border-b border-solid border-white "/>
            <div className="flex flex-row justify-between items-center w-full h-30 bg-transparent h-10 text-white">
                <p>© 2025 French Naija. All rights reserved.</p>
                <p>Designed by TEDPRIME</p>
            </div>
        </footer>
    );
}

export default Footer;