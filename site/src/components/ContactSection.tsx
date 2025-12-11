"use client";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function ContactSection(){
  return (
    <section id="contact" className="relative py-28 bg-linear-to-b from-[#110011] to-black">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal from={{opacity:0,y:20}} to={{opacity:1,y:0}}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">Entrons en contact</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal from={{opacity:0,y:20}} to={{opacity:1,y:0}}>
          <p className="text-[#b3b3b3] mb-8">Une idée, un projet, ou juste l’envie de créer quelque chose de beau&nbsp;?</p>
        </ScrollReveal>
        <motion.a
          href="mailto:mathis.truong95@gmail.com"
          whileHover={{ scale:1.05, boxShadow: "0 0 30px rgba(155,28,49,.45)" }}
          className="inline-block rounded-full bg-linear-to-r from-[#9B1C31] to-[#6C1E80] px-8 py-3 font-semibold"
        >
          Me contacter
        </motion.a>
      </div>
    </section>
  );
}
