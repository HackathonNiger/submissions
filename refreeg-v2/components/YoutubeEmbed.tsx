// components/YouTubeEmbed.tsx
import React from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title,
  className = "",
}) => {
  return (
    <div
      className={`relative aspect-video w-full max-w-4xl mx-auto ${className}`}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        frameBorder="0"
      />
    </div>
  );
};

export default YouTubeEmbed;
