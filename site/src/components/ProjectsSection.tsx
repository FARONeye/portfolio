"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectCard, { type ProjectCardData } from "./ProjectCard";
import TeleportFX from "./TeleportFX";

export default function ProjectsSection() {
  const router = useRouter();

  const projects: ProjectCardData[] = useMemo(
    () => [
      {
        title: "Styx Mobile",
        subtitle: "Application pour rejoindre des matchs de foot",
        imageUrl: "/styx-logo.webp",
        href: "/projets/styx",
        index: 1,
        kind: "MOBILE",
        year: "2025",
        stack: ["React Native", "Symfony API", "MySQL", "UX Flow"],
        accentFrom: "#1F2A92",
        accentVia: "#6C1E80",
        accentTo: "#F472B6",
      },
      {
        title: "ECHO NOIR",
        subtitle: "Expérience 3D immersive & direction artistique sombre",
        imageUrl: "/echo-noir.webp",
        href: "/projets/echo-noir",
        index: 0,
        kind: "IMMERSIVE",
        year: "2024",
        stack: ["Next.js", "R3F", "Framer Motion", "DA / Lighting"],
        accentFrom: "#9B1C31",
        accentVia: "#6C1E80",
        accentTo: "#FFFFFF",
      },
      {
        title: "Esportwear",
        subtitle: "E-commerce (Next + Stripe)",
        imageUrl: "/esportwear.webp",
        href: "/projets/esportwear",
        index: 2,
        kind: "COMMERCE",
        year: "2024",
        stack: ["Next.js", "Stripe", "UI System", "SEO"],
        accentFrom: "#0B3A6B",
        accentVia: "#C084FC",
        accentTo: "#9B1C31",
      },
    ],
    []
  );

  // index de la carte active (celui de tes ProjectCardData.index)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [teleportHref, setTeleportHref] = useState<string | null>(null);

  const activeProject =
    activeIndex === null
      ? null
      : projects.find((p) => p.index === activeIndex) ?? null;

  const handleEnter = (href: string) => setTeleportHref(href);
  const handleBack = () => setActiveIndex(null);

  return (
    <section id="projects" className="relative bg-[#0A0A0B] py-24 overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 cinematic-vignette opacity-80" />
      <div className="pointer-events-none absolute inset-0 cinematic-grain opacity-55" />

      {/* Subtle nebula */}
      <div className="pointer-events-none absolute -top-40 left-[-10%] h-[520px] w-[520px] rounded-full blur-3xl opacity-30 [background:radial-gradient(circle_at_center,rgba(155,28,49,0.35),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-52 right-[-10%] h-[560px] w-[560px] rounded-full blur-3xl opacity-25 [background:radial-gradient(circle_at_center,rgba(108,30,128,0.35),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-4 text-[10px] tracking-[0.42em] text-white/40 font-mono uppercase">
            <span>PROJECT SHOWCASE</span>
            <span className="h-[1px] w-14 bg-white/10" />
            <span>{activeIndex === null ? "GRID" : "FOCUS"}</span>
          </div>

          <h2 className="mt-4 text-5xl sm:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
              Projets
            </span>
          </h2>

          <p className="mt-3 max-w-2xl text-white/60">
            {activeIndex === null
              ? "Clique sur une carte pour la mettre en avant (mode focus)."
              : "Mode focus : la carte prend toute la scène, sans overlay."}
          </p>
        </div>

        {/* ZONE CARDS */}
        <motion.div layout className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            {/* Mode GRID */}
            {activeIndex === null && (
              <motion.div
                key="grid"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid gap-6 lg:grid-cols-[1.35fr_.85fr] lg:gap-8"
              >
                {/* Featured à gauche */}
                <div className="min-h-[420px] sm:min-h-[520px]">
                  <ProjectCard
                    data={projects[0]}
                    variant="featured"
                    mode="grid"
                    onOpen={(i) => setActiveIndex(i)}
                    onEnter={handleEnter}
                  />
                </div>

                {/* Side à droite */}
                <div className="grid gap-6">
                  <div className="min-h-[240px] sm:min-h-[250px]">
                    <ProjectCard
                      data={projects[1]}
                      variant="side"
                      mode="grid"
                      onOpen={(i) => setActiveIndex(i)}
                      onEnter={handleEnter}
                    />
                  </div>
                  <div className="min-h-[240px] sm:min-h-[250px]">
                    <ProjectCard
                      data={projects[2]}
                      variant="side"
                      mode="grid"
                      onOpen={(i) => setActiveIndex(i)}
                      onEnter={handleEnter}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Mode FOCUS (in-place, sans overlay) */}
            {activeIndex !== null && activeProject && (
              <motion.div
                key="focus"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="min-h-[520px] sm:min-h-[640px]"
              >
                <ProjectCard
                  data={activeProject}
                  variant="focus"
                  mode="focus"
                  onBack={handleBack}
                  onEnter={handleEnter}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Teleportation FX */}
      <TeleportFX
        running={teleportHref !== null}
        duration={1.5}
        onDone={() => {
          const target = teleportHref;
          setTeleportHref(null);
          if (target) router.push(target);
        }}
      />
    </section>
  );
}
