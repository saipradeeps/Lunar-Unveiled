"use client"

import { useEffect, useRef } from "react"

export function StarfieldCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", onResize)

    type Star = { x: number; y: number; z: number; size: number; speed: number; tw: number }
    const STAR_COUNT = Math.min(200, Math.floor((width * height) / 20000))
    const stars: Star[] = new Array(STAR_COUNT).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.6 + 0.4,
      size: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.2 + 0.05,
      tw: Math.random() * Math.PI * 2,
    }))

    function draw() {
      ctx.clearRect(0, 0, width, height)

      // vignette
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) / 4,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.1,
      )
      grad.addColorStop(0, "rgba(0,0,0,0)")
      grad.addColorStop(1, "rgba(0,0,0,0.6)")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // stars
      for (const s of stars) {
        s.y += s.speed * s.z
        s.tw += 0.02
        if (s.y > height) {
          s.y = -2
          s.x = Math.random() * width
        }
        const alpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s.tw))
        ctx.fillStyle = `rgba(255,255,255,${alpha * s.z})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * s.z, 0, Math.PI * 2)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none opacity-60" />
}
