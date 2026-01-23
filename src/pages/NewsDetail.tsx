import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calendar, MapPin, MessageCircle, 
  Linkedin, Copy, Check 
} from "lucide-react";
import { useState, useEffect } from "react";

function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  const XLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${CLIENT_KEY}api/news`)
      .then(res => res.json())
      .then(data => {
        const rawData = Array.isArray(data) ? data : (data.data || []);
        const found = rawData.find((b: any) => b.slug === slug);
        setPost(found);
      })
      .catch(err => console.error("Detail Fetch Error:", err))
      .finally(() => setLoading(false));
  }, [slug, CLIENT_KEY]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Read this: ${post?.title}`;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    
    const links: any = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      x: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };
    window.open(links[platform], '_blank');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Article not found</h2>
      <button onClick={() => navigate('/news')} className="text-blue-600 font-bold uppercase text-xs tracking-widest">Return to News</button>
    </div>
  );

  return (
    <main className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => navigate('/news&blog')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-all">
          <ArrowLeft size={20} />
          <span className="font-black uppercase tracking-widest text-[10px]">Back to News</span>
        </button>

        <div className="space-y-6 text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            <span>{post.category}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-slate-900 leading-[1.1]">{post.title}</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6 border-t">
            <div className="flex items-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(post.updatedAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><MapPin size={14}/> {post.state}</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border">
              <button onClick={() => handleShare('whatsapp')} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"><MessageCircle size={18} /></button>
              <button onClick={() => handleShare('x')} className="p-2 text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"><XLogo /></button>
              <button onClick={() => handleShare('linkedin')} className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"><Linkedin size={18} /></button>
              <button onClick={() => handleShare('copy')} className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border mb-12">
          <img src={post.coverImage} className="w-full h-full object-cover" alt={post.title} />
        </div>

        <div className="prose prose-lg prose-slate max-w-none">
          <div className="text-gray-600 leading-[1.8] space-y-8 text-lg">
            {post.content.split('\n').filter((p: string) => p.trim() !== '').map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default NewsDetail;