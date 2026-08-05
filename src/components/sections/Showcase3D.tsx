"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Eye, RotateCcw, Box, Play } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AssetGallery } from "@/components/ui/AssetGallery";
import { assets3d } from "@/lib/data";
import { clsx } from "clsx";

const ModelViewer = dynamic(
  () => import("@/components/three/ModelViewer").then((mod) => ({ default: mod.ModelViewer })),
  { ssr: false, loading: () => <ModelFallback /> }
);

function ModelFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-bg-secondary rounded-xl">
      <div className="text-center">
        <Box size={32} className="text-text-muted mx-auto mb-2 animate-pulse" />
        <p className="text-text-muted text-sm">Loading 3D Viewer...</p>
      </div>
    </div>
  );
}

/* Fallback carousel for low-power / mobile devices */
function FallbackCarousel({ assets }: { assets: typeof assets3d }) {
  const [active, setActive] = useState(0);
  const viewableAssets = assets.filter((a) => a.modelPath);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % viewableAssets.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [viewableAssets.length]);

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-bg-secondary border border-border-glass">
      {viewableAssets.map((asset, i) => (
        <motion.div
          key={asset.name}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === active ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <RotateCcw
              size={32}
              className="text-accent-cyan mx-auto mb-2 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <p className="text-text-primary font-display font-bold">{asset.name}</p>
            <p className="text-text-muted text-xs mt-1">Drag to rotate · Best on desktop</p>
          </div>
        </motion.div>
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {viewableAssets.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
              i === active ? "bg-accent-cyan" : "bg-text-muted/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function Showcase3D() {
  const [useWebGL, setUseWebGL] = useState(true);
  const [activeAsset, setActiveAsset] = useState(
    assets3d.find((a) => a.featured && a.modelPath) || assets3d.find((a) => a.modelPath) || assets3d[0]
  );

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (isMobile || !gl) setUseWebGL(false);
  }, []);

  const featuredAsset = activeAsset;
  const hasGallery = featuredAsset.gallery && featuredAsset.gallery.length > 0;

  return (
    <section id="showcase" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="3D / VR Showcase"
          subtitle="Game-ready 3D assets, environments, and game projects"
        />

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Asset cards grid */}
          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
            {assets3d.map((asset, i) => (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <GlassCard
                  padding="sm"
                  className={clsx(
                    "h-full cursor-pointer transition-all duration-300",
                    asset.featured && "ring-1 ring-accent-cyan/30 animate-glow-border",
                    activeAsset.name === asset.name && "ring-1 ring-accent-violet/50"
                  )}
                  onClick={() => setActiveAsset(asset)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-bg-secondary border border-border-glass mb-3 flex items-center justify-center relative">
                    {asset.thumbnail && !asset.thumbnail.includes("/images/") ? (
                      <img
                        src={asset.thumbnail}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Eye size={24} className="text-text-muted" />
                    )}
                    {asset.featured && (
                      <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan text-[10px] font-bold border border-accent-cyan/20">
                        FEATURED
                      </span>
                    )}
                    {!asset.modelPath && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-bg-surface/80 text-text-muted text-[10px] border border-border-glass">
                        No 3D export
                      </span>
                    )}
                    {/* Gallery count indicator */}
                    {asset.gallery && asset.gallery.length > 1 && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-accent-violet/10 text-accent-violet text-[10px] font-bold border border-accent-violet/20">
                        {asset.gallery.length} imgs
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-xs font-bold text-text-primary">
                    {asset.name}
                  </h4>
                  <p className="text-text-muted text-[10px] mt-0.5 line-clamp-2">
                    {asset.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className={clsx(
                      "text-[9px] px-1.5 py-0.5 rounded border",
                      asset.category === "blender"
                        ? "bg-accent-green/5 text-accent-green border-accent-green/10"
                        : "bg-accent-violet/5 text-accent-violet border-accent-violet/10"
                    )}>
                      {asset.category === "blender" ? "Blender" : "Unreal"}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Right panel: 3D Viewer or Gallery */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {hasGallery ? (
              <GlassCard padding="sm">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Box size={16} className="text-accent-cyan" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-accent-cyan">
                    {featuredAsset.name}
                  </span>
                  {featuredAsset.gallery!.length > 1 && (
                    <span className="text-text-muted text-[10px] ml-auto">
                      {featuredAsset.gallery!.length} renders
                    </span>
                  )}
                </div>
                <AssetGallery images={featuredAsset.gallery!} aspectRatio={featuredAsset.name === "House" ? "video" : "square"} />
                <div className="mt-3 px-1">
                  <p className="text-text-muted text-xs text-center leading-relaxed">
                    {featuredAsset.description}
                  </p>
                </div>
              </GlassCard>
            ) : (
              <GlassCard padding="sm">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Box size={16} className="text-accent-cyan" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-accent-cyan">
                    Interactive Viewer
                  </span>
                </div>
                <div className="aspect-square">
                  {featuredAsset.modelPath && useWebGL ? (
                    <ModelViewer />
                  ) : featuredAsset.modelPath && !useWebGL ? (
                    <FallbackCarousel assets={assets3d} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-bg-secondary rounded-xl border border-border-glass">
                      <div className="text-center px-4">
                        <Box size={32} className="text-text-muted mx-auto mb-2" />
                        <p className="text-text-primary font-display text-sm font-bold">{featuredAsset.name}</p>
                        <p className="text-text-muted text-xs mt-1">
                          No GLB export available for this model
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 px-1 space-y-1">
                  <p className="text-text-muted text-xs text-center">
                    Viewing: <span className="text-accent-cyan">{featuredAsset.name}</span>
                    {featuredAsset.modelPath ? " · Drag to orbit" : " · Static preview"}
                  </p>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
