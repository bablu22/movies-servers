"use client"

import { useEffect, useState } from "react"

type HeroSectionProps = {
  total: number
  online: number
  offline: number
}

function Counter({ label, value }: { label: string; value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 700
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      setDisplay(Math.round(value * progress))
      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [value])

  return (
    <div className="rounded-lg border border-white/10 bg-black/35 p-2.5 backdrop-blur-sm sm:p-4">
      <p className="text-[10px] text-neutral-400 sm:text-xs">{label}</p>
      <p className="text-lg font-bold text-white sm:text-2xl">{display}</p>
    </div>
  )
}

export function HeroSection({ total, online, offline }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#e50914]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,9,20,0.25),transparent_40%),linear-gradient(to_bottom,#161616,#0a0a0a)]" />
      <div className="relative mx-auto flex min-h-[220px] max-w-[1600px] flex-col justify-center px-3 py-7 sm:min-h-[260px] sm:px-4 sm:py-10">
        <h1 className="max-w-4xl text-3xl font-bold text-white sm:text-5xl lg:text-6xl">
          The Ultimate Streaming Sites Directory
        </h1>
        <p className="mt-2 text-xs text-neutral-300 sm:mt-3 sm:text-base">
          Discover 251+ free movie & TV streaming sites
        </p>

        <div className="mt-4 grid max-w-2xl grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
          <Counter label="Total Sites" value={total} />
          <Counter label="Online" value={online} />
          <Counter label="Offline" value={offline} />
        </div>
      </div>
    </section>
  )
}
