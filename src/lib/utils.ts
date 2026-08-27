import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to conditionally join class names (like clsx) and automatically
 * resolve Tailwind conflicts (like tailwind-merge).
 * @param inputs ClassValue[]
 * @returns string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Supabase signed URL to a public URL if applicable.
 * Used to ensure public bucket URLs are correctly formatted, while retaining
 * signed URLs for private storage.
 * @param url The URL string
 * @returns The corrected URL string
 */
export function toPublicUrl(url: string): string {
  if (url.includes("/storage/v1/object/sign/")) {
    // Replace /sign/ with /public/ and remove the token query parameter
    // This assumes the bucket is public, which is true for the 'dokumen' bucket
    const parts = url.split("?");
    return parts[0].replace("/sign/", "/public/");
  }
  return url;
}

/**
 * Truncates a string to a maximum length and adds an ellipsis.
 * @param text The input string.
 * @param max The maximum length.
 * @returns The truncated string.
 */
export function truncateText(text: string, max: number): string {
  if (text.length > max) {
    return text.substring(0, max) + "…";
  }
  return text;
}
