"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Metric = {
  label: string
  value: string
  note?: string
}
const metrics: Metric[] = [
  { label: "PSNR", value: "28.6 dB" },
  { label: "SSIM", value: "0.84" },
  { label: "Contrast", value: "+22%" },
  { label: "Sharpness", value: "+18%" },
]

export function MetricsPanel() {
  return (
    <Card className="border border-border/80 bg-card/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">Quality Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-md border border-border/80 bg-background/40 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{m.label}</div>
              <div className="text-lg font-medium text-accent">{m.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
