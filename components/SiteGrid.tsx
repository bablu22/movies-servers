"use client"

import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { ArrowUp } from "lucide-react"

import { FilterBar, SortBy, StatusFilter } from "@/components/FilterBar"
import { Footer } from "@/components/Footer"
import { HeroSection } from "@/components/HeroSection"
import { Navbar } from "@/components/Navbar"
import { PreviewModal } from "@/components/PreviewModal"
import { SiteCard } from "@/components/SiteCard"
import { Progress } from "@/components/ui/progress"
import { Site, SiteStatus } from "@/lib/types"
import { getFaviconUrl, statusWeight } from "@/lib/utils"

const CACHE_KEY = "streamvault-status-cache-v1"
const CACHE_TTL_MS = 5 * 60 * 1000

type State = {
  statusByDomain: Record<string, SiteStatus>
}

type Action =
  | { type: "set_all"; status: SiteStatus; domains: string[] }
  | { type: "set_many"; updates: Array<{ domain: string; status: SiteStatus }> }

function reducer(state: State, action: Action): State {
  if (action.type === "set_all") {
    const next = { ...state.statusByDomain }
    for (const domain of action.domains) {
      next[domain] = action.status
    }
    return { statusByDomain: next }
  }

  const next = { ...state.statusByDomain }
  for (const update of action.updates) {
    next[update.domain] = update.status
  }
  return { statusByDomain: next }
}

