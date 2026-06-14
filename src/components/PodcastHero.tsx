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
  author?: string;
  createdAt: string;
  duration?: number;
}

const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY || "";

// ── Inline audio player with play/pause ──────────────────────────────────────
function AudioPlayer({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
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
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onEnded = () => setPlaying(false);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const val = Number(e.target.value);
    audioRef.current.currentTime = (val / 100) * (audioRef.current.duration || 0);
    setProgress(val);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full mt-auto space-y-3">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />

      {/* Progress bar */}
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

      {/* Play / Pause button */}
      <button
        onClick={toggle}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:opacity-90 transition"
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
        {playing ? 'Pause Episode' : 'Play Episode'}
      </button>
    </div>
  );
}

export default function LatestPodcasts() {
  const navigate = useNavigate();

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  // For video cards only — track which video is active
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

          return (
            <article
              key={podcast.id}
              className="group relative rounded-[2rem] bg-white border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-white to-red-600" />

              <div className="p-8 flex flex-col h-full">
                {/* Media badge */}
                <span
                  className={`inline-block mb-4 px-4 py-1 rounded-full text-xs font-bold tracking-wide
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

                {/* ── AUDIO: always-visible inline player ── */}
                {podcast.mediaType === "audio" && podcast.audioUrl && (
                  <AudioPlayer src={podcast.audioUrl} title={podcast.title} />
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