import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BACKEND_BASE_URL = "https://porto.apprentice.cyou"; // Gunakan Backend Production URL

export function normalizeMediaUrl(raw?: string | null) {
  if (!raw) return "";
  let url = raw.trim();
  if (!url) return "";
  
  if (import.meta.env.VITE_BACKEND_URL && url.startsWith(import.meta.env.VITE_BACKEND_URL)) {
      url = url.replace(import.meta.env.VITE_BACKEND_URL, "");
  }

  if (url.startsWith("/media/") || url.startsWith("/static/")) {
    const baseUrl = BACKEND_BASE_URL.endsWith('/') ? BACKEND_BASE_URL.slice(0, -1) : BACKEND_BASE_URL;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
  }
  if (url.startsWith("media/") || url.startsWith("static/")) {
     const baseUrl = BACKEND_BASE_URL.endsWith('/') ? BACKEND_BASE_URL.slice(0, -1) : BACKEND_BASE_URL;
     return `${baseUrl}/${url}`;
  }
  return url;
}
