import { Headphones, Search, X, Play, ChevronLeft, ChevronRight, ArrowLeft, Calendar, User, Layers, Download, Check, Loader2, Pause } from "lucide-react";
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import img1 from "../assets/img/_A1A4787.jpg"

interface Podcast {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  description: string;
  mediaType: 'audio' | 'video';
  audioUrl: string;
  videoUrl: string;
  duration: number;
  transcript: string;
  topic: string;
  cefrLevel: string;
  audience: string;
  state: string;
  status?: string;
  updatedAt: string;
  downloadable?: boolean;
  publishedAt?: string;
  createdAt?: string;
  audioPodcastImage?: string | null;
}

interface GalleryHero {
  title: string;
  description: string;
  mediaUrl: string;
}

interface StrapiAttributes extends Partial<Podcast>, Partial<GalleryHero> {
  purpose?: string;
  subPurpose?: string;
}

interface StrapiDataItem {
  id: number;
  attributes?: StrapiAttributes;
  purpose?: string;
  subPurpose?: string;
  title?: string;
  description?: string;
  mediaUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  audioPodcastImage?: string | null;
}

interface StrapiResponse {
  data: StrapiDataItem[];
}

const DEFAULT_HERO: GalleryHero = {
  title: "À toi le micro",
  description: "Explore our collection of educational podcasts and videos designed for French language learners and teachers across Nigeria.",
  mediaUrl: img1
};

// ── Supported direct audio file extensions ────────────────────────────────────
const DIRECT_AUDIO_EXTENSIONS = [
  '.mp3', '.aac', '.ogg', '.opus', '.wma', '.m4a', '.wav', '.flac',
  '.alac', '.aiff', '.ape', '.mka', '.tta', '.wv', '.mid', '.midi',
  '.mp4', '.webm', '.3gp'
];

function isCloudinaryUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('res.cloudinary.com') || lower.includes('cloudinary.com');
}

function isDirectAudioFile(url: string): boolean {
  if (!url || url.trim() === '') return false;
  const trimmed = url.trim();
  if (isCloudinaryUrl(trimmed)) return true;
  const lower = trimmed.toLowerCase();
  const cleanUrl = lower.split('?')[0];
  return DIRECT_AUDIO_EXTENSIONS.some(ext => cleanUrl.endsWith(ext));
}

