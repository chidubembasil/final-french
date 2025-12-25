import { Sparkles, BookOpen, Users, Globe, Trophy, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


export default function GalleryHero(){

   /*  type gallery = {
        icon: React.FC<React.SVGProps<SVGSVGElement>>,
        title: string,
        subTitle: string,
        color: string,
        color2: string,
        color3: string,
        numbers: string,
        text: string,
    }

    const galleryCard : gallery[] = [
        {
            icon: BookOpen,
            title: 'Resource Centres',
            subTitle: 'Equipped learning spaces across Nigerian institutions',
            color: 'border-blue-700',
            color2: 'bg-blue-200',
            color3: 'blue',
            numbers: "15+",
            text: 'Centres'
        },
        {
            icon: Users,
            title: 'Teacher Training',
            subTitle: 'Capacity building workshops and seminars',
            color: 'border-red-700',
            color2: 'bg-red-200',
            color3: 'red',
            numbers: "200+",
            text: 'Teachers'
        },
        {
            icon: Globe,
            title: 'French Clubs',
            subTitle: 'Active student communities promoting French',
            color: 'border-blue-700',
            color2: 'bg-blue-200',
            color3: 'blue',
            numbers: "50+",
            text: 'Clubs'
        },
        {
            icon: Trophy,
            title: 'Competitions',
            subTitle: 'National and regional French language contests',
            color: 'border-red-700',
            color2: 'bg-red-200',
            color3: 'red',
            numbers: "5+",
            text: "Events/Year"
        },
    ]
 */
    return(
        <main className="w-full h-fit flex flex-col items-center justify-center mb-7 bg-[#f9f7f4] p-7">
            <div className="w-[90%] h-fit flex flex-col items-center justify-center gap-1.5 mb-7">
                <span className='w-50 h-8 rounded-2xl flex items-center justify-center gap-2 backdrop-blur-md bg-blue-300/50 text-blue-600'><Sparkles size={18}/> Visual documentation</span>
                <span className='font-serif text-5xl font-bold'>Gallery</span>
                <span className='w-50 h-1 bg-linear-to-r from-white via-blue-700 to-white'></span>
            </div>
            <div className="w-full  flex flex-col justify-center items-center">
                <div className="w-[90%] h-fit flex flex-wrap">
                   
                </div>
                <div className=''>
                    <button type="button" className='text-white bg-blue-700 w-fit p-2 h-fit rounded-xl flex flex-row gap-1.5 cursor-pointer'>View Gallery <ArrowRight color='white'/></button>
                </div>
            </div>
        </main>
    )
}

