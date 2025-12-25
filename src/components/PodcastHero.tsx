import { Headphones,  ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


export default function PodcastHero(){

  
    return(
        <main className="w-full h-fit flex flex-col items-center justify-center mb-7 bg-[#f9f7f4] p-7">
            <div className="w-[90%] h-fit flex flex-col items-center justify-center gap-1.5 mb-7">
                <span className='w-fit h-fit p-3 rounded-3xl flex items-center justify-center gap-2 backdrop-blur-md bg-red-200 text-red-600'><Headphones size={18}/> Listen to learners and teachers</span>
                <span className='font-serif text-5xl font-bold'>Podcast</span>
                <span className='w-50 h-1 bg-linear-to-r from-white via-blue-700 to-white'></span>
            </div>
            <div className="w-full  h-fit flex flex-col justify-center items-center">
                <div className='w-full flex flex-col justify-center p-4 items-center rounded-2xl h-100 bg-linear-to-br from-blue-900/70 via-blue-700/50 to-red-700/70 md:flex md:flex-row-reverse' >
                    <div className='w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl h-70 '>

                    </div>
                    <div className='w-full'>
                        
                    </div>
                </div>
                <div className="w-[90%] h-fit flex flex-wrap">
                   
                </div>
                <div className=''>
                    <button type="button" className='text-white bg-red-700 w-fit p-2 h-fit rounded-xl flex flex-row gap-1.5 cursor-pointer'>Browse All Podcast <ArrowRight color='white'/></button>
                </div>
            </div>
        </main>
    )
}

