import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
  Loader2,
  Play,
  BookOpen,
  Users,
  GraduationCap,
  Layers,
  ChevronRight,
  Archive,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";



// ─── Types ────────────────────────────────────────────────────────────────────
interface WorksheetPdf {
  id: number;
  worksheetId: number;
  title: string;
  url: string;
  pdfViewUrl: string;
  createdAt: string;
}

interface Worksheet {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: string;
  skillType: string;
  audience: string;
  theme: string;
  youtubeUrl: string;
  youtubeEmbedUrl: string;
  content: string;
  status: string;
  downloadable: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  pdfs: WorksheetPdf[];
}

// ─── Mock data (used when API is not connected) ────────────────────────────────
const MOCK_WORKSHEETS: Worksheet[] = [
  {
    id: 1,
    title: "Testing New",
    slug: "testing-new",
    description: "Test test test",
    level: "Beginner (A1)",
    skillType: "Reading",
    audience: "Children",
    theme: "Culture",
    youtubeUrl: "https://www.youtube.com/watch?v=Rac-Rps7z4M",
    youtubeEmbedUrl: "https://www.youtube.com/embed/Rac-Rps7z4M",
    content: "",
    status: "published",
    downloadable: true,
    publishedAt: null,
    createdAt: "2026-04-27T13:29:39.000Z",
    updatedAt: "2026-04-27T15:32:09.000Z",
    pdfs: [
      {
        id: 9,
        worksheetId: 1,
        title: "Teacher_Pedagogies.pdf",
        url: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        pdfViewUrl: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        createdAt: "2026-04-27T15:32:09.000Z",
      },
      {
        id: 10,
        worksheetId: 1,
        title: "Teacher_Pedagogies_v2.pdf",
        url: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296575/atoilenaija/worksheets/ksgizwgxczsefrejn5sy",
        pdfViewUrl: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296575/atoilenaija/worksheets/ksgizwgxczsefrejn5sy",
        createdAt: "2026-04-27T15:32:09.000Z",
      },
    ],
  },
  {
    id: 2,
    title: "Les Animaux de la Ferme",
    slug: "les-animaux-ferme",
    description: "Discover farm animals vocabulary through fun exercises and songs",
    level: "Beginner (A1)",
    skillType: "Listening",
    audience: "Children",
    theme: "Nature",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    content: "",
    status: "published",
    downloadable: true,
    publishedAt: "2026-04-01T00:00:00.000Z",
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    pdfs: [
      {
        id: 11,
        worksheetId: 2,
        title: "Animals_Vocabulary_Sheet.pdf",
        url: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        pdfViewUrl: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        createdAt: "2026-04-01T00:00:00.000Z",
      },
    ],
  },
  {
    id: 3,
    title: "La Ville et les Transports",
    slug: "ville-transports",
    description: "Navigate city life and transportation vocabulary for intermediate learners",
    level: "Intermediate (B1)",
    skillType: "Speaking",
    audience: "Adolescent",
    theme: "Urban Life",
    youtubeUrl: "https://www.youtube.com/watch?v=Rac-Rps7z4M",
    youtubeEmbedUrl: "https://www.youtube.com/embed/Rac-Rps7z4M",
    content: "",
    status: "published",
    downloadable: true,
    publishedAt: "2026-03-15T00:00:00.000Z",
    createdAt: "2026-03-15T00:00:00.000Z",
    updatedAt: "2026-03-15T00:00:00.000Z",
    pdfs: [
      {
        id: 12,
        worksheetId: 3,
        title: "City_Transport_Exercises.pdf",
        url: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        pdfViewUrl: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        createdAt: "2026-03-15T00:00:00.000Z",
      },
    ],
  },
  {
    id: 4,
    title: "Le Monde du Travail",
    slug: "monde-du-travail",
    description: "Professional French for adult learners entering the workplace",
    level: "Upper Intermediate (B2)",
    skillType: "Writing",
    audience: "Adult",
    theme: "Professional",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    content: "",
    status: "published",
    downloadable: true,
    publishedAt: "2026-02-20T00:00:00.000Z",
    createdAt: "2026-02-20T00:00:00.000Z",
    updatedAt: "2026-02-20T00:00:00.000Z",
    pdfs: [
      {
        id: 13,
        worksheetId: 4,
        title: "Workplace_French.pdf",
        url: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        pdfViewUrl: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        createdAt: "2026-02-20T00:00:00.000Z",
      },
    ],
  },
  {
    id: 5,
    title: "Les Saisons et la Météo",
    slug: "saisons-meteo",
    description: "Elementary vocabulary for seasons and weather in French",
    level: "Elementary (A2)",
    skillType: "Reading",
    audience: "Children",
    theme: "Nature",
    youtubeUrl: "https://www.youtube.com/watch?v=Rac-Rps7z4M",
    youtubeEmbedUrl: "https://www.youtube.com/embed/Rac-Rps7z4M",
    content: "",
    status: "published",
    downloadable: true,
    publishedAt: "2026-01-10T00:00:00.000Z",
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
    pdfs: [
      {
        id: 14,
        worksheetId: 5,
        title: "Seasons_Weather.pdf",
        url: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        pdfViewUrl: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        createdAt: "2026-01-10T00:00:00.000Z",
      },
    ],
  },
  {
    id: 6,
    title: "Débat et Argumentation",
    slug: "debat-argumentation",
    description: "Master structured debate and argumentation skills in advanced French",
    level: "Upper Intermediate (B2)",
    skillType: "Speaking",
    audience: "Adult",
    theme: "Society",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    content: "",
    status: "published",
    downloadable: true,
    publishedAt: "2026-01-05T00:00:00.000Z",
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-01-05T00:00:00.000Z",
    pdfs: [
      {
        id: 15,
        worksheetId: 6,
        title: "Debate_Worksheet.pdf",
        url: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        pdfViewUrl: "https://res.cloudinary.com/dbrwenbbp/raw/upload/v1777296533/atoilenaija/worksheets/th0eq8hbc97ipk58kk1m",
        createdAt: "2026-01-05T00:00:00.000Z",
      },
    ],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const AUDIENCES = ["Children", "Adolescent", "Adult"] as const;
const LEVELS = ["Beginner (A1)", "Elementary (A2)", "Intermediate (B1)", "Upper Intermediate (B2)"] as const;

const AUDIENCE_META: Record<string, { icon: React.ReactNode; bg: string; desc: string; image: string }> = {
  Children: {
    icon: <GraduationCap size={32} className="text-white" />,
    bg: "from-[#002395] to-[#0035cc]",
    desc: "Fun exercises for young learners",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80"
  },
  Adolescent: {
    icon: <Users size={32} className="text-white" />,
    bg: "from-[#ED2939] to-[#b51f2b]",
    desc: "Engaging content for teenagers",
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80"
  },
  Adult: {
    icon: <BookOpen size={32} className="text-white" />,
    bg: "from-slate-700 to-slate-900",
    desc: "Professional & academic content",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
  },
};

const LEVEL_META: Record<string, { badge: string; badgeText: string; desc: string; border: string; image: string }> = {
  "Beginner (A1)": {
    badge: "bg-emerald-100 text-emerald-700", badgeText: "A1",
    desc: "Start from the very basics", border: "border-emerald-200",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80"
  },
  "Elementary (A2)": {
    badge: "bg-sky-100 text-sky-700", badgeText: "A2",
    desc: "Build everyday vocabulary", border: "border-sky-200",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80"
  },
  "Intermediate (B1)": {
    badge: "bg-amber-100 text-amber-700", badgeText: "B1",
    desc: "Express yourself with confidence", border: "border-amber-200",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
  },
  "Upper Intermediate (B2)": {
    badge: "bg-rose-100 text-rose-700", badgeText: "B2",
    desc: "Master complex language skills", border: "border-rose-200",
    image: "https://images.unsplash.com/photo-1535515384173-d74166f26820?w=800&q=80"
  },
};
// ─── Normalizers (put here) ───────────────────────────────────────────────────
const normalizeAudience = (s?: string) => {
  const v = (s || "").toLowerCase();
  if (v.includes("child")) return "Children";
  if (v.includes("adolescent") || v.includes("teen") || v.includes("youth")) return "Adolescent";
  if (v.includes("adult")) return "Adult";
  return "Children";
};

const normalizeLevel = (s?: string) => {
  const v = (s || "").toLowerCase();
  if (v.includes("a1") || v.includes("beginner")) return "Beginner (A1)";
  if (v.includes("a2") || v.includes("elementary")) return "Elementary (A2)";
  if (v.includes("b2") || v.includes("upper")) return "Upper Intermediate (B2)";
  if (v.includes("b1") || v.includes("intermediate")) return "Intermediate (B1)";
  return "Beginner (A1)";
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getYoutubeThumbnail = (embedUrl: string): string => {
  const match = embedUrl.match(/embed\/([^?&]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
};

const formatFileSize = (_url: string): string => {
  // Real file sizes would come from the API; using a placeholder
  const sizes = ["208 Ko", "1 Mo", "625 Ko", "550 Ko", "282 Ko", "460 Ko"];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

// ─── Sub-component: Worksheet Detail Page ─────────────────────────────────────
function WorksheetDetail({
  worksheet,
  onBack,
}: {
  worksheet: Worksheet;
  onBack: () => void;
}) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const handleDownloadSingle = async (pdf: WorksheetPdf) => {
    setDownloadingId(pdf.id);
    try {
      const response = await fetch(pdf.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdf.title.endsWith(".pdf") ? pdf.title : `${pdf.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      console.error("Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        worksheet.pdfs.map(async (pdf) => {
          const response = await fetch(pdf.url);
          const blob = await response.blob();
          zip.file(pdf.title.endsWith(".pdf") ? pdf.title : `${pdf.title}.pdf`, blob);
        })
      );
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${worksheet.slug}-worksheets.zip`);
    } catch {
      console.error("Download all failed");
    } finally {
      setDownloadingAll(false);
    }
  };

  const lm = LEVEL_META[worksheet.level] || LEVEL_META["Beginner (A1)"];

  return (
    <main className="pt-20 min-h-screen bg-[#f8f9fc]">
      {/* Header band — France flag colors */}
      <div className="w-full h-2 flex">
        <div className="flex-1 bg-[#002395]" />
        <div className="flex-1 bg-white border-y border-gray-200" />
        <div className="flex-1 bg-[#ED2939]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-widest transition-colors group mb-10"
        >
          <div className="p-3 rounded-2xl bg-white border border-gray-200 shadow-sm group-hover:bg-gray-50">
            <ArrowLeft size={18} />
          </div>
          Back to Worksheets
        </button>

        {/* Title block */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-10">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-xl border ${lm.badge} ${lm.border}`}>
                {lm.badgeText}
              </span>
              <span className="text-xs font-black uppercase px-3 py-1.5 rounded-xl border bg-slate-100 text-slate-600 border-slate-200">
                {worksheet.audience}
              </span>
              <span className="text-xs font-black uppercase px-3 py-1.5 rounded-xl border bg-gray-100 text-gray-600 border-gray-200">
                {/* {worksheet.skillType} */}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">{worksheet.title}</h1>
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Video + info */}
          <div className="lg:col-span-2 space-y-8">
            {/* YouTube Video */}
            {worksheet.youtubeEmbedUrl && (
              <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-black">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={worksheet.youtubeEmbedUrl}
                    title={worksheet.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            {worksheet.description &&(
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg leading-relaxed text-justify">{worksheet.description}</p>
              </div>
            )}

            {/* Content if any */}
            {worksheet.content && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-wide">Content</h3>
                <div className="w-fit p-2 text-justify whitespace-pre prose prose-slate max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: worksheet.content }} />
              </div>
            )}
          </div>

          {/* Right — PDFs */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                  Resources ({worksheet.pdfs.length})
                </h3>
                {worksheet.pdfs.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    disabled={downloadingAll}
                    className="flex items-center gap-2 px-4 py-2 bg-[#002395] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#001a7a] transition-all disabled:opacity-50 shadow-md"
                  >
                    {downloadingAll ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Archive size={14} />
                    )}
                    Download All
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {worksheet.pdfs.map((pdf) => {
                  const fileSize = formatFileSize(pdf.url);
                  return (
                    <div
                      key={pdf.id}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#002395]/30 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="w-10 h-10 bg-[#ED2939]/10 rounded-xl flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-[#ED2939]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate">{pdf.title}</p>
                        <p className="text-xs text-gray-400 font-medium">PDF · {fileSize}</p>
                      </div>
                      <button
                        onClick={() => handleDownloadSingle(pdf)}
                        disabled={downloadingId === pdf.id}
                        className="p-2.5 bg-white rounded-xl border border-gray-200 text-[#002395] hover:bg-[#002395] hover:text-white transition-all shadow-sm shrink-0 disabled:opacity-50"
                        aria-label={`Download ${pdf.title}`}
                      >
                        {downloadingId === pdf.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Download size={16} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meta info card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Details</h3>
              {[
                { label: "Level", value: worksheet.level },
                { label: "Audience", value: worksheet.audience },
                /* { label: "Skill", value: worksheet.skillType }, */
                { label: "Theme", value: worksheet.theme },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                  <span className="text-xs font-black text-slate-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Main Worksheet Page ───────────────────────────────────────────────────────
function WorksheetPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  // Navigation state
  type View = "audiences" | "levels" | "cards" | "detail";
  const [view, setView] = useState<View>("audiences");
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedWorksheet, setSelectedWorksheet] = useState<Worksheet | null>(null);

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  useEffect(() => {
    const fetchWorksheets = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${CLIENT_KEY}/api/worksheets`);
        if (!res.ok) throw new Error("API not available");
        const data = await res.json();
        const list = data.data || data;
        if (Array.isArray(list) && list.length > 0) {
          const normalized = list.map((w: any) => ({
            ...w,
            audience: normalizeAudience(w.audience),
            level: normalizeLevel(w.level),
          }));
          setWorksheets(normalized);
          setUsingMock(false);
        } else {
          setWorksheets(MOCK_WORKSHEETS);
          setUsingMock(true);
        }
      } catch {
        setWorksheets(MOCK_WORKSHEETS);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };
    fetchWorksheets();
  }, [CLIENT_KEY]);
  // When URL has /worksheet/:slug, auto-open that worksheet
useEffect(() => {
  if (slug && worksheets.length > 0) {
    const found = worksheets.find(w => w.slug === slug);
    if (found) {
      setSelectedWorksheet(found);
      setView("detail");
    }
  }
}, [slug, worksheets]);
  const filteredWorksheets = useMemo(() => {
    return worksheets.filter(
      (w) =>
        (!selectedAudience || w.audience === selectedAudience) &&
        (!selectedLevel || w.level === selectedLevel)
    );
  }, [worksheets, selectedAudience, selectedLevel]);

  // If showing detail page
  if (selectedWorksheet) {
  return (
    <WorksheetDetail
      worksheet={selectedWorksheet}
      onBack={() => {
        setSelectedWorksheet(null);          // <-- clears the detail view
        navigate('/worksheet', { replace: true });
        // go back to where you were
        if (selectedLevel) setView("cards");
        else if (selectedAudience) setView("levels");
        else setView("audiences");
      }} 
    />
  );
}
  

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#002395]" size={40} />
      </div>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-[#f8f9fc]">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
          {/* ── NEW PAGE HEADER ── */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)} // goes back, change to navigate('/resources') if you prefer
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-gray-50 font-bold text-sm uppercase tracking-widest transition-all shadow-sm"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Worksheets
            </h1>
          </div>

        {/* usingMock is now used - fixes the warning */}
        {usingMock && (
          <span className="inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-[11px] font-bold uppercase tracking-widest">
            Demo Mode
          </span>
        )}
      </div>

        {/* ── VIEW: AUDIENCE SELECTION ── */}
        {view === "audiences" && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-2">Select Category</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">Who are you teaching?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {AUDIENCES.map((audience) => {
                const meta = AUDIENCE_META[audience];
                const count = worksheets.filter((w) => w.audience === audience).length;
                return (
                  <button
                    key={audience}
                    onClick={() => { setSelectedAudience(audience); setView("levels"); }}
                    className="group relative h-72 rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
                    style={{
                      backgroundImage: `url(${meta.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Keep your solid gradient, now as overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="relative z-10 h-full flex flex-col justify-end p-8">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
                        {meta.icon}
                      </div>
                      <h3 className="text-2xl font-black text-white mb-1">{audience}</h3>
                      <p className="text-white/70 text-sm font-medium mb-3">{meta.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                          {count} worksheet{count!== 1? "s" : ""}
                        </span>
                        <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── VIEW: LEVEL SELECTION ── */}
        {view === "levels" && selectedAudience && (
          <div>
            <button
              onClick={() => { setView("audiences"); setSelectedAudience(null); }}
              className="flex items-center gap-3 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-widest transition-colors group mb-10"
            >
              <div className="p-3 rounded-2xl bg-white border border-gray-200 group-hover:bg-gray-50">
                <ArrowLeft size={18} />
              </div>
              Back to Categories
            </button>

            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-2">{selectedAudience}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">Select a CEFR level</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {LEVELS.map((level) => {
                const lm = LEVEL_META[level];
                const count = worksheets.filter((w) => w.audience === selectedAudience && w.level === level).length;
                return (
                  <button
                    key={level}
                    onClick={() => { setSelectedLevel(level); setView("cards"); }}
                    className={`group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-left border-2 ${lm.border}`}
                  >
                    {/* BACKGROUND IMAGE */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${lm.image})` }}
                    />
                    {/* white wash so text stays readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    <div className="relative z-10 p-7 h-full flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <span className={`text-xl font-black px-3 py-1.5 rounded-xl ${lm.badge}`}>{lm.badgeText}</span>
                        <Layers size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>

                      <h3 className="text-lg font-black text-white mb-1 leading-tight">
                        {level.replace(/\s*\(.*?\)/, "")}
                      </h3>
                      <p className="text-white/80 text-sm font-medium mb-auto">{lm.desc}</p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
                          {count} worksheet{count!== 1? "s" : ""}
                        </span>
                        <ArrowRight size={14} className="text-gray-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── VIEW: WORKSHEET CARDS ── */}
        {view === "cards" && selectedAudience && selectedLevel && (
          <div>
            {/* Breadcrumb + back */}
            <div className="flex flex-col gap-4 mb-10">
              <button
                onClick={() => { setView("levels"); setSelectedLevel(null); }}
                className="flex items-center gap-3 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-widest transition-colors group w-fit"
              >
                <div className="p-3 rounded-2xl bg-white border border-gray-200 group-hover:bg-gray-50">
                  <ArrowLeft size={18} />
                </div>
                Back to Levels
              </button>
              <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest">
                <span className="text-slate-400">{selectedAudience}</span>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-slate-400">{selectedLevel}</span>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-[#002395]">Worksheets</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-1">{selectedLevel} Worksheets</h2>
              <p className="text-slate-400 font-bold uppercase text-sm tracking-[0.3em]">
                {filteredWorksheets.length} worksheet{filteredWorksheets.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {filteredWorksheets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
                  <BookOpen size={32} className="text-gray-300" />
                </div>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                  No worksheets for this selection yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredWorksheets.map((ws) => {
                  const thumbnail = getYoutubeThumbnail(ws.youtubeEmbedUrl);
                  const lm = LEVEL_META[ws.level] || LEVEL_META["Beginner (A1)"];
                  return (
                    <div
                      key={ws.id}
                      onClick={() => navigate(`/worksheet/${ws.slug}`)}
                      className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-slate-900 overflow-hidden">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={ws.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#002395] to-[#001a7a]">
                            <Play size={40} className="text-white/30" />
                          </div>
                        )}
                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <Play size={24} className="text-[#ED2939] ml-1" fill="#ED2939" />
                          </div>
                        </div>
                        {/* Level badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${lm.badge}`}>{lm.badgeText}</span>
                        </div>
                        {/* PDF count */}
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-lg bg-black/50 text-white backdrop-blur-sm">
                            <FileText size={10} /> {ws.pdfs.length} PDF{ws.pdfs.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-7 flex flex-col flex-1">
                        <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-[#002395] transition-colors leading-tight">
                          {ws.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">{ws.description}</p>
                        <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {/* <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ws.skillType}</span> */}
                            <span className="text-gray-200">·</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ws.theme}</span>
                          </div>
                          <ArrowRight size={16} className="text-gray-300 group-hover:text-[#002395] group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}

export default WorksheetPage;