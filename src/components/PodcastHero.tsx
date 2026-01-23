import { useEffect, useState } from "react";
import { Headphones, Play, X } from "lucide-react";

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

export default function LatestPodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlayer, setActivePlayer] = useState<number | null>(null);

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
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full 
          bg-blue-50 text-blue-700 font-semibold text-sm mb-6">
          <Headphones size={16} />
          Featured Podcasts
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
          Latest Episodes
        </h2>

        <p className="mt-5 text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Explore our newest podcast episodes covering language, culture,
          and real-world francophone experiences.
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
          const isActive = activePlayer === podcast.id;

          return (
            <article
              key={podcast.id}
              className="group relative rounded-[2rem] bg-white border border-slate-100 
                shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-white to-red-600" />

              <div className="p-8 flex flex-col h-full">
                {/* Media badge */}
                <span
                  className={`inline-block mb-4 px-4 py-1 rounded-full text-xs font-bold tracking-wide
                    ${
                      podcast.mediaType === "audio"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-red-50 text-red-700"
                    }`}
                >
                  {podcast.mediaType === "audio"
                    ? "Audio Podcast"
                    : "Video Podcast"}
                </span>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                  {podcast.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm mb-8 line-clamp-3">
                  {podcast.description}
                </p>

                {/* Player / Play Button */}
                <div className="mt-auto">
                  {!isActive && (
                    <button
                      onClick={() => setActivePlayer(podcast.id)}
                      className="w-full flex items-center justify-center gap-3 
                        py-4 rounded-xl font-semibold text-white
                        bg-gradient-to-r from-blue-700 to-red-600
                        hover:opacity-90 transition"
                    >
                      <Play size={18} />
                      Play Episode
                    </button>
                  )}

                  {isActive && (
                    <div className="space-y-4">
                      {podcast.mediaType === "audio" && podcast.audioUrl && (
                        <iframe
                          src={podcast.audioUrl}
                          title={podcast.title}
                          sandbox="allow-same-origin allow-scripts"
                          className="w-full h-20 rounded-xl border border-slate-200"
                        />
                      )}

                      {podcast.mediaType === "video" && podcast.videoUrl && (
                        <iframe
                          src={podcast.videoUrl}
                          title={podcast.title}
                          sandbox="allow-same-origin allow-scripts allow-presentation"
                          className="w-full h-48 rounded-xl border border-slate-200"
                        />
                      )}

                      <button
                        onClick={() => setActivePlayer(null)}
                        className="w-full flex items-center justify-center gap-2
                          py-2 text-sm font-semibold text-slate-500
                          hover:text-red-600 transition"
                      >
                        <X size={14} />
                        Close player
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                  <span>
                    {new Date(podcast.createdAt).toDateString()}
                  </span>

                  <span className="font-semibold text-blue-700">
                    Listen now
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
