import { Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SiteStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

export function StatusBadge({ status, compact = false }: { status: SiteStatus; compact?: boolean }) {
  if (status === "online") {
    return (
      <Badge className={cn("gap-1 bg-emerald-600/20 text-emerald-400", compact ? "px-2 py-0.5" : "px-2.5 py-1") }>
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
        LIVE
      </Badge>
    )
  }

  if (status === "offline") {
    return <Badge className={cn("bg-red-600/20 text-red-400", compact ? "px-2 py-0.5" : "px-2.5 py-1")}>DOWN</Badge>
  }

  return (
    <Badge className={cn("gap-1 bg-amber-500/20 text-amber-300", compact ? "px-2 py-0.5" : "px-2.5 py-1") }>
      <Loader2 className="size-3 animate-spin" />
      ...
    </Badge>
  )
}
