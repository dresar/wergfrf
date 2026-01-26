import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BACKEND_BASE_URL = "https://backend.ekasyarifmaulana.biz.id";

export function normalizeMediaUrl(raw?: string | null) {
  if (!raw) return "";
  let url = raw.trim();
  if (!url) return "";
  if (url.startsWith("http://localhost:8000")) {
    url = url.replace("http://localhost:8000", "");
  } else if (url.startsWith("http://127.0.0.1:8000")) {
    url = url.replace("http://127.0.0.1:8000", "");
  }
  if (url.startsWith("/media/") || url.startsWith("/static/")) {
    return `${BACKEND_BASE_URL}${url}`;
  }
  if (url.startsWith("media/") || url.startsWith("static/")) {
    return `${BACKEND_BASE_URL}/${url}`;
  }
  return url;
}
