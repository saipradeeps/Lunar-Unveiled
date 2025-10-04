"use client"

import { useRef, useState, useMemo } from "react"
import { cn } from "@/lib/utils"

type MagnifierProps = {
  imageUrl: string
  zoom?: number
  className?: string
}

export function Magnifier({ imageUrl, zoom = 2, className }: MagnifierProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const bgSize = useMemo(() => `${zoom * 100}% ${zoom * 100}%`, [zoom])

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseLeave={() => setPos(null)}
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setPos({ x, y })
      }}
      aria-label="Magnifier region"
      role="img"
    >
      {/* lens */}
      {pos && (
        <div
          className="pointer-events-none absolute h-32 w-32 rounded-full border border-border shadow-[0_0_0_2px_rgba(0,0,0,0.4)]"
          style={{
            left: pos.x - 64,
            top: pos.y - 64,
            backgroundImage: `url(${imageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: bgSize,
            backgroundPosition: `${-((pos.x / (containerRef.current?.clientWidth || 1)) * (zoom - 1) * 100)}% ${-((pos.y / (containerRef.current?.clientHeight || 1)) * (zoom - 1) * 100)}%`,
            boxShadow: "0 0 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />
      )}
    </div>
  )
}
