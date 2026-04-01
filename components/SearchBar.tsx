"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"

type SearchBarProps = {
  query: string
  onQueryChange: (value: string) => void
  resultCount: number
}

export function SearchBar({ query, onQueryChange, resultCount }: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(query)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  useEffect(() => {
    const id = window.setTimeout(() => onQueryChange(localQuery), 300)
    return () => window.clearTimeout(id)
  }, [localQuery, onQueryChange])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isTypingTarget =
        e.target instanceof HTMLElement &&
        (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)

      if (e.key === "/" && !isTypingTarget) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="w-full max-w-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
        <Input
          ref={inputRef}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search by domain..."
          className="pl-10 pr-10"
          aria-label="Search websites"
        />
        {localQuery ? (
          <button
            type="button"
            onClick={() => setLocalQuery("")}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      <p className="mt-1 hidden text-xs text-neutral-500 sm:block">{resultCount} results found</p>
    </div>
  )
}
