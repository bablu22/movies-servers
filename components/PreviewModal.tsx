"use client"

import { Copy, ExternalLink, X } from "lucide-react"

import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import { EnrichedSite } from "@/lib/types"

type PreviewModalProps = {
  site: EnrichedSite | null
  onClose: () => void
  onCopy: (url: string) => void
}

export function PreviewModal({ site, onClose, onCopy }: PreviewModalProps) {
  if (!site) {
    return null
  }

  const fullUrl = `https://${site.domain}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-none border border-[#2a2a2a] bg-[#111] sm:rounded-xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#2a2a2a] px-3 py-3 pt-[calc(env(safe-area-inset-top)+0.4rem)] sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={site.favicon}
              alt={`${site.domain} favicon`}
              className="size-5 rounded-sm"
              loading="lazy"
            />
            <p className="truncate text-sm font-semibold text-white sm:text-base">{site.domain}</p>
            <StatusBadge status={site.status} compact />
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 hover:bg-white/5" aria-label="Close preview">
            <X className="size-4" />
          </button>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#141414] to-[#0b0b0b] px-6 text-center">
          <p className="text-6xl font-black text-white/75">{site.domain.charAt(0).toUpperCase()}</p>
          <p className="text-xl font-semibold text-white">Preview Disabled</p>
          <p className="max-w-md text-sm text-neutral-400">
            Live iframe preview has been removed. Open the site in a new tab to view it.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#2a2a2a] px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:p-4">
          <div className="flex gap-2">
            <Button asChild className="bg-[#e50914] text-white hover:bg-[#f40612]">
              <a href={fullUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 size-4" />
                Open Site
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => onCopy(fullUrl)}
              className="border-[#2a2a2a] bg-[#141414] text-neutral-100 hover:bg-[#1f1f1f]"
            >
              <Copy className="mr-2 size-4" />
              Copy URL
            </Button>
          </div>

          <span className="rounded-full border border-[#2a2a2a] bg-[#141414] px-2 py-1 text-xs text-neutral-400">
            Site ID: {site.id}
          </span>
        </div>
      </div>
    </div>
  )
}
