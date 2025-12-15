import { Headphones, Search } from "lucide-react";
import pic from "../assets/img/_A1A4703.jpg"


function Podcast(){
    return(
        <main className="pt-20">
           <div className="relative w-full h-[95dvh] overflow-hidden">

  {/* Background image */}
  <img
    src={pic}
    alt=""
    className="absolute inset-0 w-full h-full object-cover z-0"
  />

  {/* Red + Blue gradient overlay */}
  <div className="absolute inset-0 z-10 bg-gradient-to-br from-red-600/70 via-red-500/50 to-blue-800/70" />

  {/* Content */}
  <div className="relative z-20 w-full h-full flex flex-col items-start justify-center pl-6 gap-5">

    {/* Glass badge */}
    <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
      <Headphones color="white" size={17} />
      <p className="text-sm">À toi le micro</p>
    </div>

    <h1 className="text-white text-6xl font-bold">
      Podcast Library
    </h1>

    <p className="text-white text-xl max-w-xl">
      Listen to podcasts created by Nigerian learners and teachers.
    </p>

  </div>
</div>


            <div className="w-full h-fit">
                <div className="w-full h-30 shadow-2xl border-0 bg-white flex justify-center items-center border-b-2 border-solid border-gray-50">
                    <form action="" method="get" className="w-[90%] h-fit flex justify-between items-center ">
                        <div className="w-full flex flex-row gap-0.5 items-center ">
                            <Search size={20}/>
                            <input type="search" name="search" id="search" placeholder="Search" className=" pl-0.5 h-7"/>
                        </div>

                        <div className="w-full flex justify-end items-center gap-3.5">
                            <select name="types" id="types" className="bg-gray-200 w-15 p-1 rounded-lg">
                                <option value="all" selected>All</option>
                                <option value="a1">A1</option>
                                <option value="a2">A2</option>
                                <option value="b1">B1</option>
                                <option value="b2">B2</option>
                            </select>
                             <select name="categories" id="categories" className="bg-gray-200 w-25 p-1 rounded-lg">
                                <option value="all" selected>All</option>
                                <option value="Culture">Culture</option>
                                <option value="Interview">Interview</option>
                                <option value="Daily Life">Daily Life</option>
                                <option value="Cuisine">Cuisine</option>
                                <option value="Debate">Debate</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div className="w-full h-fit p-5  sm: grid grid-cols-1 space-y-1 md: grid grid-cols-2 space-x-1 space-y-1lg: grid grid-cols-4 space-x-1 space-y-1">
                    
                </div>
            </div>
        </main>
    )
}

export default Podcast