import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatPrice(price: number): string {
    return price === 0 ? "Free" : `$${price.toFixed(2)}`;
}

// Video URL helpers
export type VideoType = "youtube" | "vimeo" | "direct" | "unknown";

export function detectVideoType(url: string): VideoType {
    if (!url) return "unknown";
    if (/youtube\.com\/watch|youtu\.be\//.test(url)) return "youtube";
    if (/vimeo\.com\//.test(url)) return "vimeo";
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return "direct";
    return "unknown";
}

export function getYouTubeEmbedUrl(url: string): string {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : "";
}

export function getVimeoEmbedUrl(url: string): string {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : "";
}
