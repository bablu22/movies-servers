import { cn } from "@/lib/utils"

type ProgressProps = {
  value: number
  className?: string
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[#202020]",
        className,
      )}
    >
      <div
        className="h-full bg-[#e50914] transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}
