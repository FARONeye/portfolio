"use client";
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const skills = [
  "Next.js","TypeScript","Tailwind","Framer Motion","React Native",
  "Node.js","Prisma","PostgreSQL","Figma","Three.js"
];

export default function SkillsSection(){
  return (
    <section id="skills" className="py-24 bg-[#0a0a0b] border-y border-white/10">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal from={{opacity:0,y:16}} to={{opacity:1,y:0}} className="mb-10 text-4xl font-bold">
          <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">Compétences</span>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {skills.map((s,i)=>(
            <ScrollReveal key={i} from={{opacity:0, scale:.85}} to={{opacity:1, scale:1}}>
              <motion.div whileHover={{ scale:1.08, rotate:2 }} className="rounded-3xl h-28 flex items-center justify-center text-center bg-gradient-to-br from-[#9B1C31]/20 to-[#6C1E80]/20 border border-white/10 shadow-xl glow-violet">
                <span className="font-semibold">{s}</span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
