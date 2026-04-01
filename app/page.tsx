import { SiteGrid } from "@/components/SiteGrid"
import sites from "@/data/sites.json"
import { Site } from "@/lib/types"

export default function Page() {
  return <SiteGrid sites={sites as Site[]} />
}
