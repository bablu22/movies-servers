export type SiteStatus = "online" | "offline" | "checking"

export type Site = {
  id: number
  domain: string
}

export type EnrichedSite = Site & {
  status: SiteStatus
  favicon: string
}
