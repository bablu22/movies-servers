"use client"

import { Film, Loader2, Shuffle, Wifi, WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"

type StatusFilter = "all" | "online" | "offline" | "checking"

type SortBy = "id" | "az" | "za" | "status"

type FilterBarProps = {
  filter: StatusFilter
  onFilterChange: (value: StatusFilter) => void
  sortBy: SortBy
  onSortChange: (value: SortBy) => void
  counts: Record<StatusFilter, number>
  onCheckAll: () => void
  checkingAll: boolean
  onSurpriseMe: () => void
}

export type { StatusFilter, SortBy }

export function FilterBar({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  counts,
  onCheckAll,
  checkingAll,
  onSurpriseMe,
}: FilterBarProps) {
  const options: StatusFilter[] = ["all", "online", "offline", "checking"]
  const mobileOptions: Array<{
    key: StatusFilter
    label: string
    Icon: typeof Film
  }> = [
    { key: "all", label: "All", Icon: Film },
    { key: "online", label: "Live", Icon: Wifi },
    { key: "offline", label: "Down", Icon: WifiOff },
    { key: "checking", label: "Check", Icon: Loader2 },
  ]

  return (
    <>
      <section className="sticky top-[calc(env(safe-area-inset-top)+110px)] z-30 border-b border-white/10 bg-black/90 backdrop-blur lg:top-[calc(env(safe-area-inset-top)+65px)]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-3 py-2 sm:px-4 sm:py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 hidden gap-2 overflow-x-auto px-1 pb-1 sm:flex">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onFilterChange(option)}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                  filter === option
                    ? "border-[#e50914] bg-[#e50914] text-white"
                    : "border-[#2a2a2a] bg-[#141414] text-neutral-300 hover:border-neutral-500"
                }`}
              >
                {option} <span className="text-[11px] opacity-80">({counts[option]})</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortBy)}
              className="col-span-2 h-9 rounded-md border border-[#2a2a2a] bg-[#141414] px-3 text-sm text-neutral-200 lg:col-span-1"
            >
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
              <option value="status">Status</option>
              <option value="id">ID</option>
            </select>

          <Button
            onClick={onCheckAll}
            className="h-9 bg-[#e50914] text-white hover:bg-[#f40612] lg:min-w-[148px]"
            disabled={checkingAll}
          >
            {checkingAll ? "Checking..." : "Check This Page"}
          </Button>

            <Button
              onClick={onSurpriseMe}
              variant="outline"
              className="h-9 border-[#2a2a2a] bg-[#141414] text-neutral-100 hover:bg-[#1f1f1f] lg:min-w-[130px]"
            >
              <Shuffle className="mr-2 size-4" />
              Surprise Me
            </Button>
          </div>
        </div>
      </section>

      <nav
        className="fixed right-0 bottom-0 left-0 z-40 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 sm:hidden"
        aria-label="Status filters"
      >
        <div className="mx-auto grid max-w-sm grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-[#0f0f0f]/95 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur">
          {mobileOptions.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              className={`rounded-xl border px-1 py-2 text-[10px] font-semibold transition ${
                filter === key
                  ? "border-[#e50914] bg-gradient-to-b from-[#f40612] to-[#c50812] text-white"
                  : "border-transparent bg-transparent text-neutral-300"
              }`}
            >
              <span className="mx-auto mb-1 flex size-5 items-center justify-center">
                <Icon
                  className={`size-4 ${key === "checking" && filter === key ? "animate-spin" : ""}`}
                />
              </span>
              <span className="block leading-none">{label}</span>
              <span className="mt-1 block leading-none opacity-80">{counts[key]}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
