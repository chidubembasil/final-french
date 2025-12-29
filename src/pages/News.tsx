import { Newspaper, Search, Calendar, Clock } from "lucide-react";
import pic from "../assets/img/_A1A4760.jpg";
import { useState, useEffect, useMemo } from 'react';

interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

function News() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    // Replace with your real API endpoint
    fetch("https://atoilemicronaija-project-sunshine-production2.up.railway.app/api/news")
      .then(res => res.json())
      .then((data: BlogPost[]) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Filter Logic: Search + Category Buttons
  const filteredBlogs = useMemo(() => {
    return blogs.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        activeCategory === 'All' || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, activeCategory]);

  return (
    <main className="pt-20 bg-gray-50/30 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[90dvh] md:h-[90dvh] overflow-hidden">
        <img
          src={pic}
          alt="News Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/70 via-blue-700/50 to-red-700/70" />

        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-12 lg:px-24 gap-5">
          <div className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
            <Newspaper color="white" size={17} />
            <p className="text-sm font-medium tracking-wide">Stay updated</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">
            News & Blog
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl">
            Stay updated with the latest news, success stories, and educational events from the French Education Fund.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 w-full bg-white border-b border-gray-100 shadow-xl shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'News', 'Announcements', 'Events', 'Trainings'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-blue-700 text-white shadow-lg shadow-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(n => (
              <div key={n} className="space-y-4 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-[2.5rem]"></div>
                <div className="h-6 bg-gray-200 w-3/4 rounded-lg"></div>
                <div className="h-4 bg-gray-200 w-full rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-y-16">
            {filteredBlogs.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-6 shadow-sm">
                  <span className="absolute top-5 left-5 bg-red-600 text-white text-[10px] px-4 py-1.5 rounded-full font-bold z-10 uppercase tracking-widest">
                    {post.category}
                  </span>
                  <img 
                    src={post.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                    alt={post.title} 
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>

                <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-4 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> {post.readTime}</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-gray-500 text-base leading-relaxed line-clamp-3 mb-6">
                  {post.excerpt}
                </p>

                <button className="text-blue-700 font-extrabold text-sm flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
                  Read article <span>→</span>
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-2xl font-serif text-gray-400">No articles found matching your criteria.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default News;