export function SiteGrid({ sites }: { sites: Site[] }) {
  const PAGE_SIZE = 24
  const [state, dispatch] = useReducer(reducer, {
    statusByDomain: Object.fromEntries(
      sites.map((site) => [site.domain, "checking" as SiteStatus])
    ) as Record<string, SiteStatus>,
  })
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<StatusFilter>("all")
  const [sortBy, setSortBy] = useState<SortBy>("id")
  const [progress, setProgress] = useState(0)
  const [checkingAll, setCheckingAll] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handleQueryChange = useCallback((value: string) => {
    setQuery((prev) => {
      if (prev === value) {
        return prev
      }
      setCurrentPage(1)
      return value
    })
  }, [])

  const handleFilterChange = useCallback((value: StatusFilter) => {
    setFilter((prev) => {
      if (prev === value) {
        return prev
      }
      setCurrentPage(1)
      return value
    })
  }, [])

  const handleSortChange = useCallback((value: SortBy) => {
    setSortBy((prev) => {
      if (prev === value) {
        return prev
      }
      setCurrentPage(1)
      return value
    })
  }, [])

  const enriched = useMemo(
    () =>
      sites.map((site) => ({
        ...site,
        status: state.statusByDomain[site.domain] ?? "checking",
        favicon: getFaviconUrl(site.domain),
      })),
    [sites, state.statusByDomain]
  )

  const counts = useMemo(
    () => ({
      online: enriched.filter((site) => site.status === "online").length,
      offline: enriched.filter((site) => site.status === "offline").length,
      checking: enriched.filter((site) => site.status === "checking").length,
    }),
    [enriched]
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    const bySearch = enriched.filter((site) =>
      normalized ? site.domain.toLowerCase().includes(normalized) : true
    )

    const byStatus = bySearch.filter((site) =>
      filter === "all" ? true : site.status === filter
    )

    return [...byStatus].sort((a, b) => {
      if (sortBy === "az") {
        return a.domain.localeCompare(b.domain)
      }
      if (sortBy === "za") {
        return b.domain.localeCompare(a.domain)
      }
      if (sortBy === "status") {
        return statusWeight(a.status) - statusWeight(b.status) || a.id - b.id
      }
      return a.id - b.id
    })
  }, [enriched, filter, query, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedSites = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [safeCurrentPage, filtered, PAGE_SIZE])

  const selectedSite = useMemo(
    () => enriched.find((site) => site.domain === selectedDomain) ?? null,
    [enriched, selectedDomain]
  )

  const mergeCacheUpdates = useCallback(
    (updates: Array<{ domain: string; status: SiteStatus }>) => {
      let statusByDomain: Record<string, SiteStatus> = {}

      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        try {
          const cached = JSON.parse(raw) as {
            expiresAt: number
            statusByDomain: Record<string, SiteStatus>
          }
          if (cached.expiresAt > Date.now()) {
            statusByDomain = { ...cached.statusByDomain }
          }
        } catch {
          // Ignore malformed cache and rebuild.
        }
      }

      for (const update of updates) {
        statusByDomain[update.domain] = update.status
      }

      const payload = {
        expiresAt: Date.now() + CACHE_TTL_MS,
        statusByDomain,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
    },
    []
  )

  const runStatusChecksForDomains = useCallback(
    async (domains: string[], force = false) => {
      const uniqueDomains = Array.from(new Set(domains))
      let domainsToCheck = uniqueDomains

      if (!force) {
        const raw = localStorage.getItem(CACHE_KEY)
        if (raw) {
          try {
            const cached = JSON.parse(raw) as {
              expiresAt: number
              statusByDomain: Record<string, SiteStatus>
            }
            if (cached.expiresAt > Date.now()) {
              const cachedUpdates = uniqueDomains
                .filter((domain) => cached.statusByDomain[domain])
                .map((domain) => ({
                  domain,
                  status: cached.statusByDomain[domain],
                }))

              if (cachedUpdates.length) {
                dispatch({ type: "set_many", updates: cachedUpdates })
              }

              domainsToCheck = uniqueDomains.filter(
                (domain) => !cached.statusByDomain[domain]
              )

              if (!domainsToCheck.length) {
                return
              }
            }
          } catch {
            localStorage.removeItem(CACHE_KEY)
          }
        }
      }

      if (!domainsToCheck.length) {
        return
      }

      setCheckingAll(true)
      setProgress(0)
      dispatch({ type: "set_all", status: "checking", domains: domainsToCheck })

      let checked = 0

      for (let i = 0; i < domainsToCheck.length; i += 6) {
        const chunk = domainsToCheck.slice(i, i + 6)
        const results = await Promise.allSettled(
          chunk.map(
            async (domain): Promise<{ domain: string; status: SiteStatus }> => {
              const res = await fetch(
                `/api/check-status?domain=${encodeURIComponent(domain)}`
              )
              if (!res.ok) {
                return { domain, status: "offline" as const }
              }
              const payload = (await res.json()) as { status?: SiteStatus }
              return {
                domain,
                status: payload.status === "online" ? "online" : "offline",
              }
            }
          )
        )

        const updates: Array<{ domain: string; status: SiteStatus }> =
          results.map((result, idx) => {
            const domain = chunk[idx]
            if (result.status === "fulfilled") {
              return result.value
            }
            return { domain, status: "offline" as const }
          })

        dispatch({ type: "set_many", updates })
        mergeCacheUpdates(updates)

        checked += chunk.length
        setProgress(Math.round((checked / domainsToCheck.length) * 100))
      }

      setCheckingAll(false)
    },
    [mergeCacheUpdates]
  )

  const onCopy = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setToast("URL copied to clipboard")
    } catch {
      setToast("Copy failed")
    }
    window.setTimeout(() => setToast(null), 1800)
  }, [])

  const onSurpriseMe = useCallback(() => {
    const online = enriched.filter((site) => site.status === "online")
    if (!online.length) {
      setToast("No online site available yet")
      window.setTimeout(() => setToast(null), 1800)
      return
    }
    const picked = online[Math.floor(Math.random() * online.length)]
    window.open(`https://${picked.domain}`, "_blank", "noopener,noreferrer")
  }, [enriched])

  useEffect(() => {
    const visibleUnchecked = paginatedSites
      .map((site) => site.domain)
      .filter((domain) => state.statusByDomain[domain] === "checking")

    if (!visibleUnchecked.length) {
      return
    }

    const timer = window.setTimeout(() => {
      void runStatusChecksForDomains(visibleUnchecked, false)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [paginatedSites, runStatusChecksForDomains, state.statusByDomain])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedDomain(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar
        query={query}
        onQueryChange={handleQueryChange}
        resultCount={filtered.length}
        totalSites={sites.length}
        onlineCount={counts.online}
      />

      <HeroSection
        total={sites.length}
        online={counts.online}
        offline={counts.offline}
      />

      <FilterBar
        filter={filter}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        counts={{ all: enriched.length, ...counts }}
        onCheckAll={() =>
          runStatusChecksForDomains(
            paginatedSites.map((site) => site.domain),
            true
          )
        }
        checkingAll={checkingAll}
        onSurpriseMe={onSurpriseMe}
      />

      {checkingAll ? (
        <div className="mx-auto mt-3 max-w-[1600px] px-3 sm:mt-4 sm:px-4">
          <div className="mb-1 flex items-center justify-between text-xs text-neutral-400">
            <span>Checking visible site status...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      ) : null}

      <main className="mx-auto max-w-[1600px] px-3 py-4 pb-[calc(env(safe-area-inset-bottom)+6.25rem)] sm:px-4 sm:py-6 sm:pb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {paginatedSites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onPreview={(item) => setSelectedDomain(item.domain)}
            />
          ))}
        </div>

        {!filtered.length ? (
          <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] py-12 text-center text-neutral-400">
            No sites match your filter.
          </div>
        ) : null}

        <Footer total={sites.length} counts={counts} />
        {filtered.length ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, Math.min(totalPages, p) - 1))}
              disabled={safeCurrentPage === 1}
              className="rounded-md border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-sm text-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="rounded-md border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-sm text-neutral-300">
              Page {safeCurrentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, Math.min(totalPages, p) + 1))}
              disabled={safeCurrentPage === totalPages}
              className="rounded-md border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-sm text-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </main>

      <PreviewModal
        site={selectedSite}
        onClose={() => setSelectedDomain(null)}
        onCopy={onCopy}
      />

      {showBackToTop ? (
        <button
          type="button"
          className="fixed right-3 z-40 rounded-full border border-[#2a2a2a] bg-[#141414] p-3 text-white shadow-lg hover:bg-[#1f1f1f] sm:right-4"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 0.9rem)" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp className="size-4" />
        </button>
      ) : null}

      {toast ? (
        <div
          className="fixed right-3 z-50 rounded-md border border-[#2a2a2a] bg-[#161616] px-3 py-2 text-sm text-neutral-200 sm:right-4"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 4.2rem)" }}
        >
          {toast}
        </div>
      ) : null}
    </div>
  )
}
