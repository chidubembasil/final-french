import { Camera, Filter, Grid3X3, List, MapPin } from "lucide-react";
import pic from "../assets/img/_A1A4787.jpg";
import { useEffect, useState, useMemo } from "react";

// Updated Interface to match your Gallery logic
interface GalleryImage {
  id: string | number;
  url: string;
  title: string;
  location: string;
  category: string;
}

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    // Replace with your actual Gallery API
    fetch('https://atoilemicronaija-project-sunshine-production2.up.railway.app/api/galleries') 
      .then((res) => res.json())
      .then((data: GalleryImage[]) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching gallery:", err);
        setLoading(false);
      });
  }, []);

  // Filter Logic
  const filteredImages = useMemo(() => {
    return activeCategory === "All" 
      ? images 
      : images.filter(img => img.category === activeCategory);
  }, [images, activeCategory]);

  // Compute button classes for View Toggle
  const gridButtonClass = `p-1 rounded-md transition-colors ${view === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`;
  const listButtonClass = `p-1 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`;

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[60dvh] md:h-[80dvh] overflow-hidden">
        <img src={pic} alt="Gallery Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/70 via-blue-700/50 to-red-700/70" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-16 gap-5">
          <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
            <Camera color="white" size={17} />
            <p className="text-sm font-medium">Visual Documentation</p>
          </div>
          <h1 className="text-white text-5xl md:text-6xl font-bold font-serif">Gallery</h1>
          <p className="text-white text-lg max-w-xl opacity-90">
            Explore photos and videos from our trainings, resource centres, French clubs, and events.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Category Filters */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto">
            <Filter size={18} className="text-gray-400 shrink-0" />
            <div className="flex gap-2">
              {["All", "Trainings", "Resource Centers", "Events", "French Clubs"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl shrink-0">
            <button className={gridButtonClass} onClick={() => setView("grid")}><Grid3X3 size={20}/></button>
            <button className={listButtonClass} onClick={() => setView("list")}><List size={20}/></button>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className={
          view === "grid" 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" 
          : "flex flex-col gap-4"
        }>
          {filteredImages.map((img) => (
            view === "grid" ? (
              // GRID ITEM
              <div key={img.id} className="relative aspect-square rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden group shadow-sm bg-white">
                <img src={img.url} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt={img.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                  <p className="text-white font-bold text-sm md:text-base">{img.title}</p>
                  <p className="text-white/80 text-[10px] md:text-xs flex items-center gap-1">
                    <MapPin size={12} className="text-red-400" /> {img.location}
                  </p>
                </div>
              </div>
            ) : (
              // LIST ITEM
              <div key={img.id} className="flex items-center gap-6 p-4 bg-white rounded-3xl border border-gray-100 hover:shadow-md transition-shadow">
                <img src={img.url} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl" alt={img.title} />
                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">{img.category}</span>
                  <h3 className="text-lg font-bold text-slate-800 mt-1">{img.title}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {img.location}
                  </p>
                </div>
              </div>
            )
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No documentation found in this category.
          </div>
        )}
      </div>
    </main>
  );
}

export default Gallery;