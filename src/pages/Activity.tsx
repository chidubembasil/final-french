import { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowRight,
  PlayCircle,
  Book,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Search,
  Trophy,
  Volume2,
  Layers,
  GraduationCap,
  Users,
  CheckCircle2,
  XCircle,
  Video,
  AlignLeft,
  ListOrdered,
  Link2,
  ToggleLeft,
  ArrowLeft,
} from "lucide-react";
import img1 from "../assets/img/_A1A4707.jpg";

// Background images from Unsplash
// Audience thumbnails
const childrenBg    = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80";
const adolescentBg  = "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80";
const adultBg       = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80";

// Difficulty thumbnails (used per audience category)
const a1Bg          = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80";
const a2Bg          = "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80";
const b1Bg          = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
const b2Bg          = "https://images.unsplash.com/photo-1535515384173-d74166f26820?w=800&q=80";

// ─────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────
interface MCQQuestion {
  type?: "mcq";
  question: string;
  options: string[];
  correctAnswer: number;
}
interface TrueFalseQuestion {
  type: "true_false";
  question: string;
  options: string[];
  correctAnswer: number;
}
interface MatchingQuestion {
  type: "matching";
  question: string;
  pairs: { left: string; right: string }[];
}
interface SequencingQuestion {
  type: "sequencing" | "ordering";
  question: string;
  correctAnswer: string[];
  sequence: string[];
  items?: string[];
}
interface GapFillingQuestion {
  type: "gap_filling";
  question: string;
  correctAnswer: string;
}
interface FillInBlankQuestion {
  type: "fill_in_blank";
  question: string;
  blanks: string[];
}
interface ShortAnswerQuestion {
  type: "short_answer";
  question: string;
  correctAnswer: string;
}
interface EssayQuestion {
  type: "essay";
  question: string;
  sampleAnswer?: string;
}

type AnyQuestion =
  | MCQQuestion
  | TrueFalseQuestion
  | MatchingQuestion
  | SequencingQuestion
  | GapFillingQuestion
  | FillInBlankQuestion
  | ShortAnswerQuestion
  | EssayQuestion;

