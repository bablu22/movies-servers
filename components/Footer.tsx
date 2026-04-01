import { SiteStatus } from "@/lib/types"

type FooterProps = {
  total: number
  counts: Record<SiteStatus, number>
}

export function Footer({ total, counts }: FooterProps) {
  return (
    <footer className="mt-8 border-t border-white/10 py-6 text-center text-sm text-neutral-400">
      Total: {total} • Online:{" "}
      <span className="text-emerald-400">{counts.online}</span> • Offline:{" "}
      <span className="text-red-400">{counts.offline}</span> • Checking:{" "}
      <span className="text-amber-300">{counts.checking}</span>
      <div className="mt-2">
        Developed by{" "}
        <a
          href="https://github.com/bablu22"
          target="_blank"
          rel="noreferrer"
          className="text-[#e50914] hover:text-[#f40612]"
        >
          Bablu Mia
        </a>
      </div>
    </footer>
  )
}
