"use client";
import ProjectCard from "./ProjectCard";
import ScrollReveal from "./ScrollReveal";

const projects = [
  { title: "STYX",        subtitle: "App de matchs communautaires", imageUrl: "/styx-logo.webp",      href: "/projects/styx" },
  { title: "ECHO NOIR",   subtitle: "Expérience audiovisuelle",      imageUrl: "/echo-noir.webp",     href: "/projects/echo-noir" },
  { title: "E-SPORTWEAR", subtitle: "Marque techwear pour gamers",   imageUrl: "/esportwear.webp",    href: "/projects/esportwear" },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="border-t border-white/10 bg-gradient-to-b from-black via-[#0a0a0b] to-[#110011] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal from={{ opacity:0, y:16 }} to={{ opacity:1, y:0 }} className="mb-12 text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
            Projets en lumière
          </span>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={i} index={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
