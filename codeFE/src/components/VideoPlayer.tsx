"use client";

import { detectVideoType, getYouTubeEmbedUrl, getVimeoEmbedUrl } from "@/lib/utils";

interface VideoPlayerProps {
    url: string;
    onTimeUpdate?: (seconds: number) => void;
}

export default function VideoPlayer({ url, onTimeUpdate }: VideoPlayerProps) {
    const type = detectVideoType(url);

    if (type === "youtube") {
        return (
            <div className="video-wrapper">
                <iframe
                    src={getYouTubeEmbedUrl(url)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-iframe"
                />
                <style jsx>{`
          .video-wrapper {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            height: 0;
            background: black;
          }
          .video-iframe {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            border: none;
          }
        `}</style>
            </div>
        );
    }

    if (type === "vimeo") {
        return (
            <div className="video-wrapper">
                <iframe
                    src={getVimeoEmbedUrl(url)}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="video-iframe"
                />
                <style jsx>{`
          .video-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            background: black;
          }
          .video-iframe {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            border: none;
          }
        `}</style>
            </div>
        );
    }

    if (type === "direct") {
        return (
            <video
                src={url}
                controls
                style={{ width: "100%", maxHeight: "60vh", display: "block", background: "black" }}
                onTimeUpdate={(e) => onTimeUpdate?.(Math.floor(e.currentTarget.currentTime))}
            />
        );
    }

    // unknown — show the raw link
    return (
        <div className="unknown-video">
            <p>Cannot preview this video.</p>
            <a href={url} target="_blank" rel="noreferrer">Open link ↗</a>
            <style jsx>{`
        .unknown-video {
          padding: 3rem;
          text-align: center;
          background: #1e293b;
          color: #94a3b8;
        }
        a { color: #60a5fa; margin-top: 0.5rem; display: block; }
      `}</style>
        </div>
    );
}
