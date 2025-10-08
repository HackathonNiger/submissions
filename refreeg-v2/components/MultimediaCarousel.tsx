"use client";
import React, { useState } from "react";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

export default function MultimediaCarousel({
  media,
  coverImage,
  title,
}: {
  media: string[];
  coverImage?: string;
  title: string;
}) {
  const [current, setCurrent] = useState(0);

  // Helpers to normalize and extract IDs from popular providers
  const extractYouTubeId = (rawUrl: string): string | null => {
    try {
      const url = new URL(rawUrl);
      // youtube.com/watch?v=ID or other params
      const vParam = url.searchParams.get("v");
      if (vParam) return vParam;
      // youtu.be/ID (may include extra path or params)
      if (url.hostname.includes("youtu.be")) {
        const path = url.pathname.replace(/^\//, "");
        return path ? path.split("/")[0] : null;
      }
      // youtube.com/shorts/ID
      const shortsMatch = url.pathname.match(/\/shorts\/([^/?#]+)/);
      if (shortsMatch) return shortsMatch[1];
      // youtube.com/embed/ID already embedded
      const embedMatch = url.pathname.match(/\/embed\/([^/?#]+)/);
      if (embedMatch) return embedMatch[1];
      return null;
    } catch {
      // Fallback regex if URL constructor fails
      const direct = rawUrl.match(/(?:v=|be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
      return direct ? direct[1] : null;
    }
  };

  const extractTikTokId = (rawUrl: string): string | null => {
    try {
      const url = new URL(rawUrl);
      // https://www.tiktok.com/@user/video/1234567890123456789
      const match = url.pathname.match(/\/video\/(\d+)/);
      return match ? match[1] : null;
    } catch {
      const match = rawUrl.match(/\/video\/(\d+)/);
      return match ? match[1] : null;
    }
  };

  const buildDrivePreviewUrl = (rawUrl: string): string | null => {
    // Support: /file/d/{id}/view, /file/d/{id}/, open?id=, uc?id=
    const dMatch = rawUrl.match(/\/d\/([^/]+)\//);
    if (dMatch) return `https://drive.google.com/file/d/${dMatch[1]}/preview`;
    const idParamMatch = rawUrl.match(/[?&]id=([^&#]+)/);
    if (idParamMatch) return `https://drive.google.com/file/d/${idParamMatch[1]}/preview`;
    return null;
  };

  // Convert string array to MediaItem array
  const processMedia = (): MediaItem[] => {
    if (media.length === 0) return [];

    return media.map((url) => ({
      type:
        url.match(/\.(mp4|mov|webm)$/i) ||
        url.match(/(youtube\.com|youtu\.be|tiktok\.com|drive\.google\.com)/i)
          ? "video"
          : "image",
      url,
    }));
  };

  const mediaItems = processMedia();
  const slides = coverImage
    ? [{ type: "image" as const, url: coverImage }, ...mediaItems]
    : mediaItems;

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  const renderMediaItem = (item: MediaItem, idx: number) => {
    if (item.type === "video") {
      const url = item.url;

      // YouTube embed
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = extractYouTubeId(url);
        return (
          <iframe
            src={videoId ? `https://www.youtube.com/embed/${videoId}` : url}
            title={`${title} - Video ${idx + 1}`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      // TikTok embed (requires /embed/VIDEO_ID)
      else if (url.includes("tiktok.com")) {
        const videoId = extractTikTokId(url);
        if (videoId) {
          return (
            <iframe
              src={`https://www.tiktok.com/embed/v2/${videoId}`}
              title={`${title} - TikTok Video ${idx + 1}`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          );
        }
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View TikTok Video
          </a>
        );
      }

      // Google Drive embed (/file/{id}/preview)
      else if (url.includes("drive.google.com")) {
        const previewUrl = buildDrivePreviewUrl(url);
        if (previewUrl) {
          return (
            <iframe
              src={previewUrl}
              title={`${title} - Drive Video ${idx + 1}`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          );
        }
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Google Drive Video
          </a>
        );
      }

      // Direct video file
      else {
        return (
          <video
            src={url}
            controls
            className="object-contain w-full h-full bg-black"
            poster={coverImage && idx === 0 ? coverImage : undefined}
          />
        );
      }
    } else {
      // Image
      return (
        <img
          src={item.url}
          alt={`${title} - Image ${idx + 1}`}
          className="object-cover w-full h-full"
        />
      );
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      {slides.map((item, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-500 ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {renderMediaItem(item, idx)}
        </div>
      ))}
      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full w-10 h-10 shadow-md z-20"
            aria-label="Previous"
            type="button"
          >
            &#8592;
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full w-10 h-10 shadow-md z-20"
            aria-label="Next"
            type="button"
          >
            &#8594;
          </button>
        </>
      )}
      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2 h-2 rounded-full ${
                idx === current ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}
