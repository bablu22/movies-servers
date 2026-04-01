"use client"

import { Clapperboard } from "lucide-react"

import { SearchBar } from "@/components/SearchBar"

type NavbarProps = {
  query: string
  onQueryChange: (value: string) => void
  resultCount: number
  totalSites: number
  onlineCount: number
}

export function Navbar({ query, onQueryChange, resultCount, totalSites, onlineCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-3 py-2 sm:px-4 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold tracking-wide text-[#e50914]">
            <Clapperboard className="size-5" />
            <span className="text-base sm:text-lg">StreamVault</span>
          </div>
          <div className="rounded-full border border-[#2a2a2a] bg-[#161616] px-2.5 py-1 text-[11px] text-neutral-300 sm:text-xs">
            {totalSites} Sites • <span className="text-emerald-400">{onlineCount} Online</span>
          </div>
        </div>

        <SearchBar query={query} onQueryChange={onQueryChange} resultCount={resultCount} />
      </div>
    </header>
  )
}
