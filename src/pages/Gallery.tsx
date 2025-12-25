import { Camera,  Filter, Grid3X3, List} from "lucide-react";
import pic from "../assets/img/_A1A4787.jpg"
import { useEffect, useState } from "react";



function Gallery(){
  interface User {
    id: number;
    name: string;
    email: string;
  }

const [view, setView] = useState("grid"); // 'grid' or 'list'

  // Compute button classes based on current view
  const gridButtonClass =
    "w-fit h-fit p-1 text-black rounded-md cursor-pointer " +
    (view === "grid" ? "bg-[#ffffff]" : "bg-transparent");

  const listButtonClass =
    "w-fit h-fit p-1 text-black rounded-md cursor-pointer " +
    (view === "list" ? "bg-[#ffffff]" : "bg-transparent");
 
    const arrange = (view ===  "grid" ? "grid grid-cols-1 space-y-1 md: grid grid-cols-2 space-x-1 space-y-1 lg: grid grid-cols-4 space-x-1 space-y-1" : "");
     const [users, setUsers] = useState<User>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    fetch("") // URL of API
      .then((res) => res.json()) // convert response to JSON
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);
   if (loading) return <p>Loading...</p>;

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
              <div className="absolute inset-0 z-10 bg-linear-to-br from-blue-900/70 via-blue-700/50 to-red-700/70" />

              {/* Content */}
              <div className="relative z-20 w-full h-full flex flex-col items-start justify-center pl-6 gap-5">

                {/* Glass badge */}
                <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                  <Camera color="white" size={17} />
                  <p className="text-sm font-serif">Visual Documentation</p>
                </div>

                <h1 className="text-white text-6xl font-bold font-serif">
                 Gallery
                </h1>

                <p className="text-white text-xl max-w-xl font-serif">
                  Explore photos and videos from our trainings, resource centres, French clubs, and events.
                </p>

              </div>
            </div>


            <div className="w-full h-fit">
                <div className="w-full h-fit shadow-2xl border-0 bg-white flex flex-wrap justify-between items-center border-b-2 border-solid border-gray-50 md:h-30 p-3">
                    {/* <form action="" method="get" className="w-[90%] h-fit flex justify-between items-center ">
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
                    </form> */}

                    <div className="flex flex-wrap space-x-2 w-fit items-center md:flex flex-row">
                      <Filter size={20}/>
                      <button type="button" className="w-fit h-fit p-2 bg-[#f3f1ed] text-black rounded-xl cursor-pointer">All</button>
                      <button type="button" className="w-fit h-fit p-2 bg-[#f3f1ed] text-black rounded-xl cursor-pointer">Trainings</button>
                      <button type="button" className="w-fit h-fit p-2 bg-[#f3f1ed] text-black rounded-xl cursor-pointer">Resource Centers</button>
                      <button type="button" className="w-fit h-fit p-2 bg-[#f3f1ed] text-black rounded-xl cursor-pointer">Events</button>
                      <button type="button" className="w-fit h-fit p-2 bg-[#f3f1ed] text-black rounded-xl cursor-pointer">Associations</button>
                      <button type="button" className="w-fit h-fit p-2 bg-[#f3f1ed] text-black rounded-xl cursor-pointer">French Clubs</button>
                    </div>

                    <span className="flex  space-x-2 w-18 h-9 rounded-xl justify-center items-center p-2 bg-[#f3f1ed]">
                      <button type="button" className={gridButtonClass} onClick={() => setView("grid")}><Grid3X3 size={20}/></button>
                      <button type="button" className={listButtonClass} onClick={() => setView("list")}><List size={20}/></button>
                    </span>
                </div>
                <div className={`w-full h-fit p-5 ${arrange} `}>
                  
                    {
                      users.map((user) => (
                        <li key={user.id}>{user.name} ({user.email})</li>
                      ))
                    }
                </div>
            </div>
        </main>
    )
}

export default Gallery