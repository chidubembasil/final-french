import { Newspaper,  ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


export default function NewsHero(){

  
    return(
        <main className="w-full h-fit flex flex-col items-center justify-center mb-7 bg-[#f9f7f4] p-7">
            <div className="w-[90%] h-fit flex flex-col items-center justify-center gap-1.5 mb-7">
                <span className='w-fit h-fit p-2.5 rounded-3xl flex items-center justify-center gap-2 backdrop-blur-md bg-blue-300/50 text-blue-600'><Newspaper size={18}/> Stay Informed</span>
                <span className='font-serif text-5xl font-bold'>News & Blog</span>
                <span className='w-50 h-1 bg-linear-to-r from-white via-blue-700 to-white'></span>
            </div>
            <div className="w-full  flex flex-col justify-center items-center">
                <div className="w-[90%] h-fit flex flex-wrap">
                   
                </div>
                <div className=''>
                    <button type="button" className='text-white bg-blue-700 w-fit p-2 h-fit rounded-xl flex flex-row gap-1.5 cursor-pointer'>Explore All Content <ArrowRight color='white'/></button>
                </div>
            </div>
        </main>
    )
}

