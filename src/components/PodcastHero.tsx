import { useEffect, useRef, useState } from "react";
import { Headphones, Play, Pause, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Podcast {
  id: number;
  title: string;
  description: string;
  mediaType: "audio" | "video";
  audioUrl?: string;
  videoUrl?: string;
  coverImage?: string;
  audioPodcastImage?: string;
  author?: string;
  createdAt: string;
  duration?: number;
}

const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

// Supported native audio extensions
const NATIVE_AUDIO_EXTENSIONS = [
  ".mp3", ".aac", ".ogg", ".opus", ".wma", ".m4a", ".wav",
  ".flac", ".alac", ".aiff", ".ape", ".mka", ".tta", ".wv",
  ".mid", ".midi", ".mp4", ".webm", ".3gp",
];

function isNativeAudioUrl(url: string): boolean {
  if (!url) return false;
  try {
    const clean = url.split("?")[0].toLowerCase();
    // Cloudinary raw/upload URLs without extension should also try native player
    // The browser can often figure out the format from Content-Type headers
    if (clean.includes("cloudinary.com") && clean.includes("/raw/")) {
      return true;
    }
    return NATIVE_AUDIO_EXTENSIONS.some((ext) => clean.endsWith(ext));
  } catch {
    return false;
  }
}

// ── Native <audio> player ────────────────────────────────────────────────────
function NativeAudioPlayer({ src, title, autoPlay }: { src: string; title: string; autoPlay?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      toggle();
    }
  }, [autoPlay]);

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
              audio.removeEventListener("canplaythrough", onCanPlay);
              audio.removeEventListener("error", onError);
              resolve();
            };
            const onError = () => {
              audio.removeEventListener("canplaythrough", onCanPlay);
              audio.removeEventListener("error", onError);
              reject(new Error("Failed to load audio"));
            };
            audio.addEventListener("canplaythrough", onCanPlay);
            audio.addEventListener("error", onError);
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
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full mt-auto space-y-3">
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        controlsList="nodownload"
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
        <span className="text-[10px] text-slate-400 tabular-nums w-8">
          {fmt(currentTime)}
        </span>
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
        <span className="text-[10px] text-slate-400 tabular-nums w-8 text-right">
          {fmt(duration)}
        </span>
      </div>
      <button
        onClick={toggle}
        disabled={isLoading}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : playing ? (
          <Pause size={18} />
        ) : (
          <Play size={18} />
        )}
        {isLoading ? "Loading…" : playing ? "Pause Episode" : "Play Episode"}
      </button>
    </div>
  );
}

