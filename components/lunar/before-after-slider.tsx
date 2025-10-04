"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Magnifier } from "./magnifier";
import { Spinner } from "@/components/ui/spinner";

export type StageKey = "raw" | "clahe" | "ai" | "sr";
type ImageMap = Partial<Record<StageKey, string>>;

export type BeforeAfterProps = {
  // Right side is controlled by tabs; left is always RAW (per blueprint).
  rightStage: StageKey;
  imageMap?: ImageMap;
  loading?: boolean;
  showMagnifier?: boolean;
};

const DEFAULTS: Record<StageKey, string> = {
  raw: "/raw.png",
  clahe: "/clahe.png",
  ai: "/final_recon.png",
  sr: "/super-resolution-lunar-surface.jpg",
};

export function BeforeAfterSlider({
  rightStage,
  imageMap,
  loading = false,
  showMagnifier = true,
}: BeforeAfterProps) {
  const leftUrl = useMemo(() => imageMap?.raw ?? DEFAULTS.raw, [imageMap?.raw]);
  const targetRightUrl = useMemo(
    () => imageMap?.[rightStage] ?? DEFAULTS[rightStage],
    [imageMap, rightStage]
  );

  // Simple image switching without complex fade logic
  console.log("Current stage:", rightStage, "Image URL:", targetRightUrl);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-card/40 backdrop-blur-md p-4">
        {/* Left side - RAW (locked) */}
        <div className="space-y-2">
          <div className="text-center text-sm font-medium text-muted-foreground">
            RAW Data
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={leftUrl || "/placeholder.svg"}
              alt="RAW Data baseline image"
              width={800}
              height={520}
              className="h-[300px] w-full object-cover md:h-[400px]"
              priority
            />
            {showMagnifier && (
              <Magnifier imageUrl={leftUrl} className="h-full w-full" />
            )}
          </div>
        </div>

        {/* Right side - Processed (changes with button clicks) */}
        <div className="space-y-2">
          <div className="text-center text-sm font-medium text-primary">
            {rightStage.toUpperCase()} Processed
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              key={rightStage}
              src={targetRightUrl || "/placeholder.svg"}
              alt="Processed stage image"
              width={800}
              height={520}
              className="h-[300px] w-full object-cover md:h-[400px]"
              priority
            />

            {showMagnifier && (
              <Magnifier imageUrl={targetRightUrl} className="h-full w-full" />
            )}

            {/* loading overlay */}
            {loading && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 rounded-md border border-border/60 bg-background/60 px-4 py-3">
                  <Spinner className="text-primary" />
                  <div className="text-xs text-muted-foreground">
                    Reconstructing Terrain... AI Core Engaged.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