// ── Inline audio player card ──────────────────────────────────────────────────
function AudioCard({ item, onOpen }: { item: Podcast; onOpen: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [embedActivated, setEmbedActivated] = useState(false);

  const hasValidAudio = item.audioUrl && item.audioUrl.trim() !== '' && item.audioUrl !== 'null' && item.audioUrl !== 'undefined';
  const directAudio = hasValidAudio ? isDirectAudioFile(item.audioUrl) : false;
  const thumbnailUrl = item.audioPodcastImage || null;

  const toggle = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current || !hasValidAudio) return;

    setError(null);

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setIsLoading(true);
      try {
        const audio = audioRef.current;
        if (audio.readyState < 2) {
          await new Promise<void>((resolve, reject) => {
            const onCanPlay = () => {
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
              resolve();
            };
            const onError = () => {
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
              reject(new Error('Audio load failed'));
            };
            audio.addEventListener('canplaythrough', onCanPlay);
            audio.addEventListener('error', onError);
            audio.load();
          });
        }
        await audio.play();
        setPlaying(true);
      } catch (err) {
        console.error("Audio play error:", err);
        setError("Playback failed");
        setPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [playing, hasValidAudio]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => setPlaying(false);
    const onError = () => {
      setPlaying(false);
      setIsLoading(false);
      setError("Load error");
    };
    el.addEventListener('ended', onEnded);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('error', onError);
    };
  }, []);

  if (!hasValidAudio) {
    return (
      <div className="relative aspect-video bg-slate-900 flex flex-col items-center justify-center gap-4">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="flex items-end gap-[3px] h-10 opacity-30">
            {[4,7,5,9,6,8,4,10,6,7,5,9,4,8,6].map((h, i) => (
              <div key={i} className="w-1 rounded-sm bg-white" style={{ height: `${h * 3}px` }} />
            ))}
          </div>
        )}
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest relative z-10">No Audio</p>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="absolute bottom-3 right-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors z-10"
        >
          View Details →
        </button>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-slate-900 flex flex-col items-center justify-center gap-4 overflow-hidden">
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}

      {directAudio ? (
        <>
          <audio ref={audioRef} src={item.audioUrl} preload="metadata" />
          <div className={`flex items-end gap-[3px] h-10 transition-opacity relative z-10 ${playing ? 'opacity-100' : 'opacity-30'}`}>
            {[4,7,5,9,6,8,4,10,6,7,5,9,4,8,6].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-sm bg-white transition-all duration-300 ${playing ? 'animate-pulse' : ''}`}
                style={{ height: `${h * 3}px`, animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
          {error && (
            <p className="text-red-400 text-[10px] font-bold relative z-10">{error}</p>
          )}
          <button
            aria-label={playing ? 'Pause audio' : 'Play audio'}
            onClick={toggle}
            disabled={isLoading}
            className="text-white hover:scale-110 transition-transform focus:outline-none disabled:opacity-50 relative z-10"
          >
            {isLoading ? (
              <Loader2 size={56} className="animate-spin text-blue-400" />
            ) : playing ? (
              <Pause size={56} color="white" />
            ) : (
              <Play size={56} color="white" />
            )}
          </button>
        </>
      ) : (
        <>
          {!embedActivated ? (
            <button
              type="button"
              aria-label="Load audio player"
              onClick={(e) => { e.stopPropagation(); setEmbedActivated(true); }}
              className="flex flex-col items-center gap-3 text-white relative z-10 hover:scale-110 transition-transform focus:outline-none"
            >
              <Play size={56} color="white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Tap to load player</span>
            </button>
          ) : (
            <iframe
              src={item.audioUrl}
              title={item.title}
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
        </>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
        className="absolute bottom-3 right-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors z-10"
      >
        Full player & transcript →
      </button>
    </div>
  );
}

// ── Modal audio player with custom play/pause button ──────────────────────────
function ModalAudioPlayer({ podcast }: { podcast: Podcast }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state whenever the podcast changes
    setPlaying(false);
    setIsLoading(false);
    setError(null);
  }, [podcast.id]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => setPlaying(false);
    const onError = () => { setPlaying(false); setIsLoading(false); setError("Playback error"); };
    el.addEventListener('ended', onEnded);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('error', onError);
    };
  }, []);

  const toggle = async () => {
    if (!audioRef.current) return;
    setError(null);
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setIsLoading(true);
      try {
        const audio = audioRef.current;
        if (audio.readyState < 2) {
          await new Promise<void>((resolve, reject) => {
            const onCanPlay = () => {
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onErr);
              resolve();
            };
            const onErr = () => {
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onErr);
              reject(new Error('Audio load failed'));
            };
            audio.addEventListener('canplaythrough', onCanPlay);
            audio.addEventListener('error', onErr);
            audio.load();
          });
        }
        await audio.play();
        setPlaying(true);
      } catch (err) {
        console.error("Modal audio play error:", err);
        setError("Playback failed. Please try again.");
        setPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <audio ref={audioRef} src={podcast.audioUrl} preload="metadata" />

      {/* Custom play/pause button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={toggle}
          disabled={isLoading}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-slate-900 hover:scale-105 transition-transform disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <Loader2 size={26} className="animate-spin text-blue-600" />
          ) : playing ? (
            <Pause size={26} />
          ) : (
            <Play size={26} className="ml-1" />
          )}
        </button>

        {/* Native controls for scrubbing/volume */}
        <audio
          src={podcast.audioUrl}
          controls
          preload="metadata"
          ref={(el) => {
            // Keep the hidden audio in sync: when user scrubs the visible controls,
            // we don't need the invisible one — so we just show native controls here
            // and drive play/pause from the button above via the main ref.
            // This second element is purely for the scrub bar UI.
            if (el) {
              // Mirror play/pause from main ref to this visible element
              const main = audioRef.current;
              if (!main) return;
              el.src = main.src;
            }
          }}
          className="w-full"
          style={{ display: 'none' }}
        />

        {/* Progress is handled by native controls below */}
        <div className="flex-1 text-white/60 text-xs font-bold uppercase tracking-widest">
          {playing ? 'Now playing…' : error ? <span className="text-red-400">{error}</span> : 'Press play to listen'}
        </div>

        <a
          href={podcast.audioUrl}
          download
          onClick={(e) => e.stopPropagation()}
          className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shrink-0"
        >
          <Download size={20} />
        </a>
      </div>

      {/* Native audio bar for scrubbing/seeking/volume */}
      {/* <audio
        src={podcast.audioUrl}
        controls
        preload="metadata"
        onPlay={() => {
          // If user hits play on native bar, sync button state
          setPlaying(true);
          // Also play the ref audio
          audioRef.current?.play().catch(() => {});
        }}
        onPause={() => {
          setPlaying(false);
          audioRef.current?.pause();
        }}
        onSeeked={(e) => {
          // Sync seek position to the ref audio
          if (audioRef.current) {
            audioRef.current.currentTime = (e.target as HTMLAudioElement).currentTime;
          }
        }}
        className="w-full rounded-xl"
      /> */}
    </div>
  );
}

function Podcast() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [heroData, setHeroData] = useState<GalleryHero | null>(null);
  const [loadingHero, setLoadingHero] = useState<boolean>(true);
  const [loadingPodcasts, setLoadingPodcasts] = useState<boolean>(true);

  const [levelFilter] = useState<string>('All');
  const [mediaFilter, setMediaFilter] = useState<string>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [activePodcast, setActivePodcast] = useState<Podcast | null>(null);
  const itemsPerPage = 6;
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || '';

  const availableTopics = useMemo(() => {
    const topics = podcasts.map(p => p.topic).filter(Boolean) as string[];
    return Array.from(new Set(topics)).sort();
  }, [podcasts]);

  // const availableLevels = useMemo(() => {
  //   const levels = podcasts.map(p => p.cefrLevel).filter(Boolean) as string[];
  //   return ['All', ...Array.from(new Set(levels)).sort()];
  // }, [podcasts]);

  useEffect(() => {
    const baseUrl = CLIENT_KEY.replace(/\/$/, '');

    fetch(`${baseUrl}/api/galleries`)
      .then(res => {
        if (!res.ok) throw new Error('Hero fetch failed');
        return res.json();
      })
      .then((data: StrapiResponse) => {
        const raw = Array.isArray(data) ? data : (data.data || []);
        const hero = raw.find((item: StrapiDataItem) => {
          const attr = item.attributes || item;
          return attr.purpose === "Other Page" && attr.subPurpose === "Podcasts";
        });

        if (hero) {
          const attr = hero.attributes || hero;
          setHeroData({
            title: attr.title || DEFAULT_HERO.title,
            description: attr.description || DEFAULT_HERO.description,
            mediaUrl: attr.mediaUrl || DEFAULT_HERO.mediaUrl,
          });
        } else {
          setHeroData(DEFAULT_HERO);
        }
      })
      .catch(err => {
        console.error("Hero fetch error:", err);
        setHeroData(DEFAULT_HERO);
      })
      .finally(() => setLoadingHero(false));

    const podcastQuery = `${baseUrl}/api/podcasts?` +
      `filters[status][$eq]=published&` +
      `filters[mediaType][$in]=audio&filters[mediaType][$in]=video&` +
      `sort=publishedAt:desc&` +
      `pagination[page]=1&pagination[pageSize]=100`;

    fetch(podcastQuery)
      .then(res => {
        if (!res.ok) throw new Error(`Podcasts fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data: StrapiResponse) => {
        const raw = Array.isArray(data) ? data : (data.data || []);
        const formatted = raw.map((item: StrapiDataItem) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            ...attrs,
            audioUrl: attrs.audioUrl?.startsWith('http')
              ? attrs.audioUrl
              : `${baseUrl}${attrs.audioUrl?.startsWith('/') ? '' : '/'}${attrs.audioUrl || ''}`,
            videoUrl: attrs.videoUrl?.startsWith('http')
              ? attrs.videoUrl
              : `${baseUrl}${attrs.videoUrl?.startsWith('/') ? '' : '/'}${attrs.videoUrl || ''}`,
            audioPodcastImage: attrs.audioPodcastImage || null,
          } as Podcast;
        });
        setPodcasts(formatted);
      })
      .catch(err => console.error("Podcasts fetch error:", err))
      .finally(() => setLoadingPodcasts(false));
  }, [CLIENT_KEY]);

  const filteredPodcasts = useMemo(() => {
    return podcasts.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.topic?.toLowerCase().includes(search.toLowerCase());

      const matchesLevel  = levelFilter === 'All'  || item.cefrLevel === levelFilter;
      const matchesMedia  = mediaFilter === 'All'  || item.mediaType.toLowerCase() === mediaFilter.toLowerCase();
      const matchesTopic  = topicFilter === 'All'  || item.topic === topicFilter;

      return matchesSearch && matchesLevel && matchesMedia && matchesTopic;
    });
  }, [podcasts, search, levelFilter, mediaFilter, topicFilter]);

  const currentPodcasts = filteredPodcasts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredPodcasts.length / itemsPerPage);

  const handleCopyTranscript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    document.body.style.overflow = activePodcast ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [activePodcast]);

  const activeAudioIsDirect = activePodcast?.audioUrl ? isDirectAudioFile(activePodcast.audioUrl) : false;

  return (
    <main className="pt-20 bg-gray-50/50 min-h-screen relative">
      {/* ── Hero ── */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-slate-900">
        {loadingHero ? (
          <div className="absolute inset-0 bg-slate-800 animate-pulse" />
        ) : (
          <>
            <img
              src={heroData?.mediaUrl}
              className="absolute inset-0 w-full h-full object-cover z-0"
              alt="Podcast hero background"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-red-600/80 via-transparent to-blue-900/90" />
            <div className="relative z-20 w-full h-full flex flex-col items-start justify-center px-6 md:px-16 gap-5">
              <div className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl">
                <Headphones size={17} />
                <p className="text-sm font-medium uppercase tracking-widest">À toi le micro</p>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-bold font-serif max-w-3xl leading-tight">
                {heroData?.title}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-xl leading-relaxed">
                {heroData?.description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-12 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search podcasts..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <select
              aria-label="Filter by topic"
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={topicFilter}
              onChange={(e) => { setTopicFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Topics</option>
              {availableTopics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['All', 'Audio', 'Video'].map(m => (
                <button
                  type="button"
                  key={m}
                  aria-label={`Show ${m} podcasts`}
                  onClick={() => { setMediaFilter(m); setCurrentPage(1); }}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${mediaFilter === m ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-500'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {/* CEFR Level filter removed
          <div className="flex gap-2 pt-4 border-t border-gray-100 overflow-x-auto no-scrollbar">
            {availableLevels.map(lvl => (
              <button
                type="button"
                key={lvl}
                aria-label={`Filter by level ${lvl}`}
                onClick={() => { setLevelFilter(lvl); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${levelFilter === lvl ? 'bg-blue-800 border-blue-800 text-white' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
          */}
        </div>

        {/* ── Grid ── */}
        {loadingPodcasts ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-600" size={48}/></div>
        ) : filteredPodcasts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg font-bold">No podcasts found matching your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPodcasts.map((item) => (
                <div key={item.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full overflow-hidden">

                  {/* ── Media area ── */}
                  {item.mediaType === 'video' && item.videoUrl ? (
                    <div className="relative aspect-video bg-slate-900">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${getYouTubeID(item.videoUrl)}`}
                        title={item.title}
                        frameBorder="0"
                        allowFullScreen
                        loading="eager"
                      />
                    </div>
                  ) : (
                    <AudioCard item={item} onOpen={() => setActivePodcast(item)} />
                  )}

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {item.cefrLevel && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">{item.cefrLevel}</span>
                      )}
                      {item.topic && (
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{item.topic}</span>
                      )}
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">
                        {item.mediaType}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow">{item.description}</p>

                    <div className="mb-6 py-4 border-y border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase">
                      <span className="flex items-center gap-1"><Layers size={12} className="text-blue-500"/> {item.topic || '—'}</span>
                      <span className="flex items-center gap-1"><User size={12}/> {item.audience || '—'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePodcast(item)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                    >
                      {item.mediaType === 'audio' ? 'Full Player & Transcript' : 'Play & View Transcript'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <p className="text-xs font-black text-gray-400 uppercase">Page {currentPage} of {totalPages}</p>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-4 bg-white border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal ── */}
      {activePodcast && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto flex flex-col" onClick={() => setActivePodcast(null)}>
          <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b p-6 md:p-10 flex justify-between items-center z-50">
            <button type="button" onClick={() => setActivePodcast(null)} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase">Back to Podcasts</span>
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (activePodcast.transcript) handleCopyTranscript(activePodcast.transcript);
                }}
                disabled={!activePodcast.transcript}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-[10px] font-black uppercase hover:bg-gray-200 disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Check size={14} />}
                {copied ? 'Copied' : 'Copy Transcript'}
              </button>
              <button type="button" aria-label="Close modal" onClick={() => setActivePodcast(null)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12" onClick={e => e.stopPropagation()}>
            <div className="space-y-8">
              <div className="flex gap-2 flex-wrap">
                {activePodcast.topic && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg">{activePodcast.topic}</span>
                )}
                {activePodcast.cefrLevel && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-lg">{activePodcast.cefrLevel}</span>
                )}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-serif text-slate-900 leading-tight">{activePodcast.title}</h2>
              <div className="flex flex-wrap gap-6 py-4 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-2"><User size={14} className="text-blue-600"/> {activePodcast.audience || '—'}</span>
                <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(activePodcast.updatedAt).toLocaleDateString()}</span>
              </div>

              {activePodcast.mediaType === 'audio' && activePodcast.audioUrl && (
                <>
                  {activeAudioIsDirect ? (
                    /* ── Direct file (incl. Cloudinary): custom play/pause + native scrub bar ── */
                    <div
                      className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col gap-6 relative overflow-hidden"
                      style={activePodcast.audioPodcastImage ? {
                        backgroundImage: `url(${activePodcast.audioPodcastImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : undefined}
                    >
                      {activePodcast.audioPodcastImage && (
                        <div className="absolute inset-0 bg-slate-900/70" />
                      )}
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="p-4 bg-white/10 rounded-2xl"><Headphones className="text-white" size={30}/></div>
                        <p className="text-white font-bold text-sm">{activePodcast.title}</p>
                      </div>
                      <div className="relative z-10">
                        <ModalAudioPlayer key={activePodcast.id} podcast={activePodcast} />
                      </div>
                    </div>
                  ) : (
                    /* Third-party embed (SoundCloud, Spotify, etc.) */
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col gap-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/10 rounded-2xl"><Headphones className="text-white" size={30}/></div>
                        <p className="text-white font-bold text-sm">{activePodcast.title}</p>
                      </div>
                      <div className="aspect-video w-full rounded-2xl overflow-hidden">
                        <iframe
                          src={activePodcast.audioUrl}
                          title={activePodcast.title}
                          className="w-full h-full border-0"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {activePodcast.mediaType === 'video' && activePodcast.videoUrl && getYouTubeID(activePodcast.videoUrl) && (
                <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeID(activePodcast.videoUrl)}`}
                    title={activePodcast.title}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              )}

              {activePodcast.transcript && (
                <div className="prose prose-lg max-w-none pt-10">
                  <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-6">Full Transcript</h4>
                  <div className="text-gray-600 leading-[1.8] text-lg whitespace-pre-wrap italic bg-gray-50 p-8 rounded-[2rem]">
                    {activePodcast.transcript}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Podcast;