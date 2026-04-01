"use client"

import { ExternalLink, Eye } from "lucide-react"

import { StatusBadge } from "@/components/StatusBadge"
import { EnrichedSite } from "@/lib/types"

type SiteCardProps = {
  site: EnrichedSite
  onPreview: (site: EnrichedSite) => void
}

export function SiteCard({ site, onPreview }: SiteCardProps) {
  const fullUrl = `https://${site.domain}`

  return (
    <article className="group animate-fade-up relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#141414] transition duration-200 hover:scale-[1.02] hover:border-[#e50914] hover:shadow-[0_0_20px_rgba(229,9,20,0.3)]">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#101010]">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center">
          <p className="text-4xl font-black text-white/70">{site.domain.charAt(0).toUpperCase()}</p>
          <p className="text-xs text-neutral-400">Preview disabled</p>
          <p className="text-[11px] text-neutral-500">Open site to view content</p>
        </div>

        <div className="absolute top-2 right-2">
          <StatusBadge status={site.status} compact />
        </div>

        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/65 opacity-0 transition group-hover:opacity-100 sm:flex">
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md bg-[#e50914] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#f40612]"
          >
            <ExternalLink className="mr-1 size-3.5" />
            Visit Site
          </a>
          <button
            type="button"
            onClick={() => onPreview(site)}
            className="inline-flex items-center rounded-md border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-xs font-semibold text-neutral-100 hover:bg-[#1f1f1f]"
          >
            <Eye className="mr-1 size-3.5" />
            Preview
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#2a2a2a] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <img src={site.favicon} alt="favicon" className="size-4 rounded-sm" loading="lazy" />
          <p className="truncate text-sm font-semibold text-white">{site.domain}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-[#2a2a2a] p-2 sm:hidden">
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center justify-center rounded-md bg-[#e50914] px-3 text-xs font-semibold text-white active:scale-[0.99]"
        >
          <ExternalLink className="mr-1 size-3.5" />
          Visit
        </a>
        <button
          type="button"
          onClick={() => onPreview(site)}
          className="inline-flex h-9 items-center justify-center rounded-md border border-[#2a2a2a] bg-[#1b1b1b] px-3 text-xs font-semibold text-neutral-100 active:scale-[0.99]"
        >
          <Eye className="mr-1 size-3.5" />
          Preview
        </button>
      </div>
    </article>
  )
}
