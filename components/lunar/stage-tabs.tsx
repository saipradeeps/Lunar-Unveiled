"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type StageTab = "raw" | "clahe" | "ai" | "sr"

export function StageTabs({
  value,
  onValueChange,
}: {
  value: StageTab
  onValueChange: (v: StageTab) => void
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as StageTab)} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger
          value="raw"
          className="data-[state=active]:text-primary data-[state=active]:shadow-[0_0_12px_inset_var(--color-primary)] data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          RAW
        </TabsTrigger>
        <TabsTrigger
          value="clahe"
          className="data-[state=active]:text-primary data-[state=active]:shadow-[0_0_12px_inset_var(--color-primary)] data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          CLAHE
        </TabsTrigger>
        <TabsTrigger
          value="ai"
          className="data-[state=active]:text-primary data-[state=active]:shadow-[0_0_12px_inset_var(--color-primary)] data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          AI Recon
        </TabsTrigger>
        <TabsTrigger
          value="sr"
          className="data-[state=active]:text-primary data-[state=active]:shadow-[0_0_12px_inset_var(--color-primary)] data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Super-Res
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