// ── Iframe audio player ──────────────────────────────────────────────────────
function IframeAudioPlayer({
  src,
  title,
  active,
  onActivate,
}: {
  src: string;
  title: string;
  active: boolean;
  onActivate: () => void;
}) {
  const safeUrl = (() => {
    try {
      const u = new URL(src);
      if (u.hostname.includes("cloudinary.com")) {
        u.searchParams.set("fl_attachment", "false");
      }
      return u.toString();
    } catch {
      return src;
    }
  })();

  if (!active) {
    return (
      <button
        onClick={onActivate}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:opacity-90 transition"
      >
        <Play size={18} />
        Play Episode
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <iframe
        src={safeUrl}
        title={title}
        sandbox="allow-same-origin allow-scripts allow-presentation"
        className="w-full h-20 rounded-xl border border-slate-200"
        allow="autoplay"
      />
      <p className="text-[10px] text-slate-400 text-center">
        Streaming — no download
      </p>
    </div>
  );
}

// ── Cover image with play button overlay ─────────────────────────────────────
function CoverImageWithPlayButton({
  src,
  title,
  onPlay,
}: {
  src?: string;
  title: string;
  onPlay: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-700 to-red-600 rounded-t-[2rem] relative group cursor-pointer" onClick={onPlay}>
        <Headphones size={40} className="text-white/70" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-[2rem]">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play size={24} className="text-blue-700 ml-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-48 overflow-hidden rounded-t-[2rem] relative group cursor-pointer" onClick={onPlay}>
      <img
        src={src}
        alt={`Cover art for ${title}`}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        draggable={false}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
          <Play size={24} className="text-blue-700 ml-1" />
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function LatestPodcasts() {
  const navigate = useNavigate();

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIframeId, setActiveIframeId] = useState<number | null>(null);
  const [autoPlayAudioId, setAutoPlayAudioId] = useState<number | null>(null);

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
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm mb-6">
          <Headphones size={16} />
          Featured Podcasts
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
          Latest Episodes
        </h2>
        <p className="mt-5 text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Listen to inspiring podcasts, interviews, student voices, cultural
          discussions, and educational content created to make French learning
          engaging and accessible.
        </p>
        <div className="mt-10 flex justify-center gap-2">
          <span className="w-10 h-1 rounded-full bg-blue-700" />
          <span className="w-10 h-1 rounded-full bg-gray-200" />
          <span className="w-10 h-1 rounded-full bg-red-600" />
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-3">
        {podcasts.map((podcast) => {
          const isAudio = podcast.mediaType === "audio";
          const isVideo = podcast.mediaType === "video";
          const audioSrc = podcast.audioUrl || "";
          const useNativePlayer = isAudio && isNativeAudioUrl(audioSrc);
          const useIframeAudio = isAudio && audioSrc && !useNativePlayer;
          const isIframeActive = activeIframeId === podcast.id;
          const coverImage = podcast.audioPodcastImage || podcast.coverImage;

          const handleCoverPlay = () => {
            if (isAudio) {
              if (useNativePlayer) {
                setAutoPlayAudioId(podcast.id);
              } else if (useIframeAudio) {
                setActiveIframeId(podcast.id);
              }
            } else if (isVideo && podcast.videoUrl) {
              setActiveIframeId(podcast.id);
            }
          };

          return (
            <article
              key={podcast.id}
              className="group relative rounded-[2rem] bg-white border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
            >
              <CoverImageWithPlayButton
                src={coverImage}
                title={podcast.title}
                onPlay={handleCoverPlay}
              />

              <div className="p-8 flex flex-col flex-1">
                <span
                  className={`inline-block mb-4 px-4 py-1 rounded-full text-xs font-bold tracking-wide ${
                    isAudio ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {isAudio ? "Audio Podcast" : "Video Podcast"}
                </span>

                <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                  {podcast.title}
                </h3>

                <p className="text-slate-500 text-sm mb-8 line-clamp-3">
                  {podcast.description}
                </p>

                {useNativePlayer && (
                  <div className="mt-auto">
                    <NativeAudioPlayer
                      src={audioSrc}
                      title={podcast.title}
                      autoPlay={autoPlayAudioId === podcast.id}
                    />
                  </div>
                )}

                {useIframeAudio && (
                  <div className="mt-auto">
                    <IframeAudioPlayer
                      src={audioSrc}
                      title={podcast.title}
                      active={isIframeActive}
                      onActivate={() => setActiveIframeId(podcast.id)}
                    />
                    {isIframeActive && (
                      <button
                        onClick={() => setActiveIframeId(null)}
                        className="w-full flex items-center justify-center gap-2 py-2 mt-1 text-sm font-semibold text-slate-400 hover:text-red-600 transition"
                      >
                        <X size={14} />
                        Close player
                      </button>
                    )}
                  </div>
                )}

                {isAudio && !audioSrc && (
                  <div className="mt-auto p-4 rounded-xl bg-slate-50 text-center text-slate-400 text-sm">
                    No audio available
                  </div>
                )}

                {isVideo && podcast.videoUrl && (
                  <div className="mt-auto space-y-4">
                    {!isIframeActive && (
                      <button
                        onClick={() => setActiveIframeId(podcast.id)}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:opacity-90 transition"
                      >
                        <Play size={18} />
                        Play Episode
                      </button>
                    )}

                    {isIframeActive && (
                      <>
                        <iframe
                          src={podcast.videoUrl}
                          title={podcast.title}
                          sandbox="allow-same-origin allow-scripts allow-presentation"
                          className="w-full h-48 rounded-xl border border-slate-200"
                        />
                        <button
                          onClick={() => setActiveIframeId(null)}
                          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition"
                        >
                          <X size={14} />
                          Close player
                        </button>
                      </>
                    )}
                  </div>
                )}

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
          onClick={() => navigate("/podcast")}
          className="group relative bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-xl shadow-red-100 transition-all active:scale-95 flex items-center gap-3"
        >
          Explore
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}