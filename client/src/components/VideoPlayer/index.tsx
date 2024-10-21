"use client";

import React, { useEffect, useState, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  className,
}: VideoPlayerProps) {
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideo(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {isVideo && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      )}
      <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
    </div>
  );
}
