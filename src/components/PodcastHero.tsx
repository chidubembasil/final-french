import { useEffect, useRef, useState } from "react";
import { Headphones, Play, Pause, X, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Podcast {
  id: number;
  title: string;
  description: string;
  mediaType: "audio" | "video";
  audioUrl?: string;
  videoUrl?: string;
  author?: string;
  createdAt: string;
  duration?: number;
  audioPodcastImage?: string | null;
}

const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

// ── Supported direct audio file extensions ────────────────────────────────────
const DIRECT_AUDIO_EXTENSIONS = [
  '.mp3', '.aac', '.ogg', '.opus', '.wma', '.m4a', '.wav', '.flac',
  '.alac', '.aiff', '.ape', '.mka', '.tta', '.wv', '.mid', '.midi',
  '.mp4', '.webm', '.3gp'
];

function isDirectAudioFile(url: string): boolean {
  if (!url || url.trim() === '') return false;
  const cleanUrl = url.trim().toLowerCase().split('?')[0];
  return DIRECT_AUDIO_EXTENSIONS.some(ext => cleanUrl.endsWith(ext));
}

// ── Inline audio player — only shown for direct audio files ──────────────────
function AudioPlayer({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = async () => {
    if (!audioRef.current) return;
    setError(null);

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setIsLoading(true);
      try {
        if (audioRef.current.readyState < 2) {
          await new Promise<void>((resolve, reject) => {
            const audio = audioRef.current!;
            const onCanPlay = () => {
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
              resolve();
            };
            const onError = () => {
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
              reject(new Error('Failed to load audio'));
            };
            audio.addEventListener('canplaythrough', onCanPlay);
            audio.addEventListener('error', onError);
            audio.load();
          });
        }
        await audioRef.current.play();
        setPlaying(true);
      } catch (err) {
        console.error("Audio play error:", err);
        setError("Could not play audio. Please try again.");
        setPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(cur);
    setProgress(dur > 0 ? (cur / dur) * 100 : 0);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setError(null);
    }
  };

  const onEnded = () => setPlaying(false);

  const onError = () => {
    setError("Failed to load audio file");
    setPlaying(false);
    setIsLoading(false);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const val = Number(e.target.value);
    const dur = audioRef.current.duration || 0;
    if (dur > 0) {
      audioRef.current.currentTime = (val / 100) * dur;
      setProgress(val);
    }
  };

  const fmt = (s: number) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!src) {
    return (
      <div className="w-full mt-auto p-4 rounded-xl bg-slate-50 text-center text-slate-400 text-sm">
        No audio available
      </div>
    );
  }

  return (
    <div className="w-full mt-auto space-y-3">
      {/* preload="none" — prevents the browser fetching the file on mount */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onError={onError}
      />

      {error && (
        <div className="text-xs text-red-500 text-center bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-400 tabular-nums w-8">{fmt(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={seek}
          aria-label="Seek audio"
          className="flex-1 h-1 accent-blue-700 cursor-pointer"
        />
        <span className="text-[10px] text-slate-400 tabular-nums w-8 text-right">{fmt(duration)}</span>
      </div>

      <button
        onClick={toggle}
        disabled={isLoading}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : playing ? (
          <Pause size={18} />
        ) : (
          <Play size={18} />
        )}
        {isLoading ? 'Loading...' : playing ? 'Pause Episode' : 'Play Episode'}
      </button>
    </div>
  );
}

// ── Iframe player — for non-direct audio URLs (Spotify embeds, RFI, etc.) ────
function IframeAudioPlayer({ src, title }: { src: string; title: string }) {
  const [revealed, setRevealed] = useState(false);

  if (!src) {
    return (
      <div className="w-full mt-auto p-4 rounded-xl bg-slate-50 text-center text-slate-400 text-sm">
        No audio available
      </div>
    );
  }

  return (
    <div className="w-full mt-auto space-y-3">
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:opacity-90 transition"
        >
          <Play size={18} />
          Play Episode
        </button>
      ) : (
        <>
          <iframe
            src={src}
            title={title}
            className="w-full h-20 rounded-xl border border-slate-200"
            allow="autoplay"
          />
          <button
            onClick={() => setRevealed(false)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition"
          >
            <X size={14} />
            Close player
          </button>
        </>
      )}
    </div>
  );
}

export default function LatestPodcasts() {
  const navigate = useNavigate();

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  const BASE_URL = CLIENT_KEY.endsWith("/")
    ? CLIENT_KEY.slice(0, -1)
    : CLIENT_KEY;

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/podcasts`);
        if (!res.ok) throw new Error("Failed to fetch podcasts");

        const data: Podcast[] = await res.json();

        const latestThree = data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 3);

        setPodcasts(latestThree);
      } catch (err) {
        console.error("Podcast fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [BASE_URL]);

  if (loading) {
    return (
      <div className="py-28 text-center text-slate-400 text-lg">
        Loading latest episodes…
      </div>
    );
  }

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm mb-6">
          <Headphones size={16} />
          Featured Podcasts
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
          Latest Episodes
        </h2>

        <p className="mt-5 text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Listen to inspiring podcasts, interviews, student voices, cultural discussions, and educational content created to make French learning engaging and accessible.
        </p>

        {/* French flag accent */}
        <div className="mt-10 flex justify-center gap-2">
          <span className="w-10 h-1 rounded-full bg-blue-700" />
          <span className="w-10 h-1 rounded-full bg-gray-200" />
          <span className="w-10 h-1 rounded-full bg-red-600" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-12 md:grid-cols-3">
        {podcasts.map((podcast) => {
          const isVideoActive = activeVideoId === podcast.id;
          const audioSrc = podcast.audioUrl || '';
          const isDirect = isDirectAudioFile(audioSrc);

          return (
            <article
              key={podcast.id}
              className="group relative rounded-[2rem] bg-white border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
            >
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-white to-red-600 shrink-0" />

              {/* ── Cover image — audio only ── */}
              {podcast.mediaType === "audio" && podcast.audioPodcastImage && (
                <div className="w-full h-44 shrink-0 overflow-hidden bg-slate-100">
                  <img
                    src={podcast.audioPodcastImage}
                    alt={`${podcast.title} cover`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                {/* Media badge */}
                <span
                  className={`inline-block mb-4 px-4 py-1 rounded-full text-xs font-bold tracking-wide w-fit
                    ${podcast.mediaType === "audio"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-red-50 text-red-700"
                    }`}
                >
                  {podcast.mediaType === "audio" ? "Audio Podcast" : "Video Podcast"}
                </span>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                  {podcast.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm mb-8 line-clamp-3">
                  {podcast.description}
                </p>

                {/* ── AUDIO: direct file → native player, otherwise → iframe ── */}
                {podcast.mediaType === "audio" && (
                  isDirect ? (
                    <AudioPlayer src={audioSrc} title={podcast.title} />
                  ) : (
                    <IframeAudioPlayer src={audioSrc} title={podcast.title} />
                  )
                )}

                {/* ── VIDEO: click to reveal iframe ── */}
                {podcast.mediaType === "video" && podcast.videoUrl && (
                  <div className="mt-auto space-y-4">
                    {!isVideoActive && (
                      <button
                        onClick={() => setActiveVideoId(podcast.id)}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:opacity-90 transition"
                      >
                        <Play size={18} />
                        Play Episode
                      </button>
                    )}

                    {isVideoActive && (
                      <>
                        <iframe
                          src={podcast.videoUrl}
                          title={podcast.title}
                          sandbox="allow-same-origin allow-scripts allow-presentation"
                          className="w-full h-48 rounded-xl border border-slate-200"
                        />
                        <button
                          onClick={() => setActiveVideoId(null)}
                          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition"
                        >
                          <X size={14} />
                          Close player
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                  <span>{new Date(podcast.createdAt).toDateString()}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="w-full flex justify-center items-center mt-3">
        <button
          onClick={() => navigate('/podcast')}
          className="group relative bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-xl shadow-red-100 transition-all active:scale-95 flex items-center gap-3"
        >
          Explore
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}