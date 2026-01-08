import { Camera, Grid3X3, List, X, ZoomIn, Calendar, Tag, ChevronRight, ChevronLeft, PlayCircle, Image as ImageIcon } from "lucide-react";
import pic from "../assets/img/_A1A4787.jpg";
import { useEffect, useState, useMemo } from "react";

interface GalleryImage {
  id: number;
  title: string;
  slug: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  category: string;
  publishedAt: string;
}

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  
  // Updated Filter States
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeMediaType, setActiveMediaType] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  // Constants based on your requirements
  const CATEGORIES = ["All", "Trainings", "Resource Centres", "French Clubs", "Associations", "Events"];
  const MEDIA_TYPES = ["All", "Image", "Video"];

  useEffect(() => {
    fetch(`${CLIENT_KEY}api/galleries`) 
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

  // Multi-criteria Filtering Logic
  const filteredImages = useMemo(() => {
    return images.filter(img => {
      const categoryMatch = activeCategory === "All" || img.category.toLowerCase() === activeCategory.toLowerCase();
      const typeMatch = activeMediaType === "All" || img.mediaType.toLowerCase() === activeMediaType.toLowerCase();
      return categoryMatch && typeMatch;
    });
  }, [images, activeCategory, activeMediaType]);

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeMediaType]);

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = filteredImages.slice(indexOfFirstItem, indexOfLastItem);

  const handlePaginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('gallery-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
        <p className="text-gray-400 font-medium">Loading Visuals...</p>
      </div>
    </div>
  );

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      {/* Hero Section - Untouched */}
      <div className="relative w-full h-[90dvh] overflow-hidden">
        <img src={pic} alt="Gallery Hero" className="absolute inset-0 w-full h-full object-cover object-top z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-800/40 to-red-700/70" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-16 gap-5">
          <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl">
            <Camera color="white" size={17} />
            <p className="text-sm font-medium tracking-wide">Visual Documentation</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif drop-shadow-xl">Gallery</h1>
          <p className="text-white/90 text-lg max-w-xl drop-shadow-md">
            Explore photos and videos from our trainings, resource centres, French clubs, and events.
          </p>
        </div>
      </div>

      {/* UPDATED FILTER BAR */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Category & Media Type Selection */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full lg:w-auto">
              {/* Media Type Filter */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Type</span>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {MEDIA_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveMediaType(type)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeMediaType === type ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vertical Divider for desktop */}
              <div className="hidden md:block h-8 w-px bg-gray-200" />

              {/* Category Filter */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest shrink-0">Category</span>
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                        activeCategory === cat 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* View Toggles */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Layout</span>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button 
                  className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`} 
                  onClick={() => setView("grid")}
                ><Grid3X3 size={18}/></button>
                <button 
                  className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`} 
                  onClick={() => setView("list")}
                ><List size={18}/></button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Gallery Content Area */}
      <div id="gallery-grid" className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-6"}>
          {currentImages.length > 0 ? (
            currentImages.map((img) => (
              view === "grid" ? (
                <div 
                  key={img.id} 
                  className="relative aspect-square rounded-[2.5rem] overflow-hidden group cursor-pointer bg-white shadow-sm border-4 border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img.mediaUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={img.title} />
                  
                  {/* Media Type Indicator */}
                  <div className="absolute top-6 left-6 z-10">
                    {img.mediaType === "video" ? (
                       <div className="bg-red-600 p-2 rounded-full text-white shadow-lg"><PlayCircle size={16}/></div>
                    ) : (
                       <div className="bg-blue-600 p-2 rounded-full text-white shadow-lg"><ImageIcon size={16}/></div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30 text-white">
                        <ZoomIn size={28} />
                      </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent">
                    <p className="text-white font-bold text-sm truncate">{img.title}</p>
                    <p className="text-white/60 text-[10px] uppercase font-black tracking-widest">{img.category}</p>
                  </div>
                </div>
              ) : (
                <div 
                  key={img.id} 
                  className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="relative w-full md:w-60 h-60 overflow-hidden rounded-[2rem] shrink-0">
                    <img src={img.mediaUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={img.title} />
                    {img.mediaType === "video" && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
                          <PlayCircle size={40} className="drop-shadow-lg" />
                       </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest">{img.category}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{img.mediaType}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mt-4 group-hover:text-blue-700 transition-colors">{img.title}</h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-3 leading-relaxed">{img.description}</p>
                    <button className="mt-6 text-blue-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                      View Full {img.mediaType} <ChevronRight size={14}/>
                    </button>
                  </div>
                </div>
              )
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 italic">
              No results found for these filters.
            </div>
          )}
        </div>

        {/* Pagination - Untouched */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => handlePaginate(currentPage - 1)} className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronLeft size={20} /></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => handlePaginate(i + 1)} className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => handlePaginate(currentPage + 1)} className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>

      {/* Lightbox - Untouched */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl animate-in fade-in" onClick={() => setSelectedImage(null)} />
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 z-[110] bg-white/10 hover:bg-red-600 text-white p-3 rounded-full transition-all"><X size={24} /></button>
          
          <div className="relative z-[105] max-w-6xl w-full flex flex-col md:flex-row items-center gap-8 animate-in zoom-in-95 duration-300">
            <div className="w-full md:w-[70%] flex justify-center">
                <img src={selectedImage.mediaUrl} className="max-h-[75vh] w-auto rounded-[2rem] shadow-2xl border-4 border-white/10" alt={selectedImage.title} />
            </div>
            <div className="w-full md:w-[30%] text-left bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
              <div className="flex items-center gap-2 text-blue-400 mb-4">
                <Tag size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{selectedImage.category}</span>
              </div>
              <h2 className="text-white text-3xl font-bold leading-tight mb-4">{selectedImage.title}</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-6 font-light">{selectedImage.description}</p>
              <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-white/10">
                <Calendar size={14} />
                <span>Added: {new Date(selectedImage.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Gallery;