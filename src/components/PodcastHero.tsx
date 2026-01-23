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

        // Sort by latest createdAt and take last 3
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
      <div className="py-20 text-center text-gray-400">
        Loading podcasts…
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
        <Headphones className="text-red-600" />
        Latest Podcasts
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {podcasts.map((podcast) => (
          <div
            key={podcast.id}
            className="rounded-2xl border bg-white shadow hover:shadow-lg transition p-6"
          >
            <h3 className="font-bold text-lg mb-2">
              {podcast.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4">
              {podcast.description}
            </p>

            {/* AUDIO */}
            {podcast.mediaType === "audio" && podcast.audioUrl && (
              <iframe
                src={podcast.audioUrl}
                title={podcast.title}
                allow="autoplay"
                sandbox="allow-same-origin allow-scripts"
                className="w-full h-20 rounded-lg border"
              />
            )}

            {/* VIDEO */}
            {podcast.mediaType === "video" && podcast.videoUrl && (
              <iframe
                src={podcast.videoUrl}
                title={podcast.title}
                allow="autoplay; fullscreen"
                sandbox="allow-same-origin allow-scripts allow-presentation"
                className="w-full h-48 rounded-lg border"
              />
            )}

            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              <span>{new Date(podcast.createdAt).toDateString()}</span>
              <Play size={14} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
