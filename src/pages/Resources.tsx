import {BookOpen, Search } from "lucide-react";
import pic from "../assets/img/_A1A4699.jpg"



function Resources(){
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
  <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/70 via-blue-700/50 to-red-700/70" />

  {/* Content */}
  <div className="relative z-20 w-full h-full flex flex-col items-start justify-center pl-6 gap-5">

   <div className="flex flex-row items-center justify-center text-white h-8 w-35  bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl  ">
                    <BookOpen color="white" size={17}/><p>For Teachers</p>
                </div>
                <h1 className="text-white text-6xl font-bold">Teaching Resources</h1>
                <p className="text-white text-xl">Tools and materials to enhance your French language teaching.</p>

  </div>
</div>


            <div className="w-full h-fit">
                <div className="w-full h-30 shadow-2xl border-0 bg-white flex justify-center items-center border-b-2 border-solid border-gray-50">
                    <form action="" method="get" className="w-[90%] h-fit flex justify-between items-center ">
                        <div className="w-full flex flex-row gap-0.5 items-center ">
                            <Search size={20}/>
                            <input type="search" name="search" id="search" placeholder="Search" className=" pl-0.5 h-7"/>
                        </div>

                        <div className="w-full flex justify-end items-end">
                            <select name="types" id="types" className="bg-gray-200 w-30 p-1 rounded-lg">
                                <option value="all" selected>All</option>
                                <option value="medt">Meditation</option>
                                <option value="pf">Platform</option>
                                <option value="ws">Worksheets</option>
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

export default Resources