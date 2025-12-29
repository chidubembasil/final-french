import { Newspaper, Calendar, ExternalLink, GraduationCap, Circle, Users, Award} from "lucide-react";
import pic from "../assets/img/_A1A4779.jpg"
import { useNavigate } from "react-router-dom";


function BAC(){
const navigate = useNavigate();

  const handleRedirect = (isExternal: boolean) => {
    if (isExternal) {
      // Use the browser's native location object for external links
      window.location.href = "https://bac-retour-ng.vercel.app/";
    } else {
      // Use useNavigate ONLY for internal routes
      navigate("/dashboard");
    }
  };
    interface part {
        icon: string,
        title: string,
        sub: string
    }

    const card : part[] = [
        {
            icon: 'GraduationCap',
            title: 'Quality Teaching',
            sub: 'Training and professional development for French language teachers.'
        },
        {
            icon: 'Circle',
            title: 'Modern Resources',
            sub: 'Equipping institutions with up-to-date pedagogical materials..'
        },
        {
            icon: 'Users',
            title: 'Student Engagement',
            sub: 'Creating opportunities for learners to practice and showcase their French..'
        },
        {
            icon: 'Award',
            title: 'Recognition & Awards',
            sub: 'Celebrating excellence in French language learning and teaching.'
        }
    ]



    return(
        <main className="pt-20">
          <div className="relative w-full h-[90dvh] md:h-[90dvh] overflow-hidden">
              {/* Background image */}
              <img
                src={pic}
                alt=""
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Red + Blue gradient overlay */}
              <div className="absolute inset-0 z-10 bg-linear-to-br from-blue-900/70 via-blue-700/50 to-red-700/70" />

              {/* Content */}
              <div className="relative z-20 w-full h-full flex flex-col items-start justify-center pl-6 gap-5">

                {/* Glass badge */}
                <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                  <Newspaper color="white" size={17} />
                  <p className="text-sm">French Education Fund</p>
                </div>

                <h1 className="text-white text-6xl font-bold font-serif">
                  Bilingual & Competitive
                </h1>

                <p className="text-white text-xl max-w-xl">
                  Strengthening French language learning and usage among young Nigerians for a bilingual, competitive future.
                </p>

              </div>
            </div>


            <div className="w-full h-fit flex flex-col justify-center items-center py-12 gap-5 ">
                <div className=" w-[90%] h-fit flex justify-center items-center flex-col">
                        <h1 className="text-3xl font-serif font-bold">Our Pillars</h1>
                        <p className="text-gray-500 text-center wrap-anywhere">The "Bilingual & Competitive" project is built on four fundamental pillars.</p>
                    </div>
                 <div className="flex overflow-x-auto no-scrollbar gap-2 md:flex-wrap md:justify-center">
                    {
                        card.map((item)=>(
                            <div className="w-150 h-fit py-4 p-2 rounded-2xl border-2 border-solid border-gray-200 flex flex-col justify-center items-center gap-2 shadow-xl">
                                <span className="w-15 h-15 rounded-2xl bg-[#dc2828] flex justify-center items-center"><item.icon/></span>
                                <h1 className="font-bold text-lg font-serif">{item.title}</h1>
                                <p className="text-center text-gray-500">{item.sub}</p>
                            </div>
                        ))
                    }
                 </div>
                 <div className="w-[90%] h-100 rounded-2xl border-2 border-solid border-red-200 flex flex-col justify-center items-center gap-5 bg-linear-to-br from-red-200/70 via-red-200/50 to-blue-200/70">
                    <span className="w-15 h-15 rounded-2xl bg-[#dc2828] flex justify-center items-center"> <Calendar color="white" size={30}/></span>
                    <h1 className="text-3xl font-serif font-bold">Evaluation Form</h1>
                    <p className="text-gray-500 text-center wrap-anywhere">For technical officers: Access the evaluation form to submit your reports and observations.</p>
                    <button type="button" className="w-fit h-fit p-2 rounded-xl bg-[#dc2828] text-white cursor-pointer flex justify-center items-center gap-1" onClick={() => handleRedirect(true)}>
                        <ExternalLink color="white" size={15}/>Access Form
                    </button>
                 </div>
            </div>
        </main>
    )
}

export default BAC