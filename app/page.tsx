"use client";

import type React from "react";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { StarfieldCanvas } from "@/components/lunar/starfield-canvas";
import { BeforeAfterSlider } from "@/components/lunar/before-after-slider";
import type { StageKey } from "@/components/lunar/before-after-slider";
import { StageTabs, type StageTab } from "@/components/lunar/stage-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  // stage controls
  const [rightStage, setRightStage] = useState<StageTab>("sr");

  // images mapping (RAW locked to left; all stages can be provided)
  const [imageMap, setImageMap] = useState<Partial<Record<StageKey, string>>>({
    raw: "/raw.png",
    clahe: "/clahe.png",
    ai: "/final_recon.png",
    sr: "/super-resolution-lunar-surface.jpg",
  });

  // processing state
  const [loading, setLoading] = useState(false);

  // client-side date state to prevent hydration mismatch
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update time on client side to prevent hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString());
    };

    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // upload handling
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    // simulate processing pipeline
    const url = URL.createObjectURL(file);
    setLoading(true);
    // set RAW immediately
    setImageMap((prev) => ({ ...prev, raw: url }));
    // simulate processing time and (for demo) set other stages to the same asset
    setTimeout(() => {
      setImageMap((prev) => ({
        ...prev,
        clahe: prev.clahe ?? url,
        ai: prev.ai ?? url,
        sr: prev.sr ?? url,
      }));
      setLoading(false);
      setRightStage("sr");
    }, 1800);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onFiles(e.dataTransfer.files);
    },
    [onFiles]
  );

  const onPick = useCallback(() => fileInputRef.current?.click(), []);

  const finalUrl = useMemo(
    () => imageMap.sr ?? imageMap.ai ?? imageMap.clahe ?? imageMap.raw ?? "",
    [imageMap]
  );
  const download = useCallback(() => {
    if (!finalUrl) return;
    const a = document.createElement("a");
    a.href = finalUrl;
    a.download = "lunar-unveiled-superres.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [finalUrl]);

  return (
    <main className="relative min-h-dvh">
      <StarfieldCanvas />

      {/* Header - frosted glass */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/40 backdrop-blur-md">
        <div className="mx-auto max-w-full px-4 py-6">
          {/* Centered Main Heading */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg">
              <span className="text-primary bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Lunar
              </span>{" "}
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Unveiled
              </span>
            </h1>
          </div>
        </div>
      </header>

      {/* Content grid */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-3">
        {/* Left Control Panel */}
        <div className="space-y-6 md:col-span-1">
          {/* Upload Terminal */}
          <Card className="border border-border/70 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Upload Terminal</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={onDrop}
                className="group grid place-items-center rounded-md border border-dashed border-border/70 bg-background/60 p-6 text-center transition hover:border-primary"
              >
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Drag & Drop Raw .IMG File Here
                  </div>
                  <div className="text-xs text-muted-foreground">or</div>
                  <Button
                    onClick={onPick}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Upload Raw Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onFiles(e.currentTarget.files)}
                  />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Tip: Use any large grayscale or RGB image; this demo simulates
                the pipeline for the hackathon.
              </div>
            </CardContent>
          </Card>

          {/* Mission Briefing */}
          <Card className="border border-border/70 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Mission Briefing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Our objective is to reconstruct invisible geology from the
              Moon&apos;s Permanently Shadowed Regions. Using a custom-trained
              AI to repaint damaged data, we can identify critical resources
              like water ice—paving the way for future lunar missions.
            </CardContent>
          </Card>

          {/* Technical Schematics */}
          <Card className="border border-border/70 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Technical Schematics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>AI Reconstruction: Stable Diffusion XL + LoRA</li>
                <li>Super-Resolution: SwinIR Transformer</li>
                <li>Pre-processing: CLAHE</li>
                <li>Data Source: ISRO&apos;s Chandrayaan-2</li>
              </ul>
            </CardContent>
          </Card>

          {/* Export Controls */}
          <Card className="border border-border/70 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Export Controls</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={download}
                disabled={!finalUrl}
              >
                Download Reconstructed Image
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Unified Visualizer (Right 2/3) */}
        <div className="space-y-6 md:col-span-2">
          {/* Main visualizer: left locked RAW, right controlled by tabs */}
          <BeforeAfterSlider
            rightStage={rightStage}
            imageMap={imageMap}
            loading={loading}
          />

          {/* Processing Stage Controls */}
          <Card className="border border-border/70 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Processing Stages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <StageTabs value={rightStage} onValueChange={setRightStage} />
              <Separator />
              <p className="text-xs text-muted-foreground">
                Drag the slider to compare, or select a stage to update the
                view.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-xs text-muted-foreground">
          <span>Team: Lunar Unveiled</span>
          <span>{currentTime || "Loading..."}</span>
        </div>
      </footer>
    </main>
  );
}
