import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAdminStore } from "@/store/adminStore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BACKEND_BASE_URL = "https://backend.ekasyarifmaulana.biz.id";

export function normalizeMediaUrl(raw?: string | null) {
  if (!raw) return "";
  let url = raw.trim();
  if (!url) return "";
  
  // Clean up localhost prefix if present (artifact from development)
  // But if we ARE in local development (VITE_BACKEND_URL is localhost), we might want to keep it?
  // Actually, backend usually returns absolute URLs like http://localhost:8000/media/...
  // If we want to use CDN, we strip it.
  
  if (url.startsWith("http://localhost:8000")) {
    url = url.replace("http://localhost:8000", "");
  } else if (url.startsWith("http://127.0.0.1:8000")) {
    url = url.replace("http://127.0.0.1:8000", "");
  } else if (import.meta.env.VITE_BACKEND_URL && url.startsWith(import.meta.env.VITE_BACKEND_URL)) {
      url = url.replace(import.meta.env.VITE_BACKEND_URL, "");
  }

  // Check for CDN URL
  const settings = useAdminStore.getState().settings;
  const cdnUrl = settings?.cdn_url;

  if (cdnUrl && (url.startsWith("/media/") || url.startsWith("media/"))) {
    const cleanCdnUrl = cdnUrl.endsWith('/') ? cdnUrl.slice(0, -1) : cdnUrl;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${cleanCdnUrl}${cleanPath}`;
  }

  // Fallback to Backend Base URL
  if (url.startsWith("/media/") || url.startsWith("/static/")) {
    // Ensure we don't double slash
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
