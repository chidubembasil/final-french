import logo from '../assets/img/logo.png'
import { Globe2 } from "lucide-react";
// import { useState } from 'react';
import { Link } from "react-router-dom";
function Header() {
    type nav = {
        path: string,
        name: string
    }

    const navLink : nav[] =[
        {
            path: "/",
            name: "Home"
        },
        {
            path: "/B.A.C",
            name: "Bilingual and Competitive"
        },
        {
            path: "/news",
            name: "News & Blog"
        },
        {
            path: "/podcast",
            name: "Podcasts"
        },
        {
            path: "/resource",
            name: "Resources"
        },
        {
            path: "/activites",
            name: "Activites"
        },
        {
            path: "/gallery",
            name: "Gallery"
        },
    ]    
    
    return (
        <header className="h-20 w-full p-2 fixed z-100 bg-white drop-shadow-2xl  flex flex-row justify-between items-center ">
            <div >
                <img src={logo} alt="logo" width={70} height={70} />
                
            </div>

            <div className='hidden md:flex justify-between items-center gap-9'>
                {
                   navLink.map((item, index)=>(
                        <Link to={item.path} key={index} className=' w-fit p-1.5 h-fit text-gray-600  focus:bg-blue-100 focus:text-blue-700 focus:rounded-lg hover:bg-gray-100 hover:text-black hover:rounded-lg' >
                            {item.name}
                        </Link>
                   ))
                }
            </div>
            
            <div>
                
               
                <form action="" method="get" className='w-30 h-5 flex flex-row focus:border-0  enabled:border-0 active:border-0'>
                    <label htmlFor="lang"><Globe2/></label>
                    <select name="lang" id="lang">
                        <option value="english" selected>EN</option>
                        <option value="french">FR</option>
                    </select>
                </form>
            </div>


        </header>
    );
}

export default Header