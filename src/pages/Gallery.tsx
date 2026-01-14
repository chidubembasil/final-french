import { Camera, Grid3X3, List, ZoomIn, ChevronRight, ChevronLeft, PlayCircle, Loader2, Image as ImageIcon, X, ArrowLeft } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface GalleryImage {
  id: number;
  title: string;
  slug: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  category: string;
  publishedAt: string;
  purpose?: string;
  subPurpose?: string;
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingHero, setLoadingHero] = useState<boolean>(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeMediaType, setActiveMediaType] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  const CATEGORIES = ["All", "Trainings", "Resource Centres", "French Clubs", "Associations", "Events"];
  const MEDIA_TYPES = ["All", "Image", "Video"];

  // --- Handlers ---
  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  // Close modal on Escape key and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage, images]);

  // --- Data Fetching ---
  useEffect(() => {
    fetch(`${CLIENT_KEY}api/galleries`)
      .then(res => res.json())
      .then((data: any[]) => {
        const hero = data.find(item => item.purpose === "Other Page" && item.subPurpose === "Gallery");
        if (hero) setHeroData(hero);
      })
      .catch(err => console.error("Hero fetch error:", err))
      .finally(() => setLoadingHero(false));
  }, [CLIENT_KEY]);

  const fetchFilteredGallery = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.append('category', activeCategory);
      if (activeMediaType !== "All") params.append('mediaType', activeMediaType.toLowerCase());

      const response = await fetch(`${CLIENT_KEY}api/galleries?${params.toString()}`);
      const data = await response.json();
      
      const displayItems = (Array.isArray(data) ? data : (data.data || []))
        .filter((item: GalleryImage) => item.purpose !== "Other Page");
        
      setImages(displayItems);
    } catch (err) {
      console.error("Gallery fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [CLIENT_KEY, activeCategory, activeMediaType]);

  useEffect(() => {
    fetchFilteredGallery();
    setCurrentPage(1);
  }, [fetchFilteredGallery]);

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const currentImages = images.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePaginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('gallery-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen relative">
      {/* Hero Section */}
      <div className="relative w-full h-[90dvh] md:h-[90dvh] overflow-hidden bg-slate-900">
        {loadingHero ? (
          <div className="absolute inset-0 animate-pulse bg-slate-800" />
        ) : (
          <>
            <img
              src={heroData?.mediaUrl}
              alt="Gallery Hero"
              className="absolute inset-0 w-full h-full object-cover z-0"
              loading="lazy"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-800/40 to-red-700/70" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-16 gap-5">
              <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl">
                <Camera color="white" size={17} />
                <p className="text-sm font-medium tracking-wide uppercase">Visual Documentation</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">{heroData?.title}</h1>
              <p className="text-white/90 text-lg md:text-xl max-w-xl">{heroData?.description}</p>
            </div>
          </>
        )}
      </div>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full lg:w-auto">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Type</span>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {MEDIA_TYPES.map((type) => (
                    <button key={type} onClick={() => setActiveMediaType(type)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMediaType === type ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{type}</button>
                  ))}
                </div>
              </div>
              <div className="hidden md:block h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest shrink-0">Category</span>
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${activeCategory === cat ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{cat}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Layout</span>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`} onClick={() => setView("grid")}><Grid3X3 size={18}/></button>
                <button className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`} onClick={() => setView("list")}><List size={18}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div id="gallery-grid" className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Syncing Gallery...</p>
          </div>
        ) : (
          <>
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-6"}>
              {currentImages.map((img) => (
                <div
                  key={img.id}
                  className={
                    view === "grid"
                      ? "relative aspect-square rounded-[2.5rem] overflow-hidden group cursor-pointer bg-white shadow-sm border-4 border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                      : "flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
                  }
                  onClick={() => setSelectedImage(img)}
                >
                  <div className={view === "grid" ? "w-full h-full" : "relative w-full md:w-60 h-60 overflow-hidden rounded-[2rem] shrink-0"}>
                    <img
                      src={img.mediaUrl}
                      alt={img.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>

                  {view === "grid" ? (
                    <>
                      <div className="absolute top-6 left-6 z-10">
                        {img.mediaType === "video" ? (
                          <div className="bg-red-600 p-2 rounded-full text-white shadow-lg"><PlayCircle size={16}/></div>
                        ) : (
                          <div className="bg-blue-600 p-2 rounded-full text-white shadow-lg"><ImageIcon size={16}/></div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30 text-white"><ZoomIn size={28} /></div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-800 mt-4">{img.title}</h3>
                      <p className="text-gray-500 text-sm mt-2">{img.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => handlePaginate(currentPage - 1)} className="p-3 rounded-2xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"><ChevronLeft size={20} /></button>
                <div className="px-4 text-xs font-bold text-gray-400">Page {currentPage} of {totalPages}</div>
                <button disabled={currentPage === totalPages} onClick={() => handlePaginate(currentPage + 1)} className="p-3 rounded-2xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"><ChevronRight size={20} /></button>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- FULL SCREEN LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col bg-slate-900 overflow-y-auto"
          onClick={() => setSelectedImage(null)} 
        >
          {/* Top Bar - Sticky to top of modal */}
          <div className="sticky top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent z-[100]">
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-black uppercase tracking-widest text-[10px] hidden sm:inline">Back to Gallery</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="flex items-center gap-3 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-lg group"
            >
              <span className="font-bold text-xs uppercase tracking-tighter">Close</span>
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Modal Content Wrapper */}
          <div 
            className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 flex flex-col items-center justify-center min-h-max"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Navigation Arrows (Desktop) */}
            <button
              onClick={handlePrev}
              className="fixed left-6 top-1/2 -translate-y-1/2 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all hidden lg:block border border-white/10"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={handleNext}
              className="fixed right-6 top-1/2 -translate-y-1/2 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all hidden lg:block border border-white/10"
            >
              <ChevronRight size={40} />
            </button>

            {/* Media Area */}
            <div className="relative w-full flex flex-col items-center">
              <div className="relative group max-w-full">
                {selectedImage.mediaType === "video" ? (
                  <video
                    src={selectedImage.mediaUrl}
                    controls
                    autoPlay
                    className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl border border-white/10"
                  />
                ) : (
                  <img
                    src={selectedImage.mediaUrl}
                    alt={selectedImage.title}
                    className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                  />
                )}
                
                {/* Mobile Navigation Arrows */}
                <div className="flex lg:hidden justify-between w-full absolute top-1/2 -translate-y-1/2 px-2 pointer-events-none">
                   <button 
                    onClick={handlePrev} 
                    className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white pointer-events-auto active:scale-95"
                   >
                    <ChevronLeft size={24}/>
                   </button>
                   <button 
                    onClick={handleNext} 
                    className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white pointer-events-auto active:scale-95"
                   >
                    <ChevronRight size={24}/>
                   </button>
                </div>
              </div>

              {/* Information Section - Scrollable if content is long */}
              <div className="mt-10 mb-20 text-center max-w-3xl">
                <div className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  {selectedImage.category}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white font-serif mb-6 leading-tight">
                  {selectedImage.title}
                </h2>
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6" />
                <p className="text-white/70 text-base md:text-lg leading-relaxed px-4">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Gallery;