interface Exercise {
  id: number;
  title: string;
  description: string;
  exerciseType: string;
  difficulty: string;
  audience: string;
  mediaUrl?: string;
  publishedAt: string | null;
  content: AnyQuestion[];
  podcastId?: number | null;
  isEmbed?: boolean;
  embedUrl?: string | null;
}
interface PodcastMedia {
  id: number;
  mediaUrl: string;
  mediaType?: string;
}
interface H5PContent {
  id: number;
  title: string;
  description: string;
  embedUrl: string;
  difficulty: string;
  audience: string;
  embedImage?: string | null;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const MOCK_HERO = {
  title: "Master Your Skills",
  description:
    "Engage with our interactive French language exercises designed to improve linguistic precision.",
  mediaUrl: img1,
};

const extractIframeUrl = (embedCode: string): string | null => {
  if (!embedCode) return null;
  if (embedCode.startsWith("http")) return embedCode;
  const srcMatch = embedCode.match(/<iframe[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/i);
  if (srcMatch && srcMatch[1]) return srcMatch[1].trim();
  const urlMatch = embedCode.match(/(https?:\/\/[^\s"<>]+)/);
  if (urlMatch) return urlMatch[1];
  return null;
};

const isEmbedContent = (content: any): boolean => {
  if (typeof content !== "string") return false;
  return content.includes("h5p.com") || content.includes("<iframe") || content.startsWith("http");
};

const isVideoUrl = (url: string) =>
  /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) ||
  url.includes("youtube.com") ||
  url.includes("youtu.be") ||
  url.includes("vimeo.com");

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "");

// ── UPDATED: 4 difficulty levels with CEFR labels
const DIFFICULTIES = ["Beginner (A1)", "Elementary (A2)", "Intermediate (B1)", "Upper Intermediate (B2)"];

const DIFF: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Beginner (A1)":           { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  "Elementary (A2)":         { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",     dot: "bg-sky-400"     },
  "Intermediate (B1)":       { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400"   },
  "Upper Intermediate (B2)": { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    dot: "bg-rose-400"    },
};

// ── UPDATED: 3 audience categories
const AUDIENCE_BACKGROUNDS: Record<string, string> = {
  "Children":   childrenBg,
  "Adolescent": adolescentBg,
  "Adult":      adultBg,
};

// Difficulty backgrounds (same set reused across all audience categories)
const DIFFICULTY_BACKGROUNDS: Record<string, string> = {
  "Beginner (A1)":           a1Bg,
  "Elementary (A2)":         a2Bg,
  "Intermediate (B1)":       b1Bg,
  "Upper Intermediate (B2)": b2Bg,
};

// Difficulty gradient overlays
const DIFFICULTY_GRADIENTS: Record<string, string> = {
  "Beginner (A1)":           "from-emerald-900/90 via-emerald-700/50",
  "Elementary (A2)":         "from-sky-900/90 via-sky-700/50",
  "Intermediate (B1)":       "from-amber-900/90 via-amber-700/50",
  "Upper Intermediate (B2)": "from-rose-900/90 via-rose-700/50",
};

const getQType = (q: AnyQuestion) => (q as any).type || "mcq";

function ExTypeIcon({ type }: { type: string }) {
  const t = type?.toLowerCase();
  if (t === "true_false")   return <ToggleLeft size={32} />;
  if (t === "matching")     return <Link2 size={32} />;
  if (t === "sequencing" || t === "ordering") return <ListOrdered size={32} />;
  if (t === "gap_filling" || t === "fill_in_blank" || t === "short_answer" || t === "essay") return <AlignLeft size={32} />;
  return <Book size={32} />;
}

function EmptyState({ icon, msg }: { icon: React.ReactNode; msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded- bg-gray-100 flex items-center justify-center mb-6">{icon}</div>
      <p className="text-slate-400 font-bold text-sm">{msg}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCORING - FIXED FOR PARTIAL CREDIT
// ─────────────────────────────────────────────
type ChoiceMap  = Record<number, number>;
type MatchMap   = Record<number, Record<string, string>>;
type SeqMap     = Record<number, string[]>;
type TextMap    = Record<number, string>;
type FibMap     = Record<number, string[]>;

function calculateQuestionScore(
  q: AnyQuestion, idx: number,
  choice: ChoiceMap, match: MatchMap, seq: SeqMap, text: TextMap, fib: FibMap
): { earned: number; max: number } {
  const t = getQType(q);
  if (t === "essay") return { earned: 0, max: 0 };
  if (t === "mcq" || t === "true_false") {
    const correct = choice[idx] === (q as MCQQuestion).correctAnswer;
    return { earned: correct ? 1 : 0, max: 1 };
  }
  if (t === "gap_filling") {
    const correct = (text[idx] || "").trim().toLowerCase() === (q as GapFillingQuestion).correctAnswer.trim().toLowerCase();
    return { earned: correct ? 1 : 0, max: 1 };
  }
  if (t === "short_answer") {
    const correct = (text[idx] || "").trim().toLowerCase() === (q as ShortAnswerQuestion).correctAnswer.trim().toLowerCase();
    return { earned: correct ? 1 : 0, max: 1 };
  }
  if (t === "sequencing" || t === "ordering") {
    const sq = q as SequencingQuestion;
    const correctAnswer = sq.correctAnswer;
    const given = seq[idx] || sq.sequence || [...correctAnswer];
    const totalItems = correctAnswer.length;
    if (totalItems === 0) return { earned: 0, max: 0 };
    let correctCount = 0;
    for (let i = 0; i < totalItems; i++) {
      if (given[i] === correctAnswer[i]) correctCount++;
    }
    return { earned: correctCount, max: totalItems };
  }
  if (t === "matching") {
    const mq = q as MatchingQuestion;
    const given = match[idx] || {};
    const totalPairs = mq.pairs.length;
    if (totalPairs === 0) return { earned: 0, max: 0 };
    let correctCount = 0;
    mq.pairs.forEach(p => { if (given[p.left] === p.right) correctCount++; });
    return { earned: correctCount, max: totalPairs };
  }
  if (t === "fill_in_blank") {
    const fq = q as FillInBlankQuestion;
    const given = fib[idx] || [];
    const totalBlanks = fq.blanks.length;
    if (totalBlanks === 0) return { earned: 0, max: 0 };
    let correctCount = 0;
    fq.blanks.forEach((b, i) => {
      if ((given[i] || "").trim().toLowerCase() === b.trim().toLowerCase()) correctCount++;
    });
    return { earned: correctCount, max: totalBlanks };
  }
  return { earned: 0, max: 0 };
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

function Activities() {
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [podcastsMap, setPodcastsMap]     = useState<Record<string, PodcastMedia>>({});
  const [heroData, setHeroData]           = useState<any>(MOCK_HERO);
  const [h5pContents, setH5pContents]     = useState<H5PContent[]>([]);

  const [selectedEx,  setSelectedEx]  = useState<Exercise | null>(null);
  const [selectedH5P, setSelectedH5P] = useState<H5PContent | null>(null);
  const [modalStage,  setModalStage]  = useState<"info" | "test" | "result">("info");
  const [loading, setLoading]         = useState(true);
  const [exerciseLoading, setExerciseLoading] = useState(false);

  // Navigation state - hierarchical flow
  const [currentView, setCurrentView] = useState<"main" | "difficulty" | "exercises">("main");
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");

  const [mcqPage,  setMcqPage]  = useState(1);
  const [h5pPage,  setH5pPage]  = useState(1);
  const [testPage, setTestPage] = useState(0);

  const [choiceAnswers, setChoiceAnswers] = useState<ChoiceMap>({});
  const [matchAnswers,  setMatchAnswers]  = useState<MatchMap>({});
  const [seqAnswers,    setSeqAnswers]    = useState<SeqMap>({});
  const [textAnswers,   setTextAnswers]   = useState<TextMap>({});
  const [fibAnswers,    setFibAnswers]    = useState<FibMap>({});
  
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const exercisesTopRef = useRef<HTMLDivElement>(null);
  const ITEMS_PP = 6;
  const Q_PP     = 3;
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const podMedia = selectedEx?.podcastId ? podcastsMap[String(selectedEx.podcastId)] : null;
  const getCardBackground = (url?: string | null) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${CLIENT_KEY}${url}`;
  };
  const [h5pIframeLoading, setH5pIframeLoading] = useState(true);

  useEffect(() => {
    if (selectedH5P) setH5pIframeLoading(true);
  }, [selectedH5P]);

  useEffect(() => {
    if (modalStage === "result" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioPlaying(false);
    }
  }, [modalStage]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [selectedEx]);

  useEffect(() => {
    document.body.style.overflow = selectedEx || selectedH5P ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedEx, selectedH5P]);
   
  useEffect(() => {
    (async () => {
      try {
        const [heroRes, exRes, h5pRes, podRes] = await Promise.all([
          fetch(`${CLIENT_KEY}/api/galleries`),
          fetch(`${CLIENT_KEY}/api/exercises`),
          fetch(`${CLIENT_KEY}/api/exercise-resources`),
          fetch(`${CLIENT_KEY}/api/podcasts`),
        ]);
        const [heroJson, exJson, h5pJson, podJson] = await Promise.all([
          heroRes.json(), exRes.json(), h5pRes.json(), podRes.json(),
        ]);
        console.log("CLIENT_KEY:", CLIENT_KEY);
        console.log("Exercises raw:", exJson);
        console.log("Exercises count:", (exJson.data || exJson).length);

        const pMap: Record<string, PodcastMedia> = {};
        (podJson.data || podJson).forEach((p: any) => {
          const a = p.attributes || p;
          const url = a.audioUrl || a.videoUrl || a.mediaUrl || a.url || "";
          pMap[String(p.id)] = { id: p.id, mediaUrl: url, mediaType: a.mediaType || (isVideoUrl(url) ? "video" : "audio") };
        });
        setPodcastsMap(pMap);

        const tempEx: Exercise[] = [];
        (exJson.data || exJson).forEach((item: any) => {
          const data = item.attributes || item;
          console.log("Exercise raw data:", data);
          const cs = typeof data.content === "string" ? data.content : JSON.stringify(data.content);
          let parsed: AnyQuestion[] = [];
          let isEmbed = false;

          if (!cs) return;

          if (isEmbedContent(cs)) {
            isEmbed = true;
            parsed = [];
          } else {
            try { parsed = JSON.parse(cs); } catch { parsed = []; }
            if (!Array.isArray(parsed)) parsed = [];
          }

          const normalised = parsed.map((q: any) => {
            const t = q.type || "mcq";
            if (t === "mcq" || t === "true_false") {
              const ca = Number(q.correctAnswer);
              const shift = !q.type && ca >= 1;
              return { ...q, correctAnswer: shift ? ca - 1 : ca };
            }
            return q;
          });

          // ── UPDATED: normalise audience to 3 categories
          const normalizeAudience = (s?: string) => {
            const v = (s || "").toLowerCase().trim();
            if (v.includes("child") || v.includes("kid"))   return "Children";
            if (v.includes("adolescent") || v.includes("teen") || v.includes("youth")) return "Adolescent";
            if (v.includes("adult"))                        return "Adult";
            // legacy fallback
            if (v.startsWith("student"))  return "Children";
            if (v.startsWith("teacher"))  return "Adult";
            return "Children";
          };

          // ── UPDATED: normalise difficulty to 4 CEFR levels
          const normalizeDifficulty = (s?: string) => {
            const v = (s || "").toLowerCase().trim();
            if (v.includes("a1") || v.includes("beginner"))           return "Beginner (A1)";
            if (v.includes("a2") || v.includes("elementary"))         return "Elementary (A2)";
            if (v.includes("b1") || (v.includes("intermediate") && !v.includes("upper"))) return "Intermediate (B1)";
            if (v.includes("b2") || v.includes("upper"))              return "Upper Intermediate (B2)";
            // legacy fallback
            if (v.startsWith("begin"))  return "Beginner (A1)";
            if (v.startsWith("inter"))  return "Intermediate (B1)";
            if (v.startsWith("adv"))    return "Upper Intermediate (B2)";
            return "Beginner (A1)";
          };

          tempEx.push({
            id: item.id,
            title: data.title || "",
            description: data.description || "",
            exerciseType: data.exerciseType || "mcq",
            difficulty: normalizeDifficulty(data.difficulty),
            audience: normalizeAudience(data.audience),
            mediaUrl: data.exerciseImage || data.mediaUrl,
            podcastId: data.podcast?.data?.id ?? data.podcast_id ?? data.podcastId ?? null,
            publishedAt: data.publishedAt,
            content: normalised,
            isEmbed,
          });
        });

        const tempH5P: H5PContent[] = [];
        const h5pData = h5pJson.data || h5pJson;

        h5pData.forEach((item: any) => {
          const data = item.attributes || item;
          const embedCode = data.embedCode || data.content || data.html || "";
          const embedUrl = extractIframeUrl(embedCode);
          if (!embedUrl) return;

          // ── UPDATED: normalise H5P audience to 3 categories
          const normalizeH5PAudience = (s?: string) => {
            const v = (s || "").toLowerCase().trim();
            if (v.includes("child") || v.includes("kid"))   return "Children";
            if (v.includes("adolescent") || v.includes("teen") || v.includes("youth")) return "Adolescent";
            if (v.includes("adult"))                        return "Adult";
            if (v.startsWith("student"))  return "Children";
            if (v.startsWith("teacher"))  return "Adult";
            return "Children";
          };

          tempH5P.push({
            id: item.id,
            title: data.title || "Interactive Exercise",
            description: data.description || "",
            embedUrl: embedUrl,
            difficulty: cap(data.difficulty || "Beginners"),
            audience: normalizeH5PAudience(data.audience || data.category),
            embedImage: data.embedImage || null,
          });
        });

        setExercisesList(tempEx);
        console.table(tempEx.map(e => ({ id: e.id, audience: e.audience, difficulty: e.difficulty })));
        setH5pContents(tempH5P);

        const ha = heroJson.data || heroJson;
        const hm = ha.find((i: any) => (i.attributes?.subPurpose || i.subPurpose) === "Activities");
        if (hm) setHeroData(hm.attributes || hm);
      } catch (err) {
        console.warn("API Error – using fallback UI", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [CLIENT_KEY]);

  useEffect(() => {
    if (currentView === "exercises" && exercisesTopRef.current) {
      setTimeout(() => {
        exercisesTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [currentView, selectedDifficulty]);

  const filteredEx = useMemo(() => {
    const matchesSearch = (ex: Exercise) =>
      ex.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery.trim().length > 0) return exercisesList.filter(matchesSearch);

    return exercisesList.filter(ex =>
      (selectedAudience  ? ex.audience  === selectedAudience  : true) &&
      (selectedDifficulty ? ex.difficulty === selectedDifficulty : true)
    );
  }, [exercisesList, searchQuery, selectedAudience, selectedDifficulty]);

  // H5P filtered by audience (shown in the difficulty view per category)
  const filteredH5P = useMemo(() =>
    h5pContents.filter(h =>
      h.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedAudience ? h.audience?.toLowerCase() === selectedAudience.toLowerCase() : true)
    ), [h5pContents, searchQuery, selectedAudience]);

  const currentEx  = filteredEx.slice((mcqPage - 1) * ITEMS_PP, mcqPage * ITEMS_PP);
  const currentH5P = filteredH5P.slice((h5pPage - 1) * ITEMS_PP, h5pPage * ITEMS_PP);
  const totalMcqPg = Math.ceil(filteredEx.length  / ITEMS_PP);
  const totalH5pPg = Math.ceil(filteredH5P.length / ITEMS_PP);

  const { totalScore, maxScore } = useMemo(() => {
    if (!selectedEx || modalStage !== "result") return { totalScore: 0, maxScore: 0 };
    let totalEarned = 0;
    let totalMax = 0;
    selectedEx.content.forEach((q, i) => {
      const result = calculateQuestionScore(q, i, choiceAnswers, matchAnswers, seqAnswers, textAnswers, fibAnswers);
      totalEarned += result.earned;
      totalMax += result.max;
    });
    return { totalScore: totalEarned, maxScore: totalMax };
  }, [selectedEx, modalStage, choiceAnswers, matchAnswers, seqAnswers, textAnswers, fibAnswers]);

  const resetModal = (ex: Exercise) => {
    setExerciseLoading(true);
    setSelectedEx(ex);
    setModalStage("info");
    setChoiceAnswers({});
    setMatchAnswers({});
    setSeqAnswers({});
    setTextAnswers({});
    setFibAnswers({});
    setTestPage(0);
    setTimeout(() => setExerciseLoading(false), 400);
  };

  // Navigation handlers
  const handleAudienceSelect = (audience: string) => {
    setSelectedAudience(audience);
    setCurrentView("difficulty");
    setSelectedDifficulty(null);
    setMcqPage(1);
    setH5pPage(1);
  };

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setCurrentView("exercises");
    setMcqPage(1);
  };

  const handleBackToMain = () => {
    setCurrentView("main");
    setSelectedAudience(null);
    setSelectedDifficulty(null);
    setSearchQuery("");
  };

  const handleBackToDifficulty = () => {
    setCurrentView("difficulty");
    setSelectedDifficulty(null);
  };

  const pageQs   = selectedEx ? selectedEx.content.slice(testPage * Q_PP, (testPage + 1) * Q_PP) : [];
  const totalPgs = selectedEx ? Math.ceil(selectedEx.content.length / Q_PP) : 1;
  const isLastPg = selectedEx ? (testPage + 1) * Q_PP >= selectedEx.content.length : false;
  console.log("podcastId:", selectedEx?.podcastId, "podMedia:", podMedia);
  console.log("selectedEx.podcastId:", selectedEx?.podcastId);
  console.log("podcastsMap keys:", Object.keys(podcastsMap));
  console.log("podMedia:", podMedia);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text- font-black uppercase tracking-widest text-slate-400">Syncing Workspace...</p>
    </div>
  );

  return (
    <main className="pt-20 bg-[#fcfaf8] min-h-screen w-full overflow-y-auto">

      {/* HERO */}
      <div className="relative w-full h-[90dvh] md:h-[90dvh] overflow-hidden bg-slate-900">
        <img src={heroData?.mediaUrl || MOCK_HERO.mediaUrl} className="absolute inset-0 w-full h-full object-cover z-0 opacity-70" alt="Hero" />
        <div className="absolute inset-0 z-10 bg-linear-to-br from-red-600/80 via-transparent to-blue-900/90" />
        <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-16 gap-5">
          <div className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
            <Book size={17} />
            <p className="text-sm font-medium uppercase tracking-widest">À toi le micro</p>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">{heroData?.title || MOCK_HERO.title}</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl leading-relaxed">{heroData?.description || MOCK_HERO.description}</p>
        </div>
      </div>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto" ref={exercisesTopRef}>

        {/* GLOBAL SEARCH BAR */}
        <div className="mb-16">
          <div className="bg-white p-8 rounded- shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Search all exercises and activities..."
                className="w-full pl-14 pr-6 py-5 rounded-4xl bg-gray-50 outline-none text-base font-medium"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Search results */}
        {searchQuery.trim().length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Search Results</h2>
              <p className="text-slate-400 font-bold uppercase text- tracking-[0.3em]">{filteredEx.length} found</p>
            </div>
            {filteredEx.length === 0 ? (
              <EmptyState icon={<Book size={32} className="text-gray-300" />} msg="No exercises match your search." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEx.map(ex => {
                  const dc = DIFF[ex.difficulty] || DIFF["Beginner (A1)"];
                  return (
                    <div key={ex.id} className="group bg-white rounded- p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                          {ex.podcastId ? <Volume2 size={28} /> : <ExTypeIcon type={ex.exerciseType} />}
                        </div>
                        <span className={`text- font-black uppercase px-3 py-1.5 rounded-xl border ${dc.bg} ${dc.text} ${dc.border}`}>{ex.exerciseType.replace(/_/g," ")}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">{ex.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-8 leading-relaxed font-medium">{ex.description}</p>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 mb-6">
                          <span className={`flex items-center gap-2 text- font-black uppercase tracking-widest ${dc.text}`}><span className={`w-2 h-2 rounded-full ${dc.dot}`} />{ex.difficulty}</span>
                          <span className="flex items-center gap-2 text- font-black text-gray-400 uppercase tracking-widest"><Layers size={14} />{ex.audience}</span>
                        </div>
                        <button onClick={() => resetModal(ex)} className="w-full py-5 bg-slate-900 text-white rounded-2xl text- font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
                          {ex.podcastId ? "Listen & Solve" : "Begin Exercise"} <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            VIEW 1: MAIN — Children, Adolescent, Adult Selection
        ════════════════════════════════════════════════════════ */}
        {currentView === "main" && (
          <div className="space-y-20">
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Select Exercise</h2>
                <p className="text-slate-400 font-bold uppercase text- tracking-[0.3em]">Select your category to begin</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">

                {/* Children Card */}
                <button
                  onClick={() => handleAudienceSelect("Children")}
                  className="group relative h-80 rounded- overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${AUDIENCE_BACKGROUNDS["Children"]})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
                      <GraduationCap size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">Children</h3>
                    <p className="text-white/80 font-medium mb-4">Fun exercises designed for young learners</p>
                    <div className="flex items-center gap-2 text-white text- font-black uppercase tracking-widest">
                      Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Adolescent Card */}
                <button
                  onClick={() => handleAudienceSelect("Adolescent")}
                  className="group relative h-80 rounded- overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${AUDIENCE_BACKGROUNDS["Adolescent"]})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
                      <Users size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">Adolescent</h3>
                    <p className="text-white/80 font-medium mb-4">Exercises tailored for teens & youth</p>
                    <div className="flex items-center gap-2 text-white text- font-black uppercase tracking-widest">
                      Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Adult Card */}
                <button
                  onClick={() => handleAudienceSelect("Adult")}
                  className="group relative h-80 rounded- overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${AUDIENCE_BACKGROUNDS["Adult"]})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
                      <GraduationCap size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">Adult</h3>
                    <p className="text-white/80 font-medium mb-4">Advanced exercises for adult learners</p>
                    <div className="flex items-center gap-2 text-white text- font-black uppercase tracking-widest">
                      Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            VIEW 2: DIFFICULTY SELECTION (4 levels) + H5P per audience
        ════════════════════════════════════════════════════════ */}
        {currentView === "difficulty" && selectedAudience && (
          <div className="space-y-16">
            {/* Back Button */}
            <button
              onClick={handleBackToMain}
              className="flex items-center gap-3 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-widest transition-colors group"
            >
              <div className="p-3 rounded-2xl bg-gray-100 group-hover:bg-gray-200 transition-colors">
                <ArrowLeft size={20} />
              </div>
              <span>Back to Categories</span>
            </button>

            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{selectedAudience}</h2>
              <p className="text-slate-400 font-bold uppercase text- tracking-[0.3em]">Select difficulty level</p>
            </div>

            {/* 4 difficulty thumbnails */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {DIFFICULTIES.map((difficulty) => {
                const bgImage   = DIFFICULTY_BACKGROUNDS[difficulty];
                const gradient  = DIFFICULTY_GRADIENTS[difficulty];
                const dc        = DIFF[difficulty];

                return (
                  <button
                    key={difficulty}
                    onClick={() => handleDifficultySelect(difficulty)}
                    className="group relative h-72 rounded- overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradient} to-transparent opacity-85 group-hover:opacity-95 transition-all duration-300`} />

                    <div className="relative z-10 h-full flex flex-col justify-end p-7">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-white/30 transition-all">
                        <Book size={22} className="text-white" />
                      </div>
                      {/* CEFR badge */}
                      <span className={`self-start text-xs font-black uppercase px-2.5 py-1 rounded-lg mb-2 ${dc.bg} ${dc.text} ${dc.border} border`}>
                        {difficulty.match(/\((.*?)\)/)?.[1]}
                      </span>
                      <h3 className="text-xl font-black text-white mb-1 leading-tight">
                        {difficulty.replace(/\s*\(.*?\)/, "")}
                      </h3>
                      <p className="text-white/70 text-xs font-medium mb-3">
                        {difficulty === "Beginner (A1)"           && "Start from the very basics"}
                        {difficulty === "Elementary (A2)"         && "Build everyday vocabulary & phrases"}
                        {difficulty === "Intermediate (B1)"       && "Express yourself with confidence"}
                        {difficulty === "Upper Intermediate (B2)" && "Master complex language skills"}
                      </p>
                      <div className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest">
                        Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── VIDEO BASED INTERACTIVE EXERCISES (H5P) — scoped to this audience ── */}
            <div className="pt-8 border-t border-gray-100">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Video Based Interactive Exercises</h2>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">
                  Interactive modules · {selectedAudience}
                </p>
              </div>

              {filteredH5P.length === 0 ? (
                <EmptyState icon={<PlayCircle size={32} className="text-gray-300" />} msg="No interactive modules available for this category." />
              ) : (
                <>
                  {totalH5pPg > 1 && (
                    <div className="flex justify-end gap-3 mb-6">
                      <button aria-label="Prev" disabled={h5pPage === 1} onClick={() => setH5pPage(p => p - 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-20 hover:bg-gray-50"><ChevronLeft size={24} /></button>
                      <button aria-label="Next" disabled={h5pPage === totalH5pPg} onClick={() => setH5pPage(p => p + 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-20 hover:bg-gray-50"><ChevronRight size={24} /></button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentH5P.map(h5p => {
                      const dc = DIFF[h5p.difficulty] || DIFF["Beginner (A1)"];
                      const bgImage = getCardBackground(h5p.embedImage);

                      return (
                        <div
                          key={h5p.id}
                          className="group relative bg-white rounded- border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer overflow-hidden flex flex-col"
                          onClick={() => setSelectedH5P(h5p)}
                        >
                          {bgImage ? (
                            <>
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${bgImage})` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20 group-hover:from-black/90 transition-all duration-300" />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100" />
                          )}

                          <div className="relative z-10 p-8 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-all ${
                                bgImage
                                  ? 'bg-white/20 backdrop-blur-md text-white group-hover:bg-white/30'
                                  : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
                              }`}>
                                <PlayCircle size={28} />
                              </div>
                              <span className={`text- font-black uppercase px-3 py-1.5 rounded-xl border ${
                                bgImage
                                  ? 'bg-white/20 backdrop-blur-md text-white border-white/30'
                                  : `${dc.bg} ${dc.text} ${dc.border}`
                              }`}>Interactive</span>
                            </div>

                            <h3 className={`text-xl font-black mb-3 transition-colors tracking-tight ${
                              bgImage ? 'text-white group-hover:text-purple-200' : 'text-slate-800 group-hover:text-purple-600'
                            }`}>{h5p.title}</h3>

                            <p className={`text-sm line-clamp-2 mb-6 leading-relaxed font-medium ${
                              bgImage ? 'text-white/80' : 'text-gray-500'
                            }`}>{h5p.description}</p>

                            <div className={`mt-auto flex items-center gap-3 text- font-black uppercase tracking-widest pt-6 border-t ${
                              bgImage ? 'border-white/20' : 'border-gray-50'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${bgImage ? 'bg-white' : dc.dot}`} />
                              <span className={bgImage ? 'text-white' : dc.text}>{h5p.difficulty}</span>
                              <span className={bgImage ? 'text-white/50' : 'text-gray-300'}>·</span>
                              <span className={bgImage ? 'text-white/70' : 'text-gray-400'}>{h5p.audience}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {searchQuery.trim().length > 0 && currentView === "exercises" && (
          <div className="mb-6 px-6 py-3 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <p className="text- font-black uppercase tracking-widest text-blue-700">
              Searching all exercises · {filteredEx.length} result{filteredEx.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            VIEW 3: EXERCISES LIST
        ════════════════════════════════════════════════════════ */}
        {currentView === "exercises" && selectedAudience && selectedDifficulty && (
          <div className="space-y-12">
            {/* Back Button & Breadcrumb */}
            <div className="flex flex-col gap-6">
              <button
                onClick={handleBackToDifficulty}
                className="flex items-center gap-3 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-widest transition-colors group w-fit"
              >
                <div className="p-3 rounded-2xl bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <ArrowLeft size={20} />
                </div>
                <span>Back to Difficulty</span>
              </button>

              <div className="flex items-center gap-4 text- font-black uppercase tracking-widest">
                <span className="text-slate-400">{selectedAudience}</span>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-slate-400">{selectedDifficulty}</span>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-blue-600">Exercises</span>
              </div>
            </div>

            {/* Language Exercises Section */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Language Exercises</h2>
                  <p className="text-slate-400 font-bold uppercase text- tracking-[0.3em]">Skill Evaluation</p>
                </div>
                {totalMcqPg > 1 && (
                  <div className="flex gap-3">
                    <button aria-label="Prev" disabled={mcqPage === 1} onClick={() => setMcqPage(p => p - 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-20 hover:bg-gray-50"><ChevronLeft size={24} /></button>
                    <button aria-label="Next" disabled={mcqPage === totalMcqPg} onClick={() => setMcqPage(p => p + 1)} className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-20 hover:bg-gray-50"><ChevronRight size={24} /></button>
                  </div>
                )}
              </div>

              {currentEx.length === 0 ? (
                <EmptyState icon={<Book size={32} className="text-gray-300" />} msg="No exercises found for this criteria." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentEx.map(ex => {
                    const dc = DIFF[ex.difficulty] || DIFF["Beginner (A1)"];
                    const bgImage = getCardBackground(ex.mediaUrl);

                    return (
                      <div
                        key={ex.id}
                        className="group relative bg-white rounded- border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden flex flex-col"
                      >
                        {bgImage ? (
                          <>
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                              style={{ backgroundImage: `url(${bgImage})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20 group-hover:from-black/90 transition-all duration-300" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
                        )}

                        <div className="relative z-10 p-8 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-all ${
                              bgImage
                                ? 'bg-white/20 backdrop-blur-md text-white group-hover:bg-white/30'
                                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                            }`}>
                              {ex.podcastId ? <Volume2 size={28} /> : <ExTypeIcon type={ex.exerciseType} />}
                            </div>
                            <span className={`text- font-black uppercase px-3 py-1.5 rounded-xl border ${
                              bgImage
                                ? 'bg-white/20 backdrop-blur-md text-white border-white/30'
                                : `${dc.bg} ${dc.text} ${dc.border}`
                            }`}>{ex.exerciseType.replace(/_/g," ")}</span>
                          </div>

                          <h3 className={`text-xl font-black mb-3 transition-colors tracking-tight ${
                            bgImage ? 'text-white group-hover:text-blue-200' : 'text-slate-800 group-hover:text-blue-600'
                          }`}>{ex.title}</h3>

                          <p className={`text-sm line-clamp-3 mb-8 leading-relaxed font-medium ${
                            bgImage ? 'text-white/80' : 'text-gray-500'
                          }`}>{ex.description}</p>

                          <div className="mt-auto">
                            <div className={`flex items-center justify-between pt-6 border-t mb-6 ${
                              bgImage ? 'border-white/20' : 'border-gray-50'
                            }`}>
                              <span className={`flex items-center gap-2 text- font-black uppercase tracking-widest ${
                                bgImage ? 'text-white' : dc.text
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${bgImage ? 'bg-white' : dc.dot}`} />
                                {ex.difficulty}
                              </span>
                              <span className={`flex items-center gap-2 text- font-black uppercase tracking-widest ${
                                bgImage ? 'text-white/70' : 'text-gray-400'
                              }`}>
                                <Layers size={14} />{ex.audience}
                              </span>
                            </div>

                            <button
                              onClick={() => resetModal(ex)}
                              className={`w-full py-5 rounded-2xl text- font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 ${
                                bgImage
                                  ? 'bg-white text-slate-900 hover:bg-blue-100 hover:shadow-xl'
                                  : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200'
                              }`}
                            >
                              {ex.podcastId ? "Listen & Solve" : "Begin Exercise"} <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </section>

      {/* ══════════════════════════════════════
          EXERCISE MODAL
      ══════════════════════════════════════ */}
      {selectedEx && (
        <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-xl flex justify-center items-center p-4 mt-5">
          <div className="relative bg-white w-full max-w-4xl rounded- shadow-2xl flex flex-col max-h- overflow-hidden">
            {exerciseLoading && (
              <div className="absolute inset-0 z-[60] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text- font-black uppercase tracking-widest text-slate-400">Loading Exercise...</p>
              </div>
            )}
            <button aria-label="Close" onClick={() => setSelectedEx(null)} className="absolute top-10 right-10 z-50 p-5 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><X size={22} /></button>

            <div ref={modalScrollRef} className="overflow-y-auto p-10 md:p-14 custom-scrollbar">

              {/* ── INFO ── */}
              {modalStage === "info" && (
                <div className="text-center py-10">
                  <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    {podMedia ? (isVideoUrl(podMedia.mediaUrl) ? <Video size={52} /> : <Volume2 size={52} />) : <ExTypeIcon type={selectedEx.exerciseType} />}
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{selectedEx.title}</h2>
                  <p className="text-slate-500 text-lg max-w-xl mx-auto mb-6 leading-relaxed font-medium">{selectedEx.description}</p>
                  <div className="flex items-center justify-center gap-6 mb-14 text- font-black uppercase tracking-widest text-gray-400">
                    <span>{selectedEx.content.length} question{selectedEx.content.length !== 1 ? "s" : ""}</span>
                    <span>·</span><span>{selectedEx.difficulty}</span>
                    <span>·</span><span>{selectedEx.exerciseType.replace(/_/g," ")}</span>
                  </div>
                  <button onClick={() => setModalStage("test")} className="px-14 py-6 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text- shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all">
                    Launch Exercise
                  </button>
                </div>
              )}

              {/* ── TEST ── */}
              {modalStage === "test" && (
                <div className="space-y-8">
                  {/* Progress */}
                  <div className="flex items-center gap-4">
                    <span className="text- font-black uppercase tracking-widest text-gray-400 shrink-0">Page {testPage + 1} / {totalPgs}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${((testPage + 1) / totalPgs) * 100}%` }} />
                    </div>
                    <span className="text- font-black uppercase tracking-widest text-gray-400 shrink-0">{selectedEx.content.length} Q</span>
                  </div>

                  {/* Audio / Video Player */}
                  {podMedia && !isVideoUrl(podMedia.mediaUrl) && (
                    <div className="bg-linear-to-br from-blue-700 to-indigo-800 p-10 rounded- text-white shadow-2xl shadow-blue-200 sticky top-0 z-10">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="p-3 bg-white/20 rounded-2xl">
                          <Volume2 className={audioPlaying ? "animate-pulse" : ""} size={24} />
                        </div>
                        <span className="font-black text- uppercase tracking-[0.35em] opacity-90">
                          Audio Context - Continues playing
                        </span>
                      </div>
                      <audio
                        ref={audioRef}
                        controls
                        preload="metadata"
                        className="w-full h-14 accent-white bg-white/10 rounded-2xl p-2"
                        onPlay={() => setAudioPlaying(true)}
                        onPause={() => setAudioPlaying(false)}
                        src={podMedia.mediaUrl}
                      />
                    </div>
                  )}

                  {/* Questions */}
                  {pageQs.map((q, li) => {
                    const gi = testPage * Q_PP + li;
                    const qt = getQType(q);
                    return (
                      <div key={gi} className="p-8 md:p-10 rounded- bg-gray-50 border border-gray-100">
                        <h4 className="font-black text-lg text-slate-900 mb-7 flex gap-4 items-start">
                          <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 shadow-md">{gi + 1}</span>
                          <span className="pt-0.5">{q.question}</span>
                        </h4>

                        {/* MCQ */}
                        {(qt === "mcq" || !q.type) && (
                          <div className="grid gap-3">
                            {(q as MCQQuestion).options.map((opt, i) => (
                              <button key={i} onClick={() => setChoiceAnswers(p => ({ ...p, [gi]: i }))}
                                className={`p-5 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center gap-4 ${choiceAnswers[gi] === i ? "bg-white border-blue-600 text-blue-700 shadow-lg" : "bg-white border-transparent hover:border-gray-200"}`}>
                                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text- font-black shrink-0 ${choiceAnswers[gi] === i ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 text-gray-400"}`}>{String.fromCharCode(65+i)}</span>
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* True / False */}
                        {qt === "true_false" && (
                          <div className="flex gap-4">
                            {(q as TrueFalseQuestion).options.map((opt, i) => (
                              <button key={i} onClick={() => setChoiceAnswers(p => ({ ...p, [gi]: i }))}
                                className={`flex-1 py-5 rounded-2xl border-2 font-black text-sm transition-all ${choiceAnswers[gi] === i ? (i === 0 ? "bg-emerald-600 border-emerald-600 text-white shadow-lg" : "bg-rose-600 border-rose-600 text-white shadow-lg") : "bg-white border-gray-200 hover:border-gray-300 text-slate-700"}`}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Matching */}
                        {qt === "matching" && (
                          <div className="grid gap-3">
                            {(q as MatchingQuestion).pairs.map((pair, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="flex-1 p-4 bg-white rounded-xl font-bold text-sm text-slate-700 border border-gray-100">{pair.left}</span>
                                <ArrowRight size={14} className="text-gray-300 shrink-0" />
                                <select aria-label="something" className="flex-1 p-4 bg-white rounded-xl font-bold text-sm text-slate-700 border border-gray-200 outline-none focus:border-blue-400"
                                  value={matchAnswers[gi]?.[pair.left] || ""}
                                  onChange={e => setMatchAnswers(p => ({ ...p, [gi]: { ...(p[gi]||{}), [pair.left]: e.target.value } }))}>
                                  <option value="">Select…</option>
                                  {(q as MatchingQuestion).pairs.map((p2, j) => <option key={j} value={p2.right}>{p2.right}</option>)}
                                </select>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Sequencing / Ordering */}
                        {(qt === "sequencing" || qt === "ordering") && (() => {
                          const sq = q as SequencingQuestion;
                          const cur = seqAnswers[gi] || [...(sq.sequence || sq.items || sq.correctAnswer)];
                          const move = (from: number, to: number) => {
                            const arr = [...cur]; const [item] = arr.splice(from, 1); arr.splice(to, 0, item);
                            setSeqAnswers(p => ({ ...p, [gi]: arr }));
                          };
                          return (
                            <div className="grid gap-2">
                              <p className="text- font-black text-gray-400 uppercase tracking-widest mb-1">Use arrows to reorder</p>
                              {cur.map((item, i) => (
                                <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between font-bold text-sm text-slate-700">
                                  <span className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">{i+1}</span>{item}
                                  </span>
                                  <div className="flex gap-1">
                                    <button aria-label="Up"   disabled={i === 0}           onClick={() => move(i, i-1)} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-20"><ChevronLeft  size={14} /></button>
                                    <button aria-label="Down" disabled={i === cur.length-1} onClick={() => move(i, i+1)} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-20"><ChevronRight size={14} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Gap Filling */}
                        {qt === "gap_filling" && (
                          <input type="text" placeholder="Type your answer…" className="w-full p-5 rounded-2xl bg-white border-2 border-gray-100 font-bold text-sm text-slate-700 outline-none focus:border-blue-400 transition-colors"
                            value={textAnswers[gi] || ""} onChange={e => setTextAnswers(p => ({ ...p, [gi]: e.target.value }))} />
                        )}

                        {/* Fill in Blank */}
                        {qt === "fill_in_blank" && (
                          <div className="grid gap-3">
                            {(q as FillInBlankQuestion).blanks.map((_, bi) => (
                              <div key={bi}>
                                <label className="text- font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Blank {bi+1}</label>
                                <input type="text" placeholder={`Answer for blank ${bi+1}…`} className="w-full p-5 rounded-2xl bg-white border-2 border-gray-100 font-bold text-sm text-slate-700 outline-none focus:border-blue-400"
                                  value={(fibAnswers[gi]||[])[bi] || ""}
                                  onChange={e => { const arr = [...(fibAnswers[gi]||[])]; arr[bi] = e.target.value; setFibAnswers(p => ({ ...p, [gi]: arr })); }} />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Short Answer */}
                        {qt === "short_answer" && (
                          <input type="text" placeholder="Your answer…" className="w-full p-5 rounded-2xl bg-white border-2 border-gray-100 font-bold text-sm text-slate-700 outline-none focus:border-blue-400 transition-colors"
                            value={textAnswers[gi] || ""} onChange={e => setTextAnswers(p => ({ ...p, [gi]: e.target.value }))} />
                        )}

                        {/* Essay */}
                        {qt === "essay" && (
                          <div>
                            <textarea rows={5} placeholder="Write your response here…" className="w-full p-5 rounded-2xl bg-white border-2 border-gray-100 font-medium text-sm text-slate-700 outline-none focus:border-blue-400 resize-none leading-relaxed"
                              value={textAnswers[gi] || ""} onChange={e => setTextAnswers(p => ({ ...p, [gi]: e.target.value }))} />
                            <p className="text- font-black text-amber-500 uppercase tracking-widest mt-2">Essay – not auto-graded</p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Nav */}
                  <div className="flex gap-4 pt-4">
                    {testPage > 0 && (
                      <button onClick={() => { setTestPage(p => p-1); modalScrollRef.current?.scrollTo(0,0); }} className="flex-1 py-5 bg-gray-100 rounded-2xl font-black uppercase text- tracking-widest hover:bg-gray-200 transition-all">← Back</button>
                    )}
                    {!isLastPg ? (
                      <button onClick={() => { setTestPage(p => p+1); modalScrollRef.current?.scrollTo(0,0); }} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text- tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Next →</button>
                    ) : (
                      <button onClick={() => setModalStage("result")} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text- tracking-widest shadow-xl hover:bg-black transition-all">Submit Answers</button>
                    )}
                  </div>
                </div>
              )}

              {/* ── RESULT ── */}
              {modalStage === "result" && (
                <div className="space-y-10 py-4">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-yellow-400 text-white rounded- flex items-center justify-center mx-auto shadow-2xl shadow-yellow-200 mb-6">
                      <Trophy size={68} />
                    </div>
                    <h3 className="text-6xl font-black text-slate-900 mb-2">
                      {maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0}%
                    </h3>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-">
                      {totalScore} / {maxScore} points
                      {selectedEx.content.some(q => getQType(q) === "essay") && " · Essays excluded"}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <h4 className="text- font-black text-slate-800 uppercase tracking-[0.25em] mb-4">Answer Review</h4>
                    {selectedEx.content.map((q, idx) => {
                      const qt = getQType(q);
                      const isEssay = qt === "essay";
                      const scoreResult = calculateQuestionScore(q, idx, choiceAnswers, matchAnswers, seqAnswers, textAnswers, fibAnswers);
                      const ok = isEssay ? null : scoreResult.earned === scoreResult.max && scoreResult.max > 0;
                      const partial = !isEssay && scoreResult.earned > 0 && scoreResult.earned < scoreResult.max;

                      return (
                        <div key={idx} className={`p-7 rounded-[2.5rem] border-2 ${isEssay ? "border-amber-200 bg-amber-50" : ok ? "border-emerald-200 bg-emerald-50" : partial ? "border-amber-200 bg-amber-50" : "border-rose-200 bg-rose-50"}`}>
                          <div className="flex items-start gap-4 mb-5">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isEssay ? "bg-amber-200 text-amber-700" : ok ? "bg-emerald-200 text-emerald-700" : partial ? "bg-amber-200 text-amber-700" : "bg-rose-200 text-rose-700"}`}>{idx+1}</span>
                            <p className="font-bold text-slate-800 text-sm leading-relaxed flex-1">{q.question}</p>
                            {!isEssay && (
                              <div className="text-right">
                                <span className={`text-xs font-black ${ok ? "text-emerald-600" : partial ? "text-amber-600" : "text-rose-600"}`}>
                                  {scoreResult.earned}/{scoreResult.max}
                                </span>
                                {ok ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0 ml-2 inline" /> : partial ? <span className="text-amber-500 ml-2">~</span> : <XCircle size={20} className="text-rose-500 shrink-0 ml-2 inline" />}
                              </div>
                            )}
                          </div>

                          {(qt === "mcq" || !q.type || qt === "true_false") && (() => {
                            const mq = q as MCQQuestion;
                            return (
                              <div className="grid gap-2">
                                {mq.options.map((opt, i) => {
                                  const isCorrect = i === mq.correctAnswer;
                                  const isUser    = i === choiceAnswers[idx];
                                  return (
                                    <div key={i} className={`p-3.5 rounded-xl flex items-center gap-3 text-sm font-bold ${isCorrect ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : isUser && !isCorrect ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-white/60 text-slate-400 border border-transparent"}`}>
                                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text- font-black shrink-0 ${isCorrect ? "bg-emerald-500 text-white" : isUser ? "bg-rose-500 text-white" : "bg-gray-200 text-gray-500"}`}>{String.fromCharCode(65+i)}</span>
                                      <span className="flex-1">{opt}</span>
                                      {isCorrect && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                                      {isUser && !isCorrect && <XCircle size={14} className="text-rose-500 shrink-0" />}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          {(qt === "gap_filling" || qt === "short_answer") && (() => {
                            const correctAns = qt === "gap_filling" ? (q as GapFillingQuestion).correctAnswer : (q as ShortAnswerQuestion).correctAnswer;
                            const userAns = textAnswers[idx] || "(no answer)";
                            return (
                              <div className="grid gap-2 text-sm">
                                <div className={`p-4 rounded-xl flex items-center gap-3 font-bold border ${ok ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-rose-100 border-rose-200 text-rose-700"}`}>
                                  <span className="text- uppercase tracking-widest font-black shrink-0 w-16">Yours</span>
                                  <span>{userAns}</span>
                                  {ok ? <CheckCircle2 size={14} className="ml-auto" /> : <XCircle size={14} className="ml-auto" />}
                                </div>
                                {!ok && (
                                  <div className="p-4 rounded-xl flex items-center gap-3 font-bold bg-emerald-100 border border-emerald-200 text-emerald-700">
                                    <span className="text- uppercase tracking-widest font-black shrink-0 w-16">Correct</span>
                                    <span>{correctAns}</span>
                                    <CheckCircle2 size={14} className="ml-auto" />
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {(qt === "sequencing" || qt === "ordering") && (() => {
                            const sq = q as SequencingQuestion;
                            const given = seqAnswers[idx] || [...(sq.sequence || sq.correctAnswer)];
                            return (
                              <div className="grid gap-2 text-sm">
                                {sq.correctAnswer.map((step, i) => {
                                  const match = given[i] === step;
                                  return (
                                    <div key={i} className={`p-3.5 rounded-xl flex items-center gap-3 font-bold border ${match ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-rose-100 border-rose-200 text-rose-700"}`}>
                                      <span className="w-6 h-6 rounded-lg bg-white/60 flex items-center justify-center text-xs font-black">{i+1}</span>
                                      <span className="flex-1">
                                        {!match && <span className="line-through opacity-50 mr-2">{given[i]}</span>}
                                        {step}
                                      </span>
                                      {match ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          {qt === "matching" && (() => {
                            const mq = q as MatchingQuestion;
                            const given = matchAnswers[idx] || {};
                            return (
                              <div className="grid gap-2 text-sm">
                                {mq.pairs.map((pair, i) => {
                                  const right = given[pair.left] === pair.right;
                                  return (
                                    <div key={i} className={`p-3.5 rounded-xl flex items-center gap-3 font-bold border ${right ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-rose-100 border-rose-200 text-rose-700"}`}>
                                      <span>{pair.left}</span>
                                      <ArrowRight size={12} className="shrink-0" />
                                      <span className="flex-1">{given[pair.left] || "(no answer)"}</span>
                                      {!right && <span className="text-emerald-700 text- font-black ml-auto">✓ {pair.right}</span>}
                                      {right ? <CheckCircle2 size={14} className="ml-2" /> : <XCircle size={14} />}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          {qt === "fill_in_blank" && (() => {
                            const fq = q as FillInBlankQuestion;
                            const given = fibAnswers[idx] || [];
                            return (
                              <div className="grid gap-2 text-sm">
                                {fq.blanks.map((blank, bi) => {
                                  const right = (given[bi]||"").trim().toLowerCase() === blank.trim().toLowerCase();
                                  return (
                                    <div key={bi} className={`p-3.5 rounded-xl flex items-center gap-3 font-bold border ${right ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-rose-100 border-rose-200 text-rose-700"}`}>
                                      <span className="text- uppercase tracking-widest font-black shrink-0 w-14">Blank {bi+1}</span>
                                      <span className="flex-1">{given[bi] || "(no answer)"}</span>
                                      {!right && <span className="text-emerald-700 text- font-black ml-auto">✓ {blank}</span>}
                                      {right ? <CheckCircle2 size={14} className="ml-2" /> : <XCircle size={14} />}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          {qt === "essay" && (q as EssayQuestion).sampleAnswer && (
                            <div className="p-4 rounded-xl bg-amber-100 border border-amber-200 text-sm text-amber-800 font-medium leading-relaxed">
                              <span className="font-black text- uppercase tracking-widest block mb-1.5">Sample Answer</span>
                              {(q as EssayQuestion).sampleAnswer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={() => setSelectedEx(null)} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text- shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all">
                    Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          H5P MODAL
      ══════════════════════════════════════ */}
      {selectedH5P && (
        <div className="fixed inset-0 z-[999] bg-slate-900/95 backdrop-blur-2xl flex justify-center items-center p-4 mt-5">
          <div className="relative bg-white w-full max-w-6xl h- rounded- shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-10 border-b border-gray-50 shrink-0">
              <div>
                <h3 className="font-black text-2xl text-slate-900 tracking-tight">{selectedH5P.title}</h3>
                <p className="text- font-black text-purple-600 uppercase tracking-[0.3em] mt-1">Interactive Module</p>
              </div>
              <button
                aria-label="Close"
                onClick={() => {
                  setSelectedH5P(null);
                  setH5pIframeLoading(true);
                }}
                className="p-5 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 bg-gray-100 relative min-h-0">
              {h5pIframeLoading && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
                  <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
                  <p className="text- font-black uppercase tracking-[0.3em] text-slate-400">
                    Loading Interactive Content...
                  </p>
                </div>
              )}
              <iframe
                src={selectedH5P.embedUrl}
                title={selectedH5P.title}
                className="w-full h-full border-none bg-white"
                allowFullScreen
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => setH5pIframeLoading(false)}
                onError={() => setH5pIframeLoading(false)}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 4px solid transparent; }
      `}</style>
    </main>
  );
}

export default Activities;