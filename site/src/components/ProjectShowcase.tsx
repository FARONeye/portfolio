"use client";
import { motion } from "framer-motion";

const projects = [
  { title: "STYX", desc: "App communautaire de matchs de foot", img: "/styx-logo.webp", link: "/projects/styx" },
  { title: "ECHO NOIR", desc: "Expérience audiovisuelle futuriste", img: "/echo-noir.webp", link: "/projects/echo-noir" },
  { title: "E-SPORTWEAR", desc: "Marque techwear pour gamers", img: "/esportwear.webp", link: "/projects/esportwear" },
];

export default function ProjectShowcase() {
  return (
    <section className="py-28 bg-gradient-to-b from-black via-[#0a0a0b] to-[#110011]">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-5xl font-bold mb-16 bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
          Projets en lumière
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {projects.map((p, i) => (
            <motion.a
              key={i}
              href={p.link}
              whileHover={{ scale: 1.05, rotateY: 2 }}
              className="relative group rounded-3xl overflow-hidden bg-[#111]/70 border border-[#4B0D1A]/40 shadow-lg"
            >
              <motion.img
                src={p.img}
                alt={p.title}
                className="h-56 w-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4B0D1A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute bottom-6 left-6 text-left">
                <h3 className="text-2xl font-semibold text-white">{p.title}</h3>
                <p className="text-sm text-[#b3b3b3]">{p.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
