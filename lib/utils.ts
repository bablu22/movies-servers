import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SiteStatus } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFaviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

export function statusWeight(status: SiteStatus) {
  if (status === "online") {
    return 0
  }
  if (status === "checking") {
    return 1
  }
  return 2
}
