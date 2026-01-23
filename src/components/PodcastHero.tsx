import { useEffect, useState } from "react";
import { Headphones, Play } from "lucide-react";

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
          Podcasts à la une
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
          Derniers Épisodes
        </h2>

        <p className="mt-5 text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Découvrez nos podcasts récents autour de la langue, de la culture et
          des expériences francophones.
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
        {podcasts.map((podcast) => (
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
                {podcast.mediaType === "audio" ? "Podcast Audio" : "Podcast Vidéo"}
              </span>

              {/* Title */}
              <h3 className="text-xl font-extrabold text-slate-900 leading-snug mb-3">
                {podcast.title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                {podcast.description}
              </p>

              {/* Player */}
              <div className="mt-auto">
                {podcast.mediaType === "audio" && podcast.audioUrl && (
                  <iframe
                    src={podcast.audioUrl}
                    title={podcast.title}
                    allow="autoplay"
                    sandbox="allow-same-origin allow-scripts"
                    className="w-full h-20 rounded-xl border border-slate-200 bg-slate-50"
                  />
                )}

                {podcast.mediaType === "video" && podcast.videoUrl && (
                  <iframe
                    src={podcast.videoUrl}
                    title={podcast.title}
                    allow="autoplay; fullscreen"
                    sandbox="allow-same-origin allow-scripts allow-presentation"
                    className="w-full h-48 rounded-xl border border-slate-200 bg-black"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                <span>
                  {new Date(podcast.createdAt).toDateString()}
                </span>

                <span className="flex items-center gap-2 font-semibold text-red-600">
                  <Play size={14} />
                  Écouter
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
