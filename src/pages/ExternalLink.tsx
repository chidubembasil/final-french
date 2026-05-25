import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Search,
  Share2,
  Copy,
  Check,
  Link2,
  MessageCircle,
  Facebook,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ResourceLink {
  id: number;
  title: string;
  url: string;
  description: string;
  category?: string;
  level?: string;
  skillType?: string;
  theme?: string;
  sourceType?: "pedagogy" | "resource";
}

// ─── Mock data (used when API is not connected / returns empty) ────────────────
const MOCK_LINKS: ResourceLink[] = [
  {
    id: 1,
    title: "TV5MONDE Enseigner",
    url: "https://enseigner.tv5monde.com",
    description: "Fiches pédagogiques et ressources audiovisuelles pour enseigner le français langue étrangère.",
    category: "Video Resources",
    level: "All Levels",
    skillType: "Listening",
    theme: "Culture",
    sourceType: "resource",
  },
  {
    id: 2,
    title: "IfClasse Portail Pédagogique",
    url: "http://ifclasse.institutfrancais.com/",
    description: "Portail officiel de l'Institut français avec des ressources pédagogiques complètes.",
    category: "Official Portal",
    level: "All Levels",
    skillType: "Reading",
    theme: "General",
    sourceType: "resource",
  },
  {
    id: 3,
    title: "Le Français dans le Monde",
    url: "https://www.fdlm.org",
    description: "Revue internationale dédiée à l'enseignement et à la diffusion du français.",
    category: "Magazine",
    level: "Intermediate",
    skillType: "Reading",
    theme: "Culture",
    sourceType: "resource",
  },
  {
    id: 4,
    title: "Français Authentique",
    url: "https://www.francaisauthentique.com",
    description: "Méthode naturelle pour apprendre le français avec des contenus authentiques.",
    category: "Learning Method",
    level: "All Levels",
    skillType: "Listening",
    theme: "Daily Life",
    sourceType: "resource",
  },
  {
    id: 5,
    title: "RFI Savoirs",
    url: "https://savoirs.rfi.fr",
    description: "Ressources radiophoniques et exercices de compréhension orale en français.",
    category: "Radio / Audio",
    level: "Beginner",
    skillType: "Listening",
    theme: "News & Media",
    sourceType: "resource",
  },
  {
    id: 6,
    title: "Bonjour de France",
    url: "https://www.bonjourdefrance.com",
    description: "Exercices interactifs de grammaire, vocabulaire et conjugaison gratuits.",
    category: "Grammar",
    level: "All Levels",
    skillType: "Writing",
    theme: "Grammar",
    sourceType: "resource",
  },
  {
    id: 7,
    title: "DELF DALF Official",
    url: "https://www.france-education-international.fr/diplome/delf-dalf",
    description: "Site officiel des certifications DELF et DALF pour tous les niveaux.",
    category: "Certification",
    level: "All Levels",
    skillType: "All Skills",
    theme: "Assessment",
    sourceType: "resource",
  },
  {
    id: 8,
    title: "Larousse Conjugaison",
    url: "https://www.larousse.fr/conjugaison",
    description: "Conjugueur en ligne complet pour tous les verbes français.",
    category: "Reference",
    level: "All Levels",
    skillType: "Writing",
    theme: "Grammar",
    sourceType: "resource",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const truncate = (text: string, maxLen = 80): string => {
  if (!text) return "";
  return text.length <= maxLen ? text : text.slice(0, maxLen).trimEnd() + "…";
};

const XLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
function ExternalLinksPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<ResourceLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      try {
        const [pedRes, resRes] = await Promise.all([
          fetch(`${CLIENT_KEY}/api/pedagogies`),
          fetch(`${CLIENT_KEY}/api/resources`),
        ]);

        const pedJson = await pedRes.json();
        const resJson = await resRes.json();

        const pedData = Array.isArray(pedJson) ? pedJson : pedJson.data || [];
        const resData = Array.isArray(resJson) ? resJson : resJson.data || [];

        const normalizedPed = pedData.map((p: any) => ({
          id: p.id,
          sourceType: "pedagogy" as const,
          ...(p.attributes || p),
        }));

        const normalizedRes = resData.map((r: any) => ({
          id: r.id,
          sourceType: "resource" as const,
          ...(r.attributes || r),
        }));

        const combined = [...normalizedPed, ...normalizedRes].filter(
          (item) => item.url && item.title
        );

        if (combined.length > 0) {
          setLinks(combined);
          setUsingMock(false);
        } else {
          setLinks(MOCK_LINKS);
          setUsingMock(true);
        }
      } catch {
        setLinks(MOCK_LINKS);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();

    const handleClickOutside = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setSharingId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [CLIENT_KEY]);

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;
    const q = searchQuery.toLowerCase();
    return links.filter(
      (l) =>
        l.title?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.category?.toLowerCase().includes(q)
    );
  }, [links, searchQuery]);

  const handleShare = (
    e: React.MouseEvent,
    platform: string,
    item: ResourceLink
  ) => {
    e.stopPropagation();
    const shareUrl = item.url;
    const text = `Check out this resource: ${item.title}`;

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
      setSharingId(null);
      return;
    }

    const shareLinks: Record<string, string> = {
      x: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      instagram: `https://www.instagram.com/`,
    };

    const target = shareLinks[platform];
    if (target) window.open(target, "_blank", "noopener,noreferrer");
    setSharingId(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#002395]" size={40} />
      </div>
    );
  }

  // ─── Shared share dropdown JSX (reused in both mobile + desktop) ─────────────
  const ShareDropdown = ({ item }: { item: ResourceLink }) => (
    <div
      ref={shareMenuRef}
      className="absolute bottom-12 left-0 z-30 bg-white border border-gray-100 p-3 rounded-2xl shadow-2xl flex items-center gap-1 min-w-max"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Share on X"
        onClick={(e) => handleShare(e, "x", item)}
        className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-black transition-colors"
        title="Share on X"
      >
        <XLogo className="w-4 h-4" />
      </button>

      <button
        type="button"
        aria-label="Share on WhatsApp"
        onClick={(e) => handleShare(e, "whatsapp", item)}
        className="p-2.5 rounded-xl hover:bg-green-50 text-slate-400 hover:text-green-500 transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle size={18} />
      </button>

      <button
        type="button"
        aria-label="Share on Facebook"
        onClick={(e) => handleShare(e, "facebook", item)}
        className="p-2.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
        title="Share on Facebook"
      >
        <Facebook size={18} />
      </button>

      <button
        type="button"
        aria-label="Share on Instagram"
        onClick={(e) => handleShare(e, "instagram", item)}
        className="p-2.5 rounded-xl hover:bg-pink-50 text-slate-400 hover:text-pink-500 transition-colors"
        title="Share on Instagram"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <button
        type="button"
        aria-label="Copy link"
        onClick={(e) => handleShare(e, "copy", item)}
        className="p-2.5 rounded-xl hover:bg-gray-100 text-slate-400 transition-colors"
        title="Copy link"
      >
        {copiedId === item.id ? (
          <Check size={18} className="text-green-500" />
        ) : (
          <Copy size={18} />
        )}
      </button>
    </div>
  );

  return (
    <main className="pt-20 min-h-screen bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

        {/* Back + search */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10">
          <button
            onClick={() => navigate("/resource")}
            className="flex items-center gap-3 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-widest transition-colors group"
          >
            <div className="p-3 rounded-2xl bg-white border border-gray-200 shadow-sm group-hover:bg-gray-50">
              <ArrowLeft size={18} />
            </div>
            Back to Resources
          </button>
          {usingMock && (
            <span className="inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-[11px] font-bold uppercase tracking-widest">
              Demo Mode
            </span>
          )}

          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search links..."
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-gray-200 outline-none focus:border-[#002395] text-sm font-medium shadow-sm transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Link2 size={16} className="text-[#002395]" />
            <span className="text-sm font-black text-slate-700">
              {filteredLinks.length} link{filteredLinks.length !== 1 ? "s" : ""}
            </span>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-gray-100 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Table */}
        {filteredLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
              <Link2 size={32} className="text-gray-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              No links match your search.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-x-auto">

            {/* Table header — hidden on mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 bg-slate-50 border-b border-gray-100">
              <div className="col-span-3 text-xs font-black text-slate-400 uppercase tracking-widest">Title</div>
              <div className="col-span-4 text-xs font-black text-slate-400 uppercase tracking-widest">Description</div>
              <div className="col-span-3 text-xs font-black text-slate-400 uppercase tracking-widest">Link</div>
              <div className="col-span-2 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Share</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {filteredLinks.map((item, idx) => (
                <div
                  key={`${item.sourceType}-${item.id}`}
                  className={`transition-colors hover:bg-gray-50/60 ${idx % 2 === 0 ? "" : "bg-slate-50/30"}`}
                >

                  {/* ── Mobile card (shown below md) ── */}
                  <div className="flex md:hidden flex-col gap-3 px-5 py-5">
                    {/* Title row */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#002395]/10 rounded-xl flex items-center justify-center shrink-0">
                        <ExternalLink size={14} className="text-[#002395]" />
                      </div>
                      <div>
                        <p className="font-black text-sm text-slate-800 leading-tight">{item.title}</p>
                        {item.category && (
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {item.category}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {truncate(item.description, 90)}
                    </p>

                    {/* Actions row */}
                    <div className="flex items-center gap-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#002395] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#001a7a] transition-all shadow-sm group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit
                        <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>

                      <div className="relative">
                        <button
                          type="button"
                          aria-label="Share resource"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSharingId(sharingId === item.id ? null : item.id);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            sharingId === item.id
                              ? "bg-[#ED2939] text-white border-[#ED2939]"
                              : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <Share2 size={16} />
                        </button>
                        {sharingId === item.id && <ShareDropdown item={item} />}
                      </div>
                    </div>
                  </div>

                  {/* ── Desktop table row (hidden below md) ── */}
                  <div className="hidden md:grid grid-cols-12 gap-5 px-8 py-6 items-center">
                    {/* Title */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#002395]/10 rounded-xl flex items-center justify-center shrink-0">
                          <ExternalLink size={14} className="text-[#002395]" />
                        </div>
                        <div className="text-sm">
                          <p className="font-black text-sm text-slate-800 leading-tight">{item.title}</p>
                          {item.category && (
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                              {item.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="col-span-4">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {truncate(item.description, 90)}
                      </p>
                    </div>

                    {/* Link */}
                    <div className="col-span-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#002395] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#001a7a] transition-all shadow-sm group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit
                        <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>

                    {/* Share */}
                    <div className="col-span-2 flex justify-center relative">
                      <button
                        type="button"
                        aria-label="Share resource"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharingId(sharingId === item.id ? null : item.id);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          sharingId === item.id
                            ? "bg-[#ED2939] text-white border-[#ED2939]"
                            : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <Share2 size={16} />
                      </button>

                      {sharingId === item.id && (
                        <div
                          ref={shareMenuRef}
                          className="absolute bottom-12 right-0 z-30 bg-white border border-gray-100 p-3 rounded-2xl shadow-2xl flex items-center gap-1 min-w-max"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            aria-label="Share on X"
                            onClick={(e) => handleShare(e, "x", item)}
                            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-black transition-colors"
                            title="Share on X"
                          >
                            <XLogo className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            aria-label="Share on WhatsApp"
                            onClick={(e) => handleShare(e, "whatsapp", item)}
                            className="p-2.5 rounded-xl hover:bg-green-50 text-slate-400 hover:text-green-500 transition-colors"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle size={18} />
                          </button>

                          <button
                            type="button"
                            aria-label="Share on Facebook"
                            onClick={(e) => handleShare(e, "facebook", item)}
                            className="p-2.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Share on Facebook"
                          >
                            <Facebook size={18} />
                          </button>

                          <button
                            type="button"
                            aria-label="Share on Instagram"
                            onClick={(e) => handleShare(e, "instagram", item)}
                            className="p-2.5 rounded-xl hover:bg-pink-50 text-slate-400 hover:text-pink-500 transition-colors"
                            title="Share on Instagram"
                          >
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </button>

                          <div className="w-px h-5 bg-gray-200 mx-1" />

                          <button
                            type="button"
                            aria-label="Copy link"
                            onClick={(e) => handleShare(e, "copy", item)}
                            className="p-2.5 rounded-xl hover:bg-gray-100 text-slate-400 transition-colors"
                            title="Copy link"
                          >
                            {copiedId === item.id ? (
                              <Check size={18} className="text-green-500" />
                            ) : (
                              <Copy size={18} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-10">
          {filteredLinks.length} external resource{filteredLinks.length !== 1 ? "s" : ""} listed · Click any row to visit
        </p>
      </div>
    </main>
  );
}

export default ExternalLinksPage;