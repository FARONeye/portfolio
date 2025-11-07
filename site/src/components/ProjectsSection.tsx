"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectCard, { type ProjectCardProps } from "./ProjectCard";
import TeleportFX from "./TeleportFX";

function FocusView({
  project,
  index,
  onClose,
  onEnter,
}: {
  project: ProjectCardProps;
  index: number;
  onClose: () => void;
  onEnter: (href: string) => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 grid place-items-center p-6">
        <motion.div
          layoutId={`card-${index}`}
          className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60"
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
        >
          <motion.div className="relative h-[240px] sm:h-[300px] md:h-[360px]">
            <motion.img
              layoutId={`image-${index}`}
              src={project.imageUrl}
              alt={project.title}
              className="absolute inset-0 m-auto h-[70%] w-auto object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </motion.div>

          <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_.8fr]">
            <div>
              <h3 className="text-3xl font-bold text-white">{project.title}</h3>
              <p className="mt-2 text-zinc-300">{project.subtitle}</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li>• Stack : Next.js, React Three Fiber, Framer Motion</li>
                <li>• Rôle : Design & Intégration</li>
                <li>• Objectif : Expérience interactive & performante</li>
              </ul>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <button
                onClick={() => onEnter(project.href)}
                className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200 transition"
              >
                Entrez dans ce projet
              </button>
              <button
                onClick={onClose}
                className="rounded-full border border-white/20 px-5 py-2 text-zinc-200 hover:bg-white/10 transition"
              >
                Retour
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const router = useRouter();

  const projects: ProjectCardProps[] = useMemo(
    () => [
      {
        title: "ECHO NOIR",
        subtitle: "Expérience 3D immersive & direction artistique sombre",
        imageUrl: "/echo-noir.webp",
        href: "/projets/echo-noir",
        index: 0,
      },
      {
        title: "Styx Mobile",
        subtitle: "Application pour rejoindre des matchs de foot",
        imageUrl: "/styx-logo.webp",
        href: "/projets/styx",
        index: 1,
      },
      {
        title: "Esportwear",
        subtitle: "E-commerce (Next + Stripe)",
        imageUrl: "/esportwear.webp",
        href: "/projets/esportwear",
        index: 2,
      },
    ],
    []
  );

  const [active, setActive] = useState<number | null>(null);
  const [teleportHref, setTeleportHref] = useState<string | null>(null);

  // Bloque le scroll si focus
  useEffect(() => {
    if (active !== null) {
      const { style } = document.documentElement;
      const prev = style.overflow;
      style.overflow = "hidden";
      return () => {
        style.overflow = prev;
      };
    }
  }, [active]);

  const handleEnter = (href: string) => {
    setTeleportHref(href);
  };

  return (
    <section id="projects" className="bg-[#0A0A0B] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 text-3xl font-bold text-white">Projets</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <AnimatePresence key={i} mode="popLayout">
              {active === null ? (
                <ProjectCard {...p} onOpen={setActive} />
              ) : active === i ? (
                <div className="h-72 w-full rounded-3xl border border-transparent" />
              ) : null}
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* Vue focus */}
      <AnimatePresence>
        {active !== null && (
          <FocusView
            project={projects[active]}
            index={active}
            onClose={() => setActive(null)}
            onEnter={handleEnter}
          />
        )}
      </AnimatePresence>

      {/* Teleportation FX (cinématique) */}
      <TeleportFX
        running={teleportHref !== null}
        onDone={() => {
          const target = teleportHref;
          setTeleportHref(null);
          if (target) router.push(target);
        }}
        duration={1.0} // ← allonge un peu si tu veux (0.9–1.2)
      />
    </section>
  );
}
