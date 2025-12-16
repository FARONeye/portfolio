"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

const TO_EMAIL = "mathis.truong95@gmail.com";

function buildGmailComposeUrl(to: string, subject: string, body: string) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function buildMailtoUrl(to: string, subject: string, body: string) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${to}?${params.toString()}`;
}

export default function ContactSection() {
  const t = useTranslations("contact");

  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");

  const subject = useMemo(() => {
    const n = name.trim();
    return n ? t("subjectWithName", { name: n }) : t("subject");
  }, [name, t]);

  const body = useMemo(() => {
    const parts = [
      `${t("form.nameLabel")}: ${name || "—"}`,
      `${t("form.emailLabel")}: ${fromEmail || "—"}`,
      "",
      t("form.messageLabel") + ":",
      message || "—",
    ];
    return parts.join("\n");
  }, [name, fromEmail, message, t]);

  const handleOpenGmail = () => {
    // ✅ Ouvre Gmail (si connecté) avec le mail prérempli
    const url = buildGmailComposeUrl(TO_EMAIL, subject, body);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleMailtoFallback = () => {
    // ✅ Fallback universel
    window.location.href = buildMailtoUrl(TO_EMAIL, subject, body);
  };

  return (
    <section
      id="contact"
      className={[
        "relative bg-linear-to-b from-[#110011] to-black",
        // ✅ important: section pleine hauteur => visible même en bas de page
        "min-h-[100dvh] flex items-center",
        // ✅ safe-area + marge pour éviter le “coupé” en fin de scroll
        "py-24 pb-[calc(env(safe-area-inset-bottom,0px)+120px)]",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <ScrollReveal from={{ opacity: 0, y: 20 }} to={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal from={{ opacity: 0, y: 20 }} to={{ opacity: 1, y: 0 }}>
          <p className="text-[#b3b3b3] mb-10">{t("subtitle")}</p>
        </ScrollReveal>

        {/* ✅ Form */}
        <div className="mx-auto max-w-xl text-left">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-xs text-white/60 font-mono tracking-widest uppercase">
                {t("form.nameLabel")}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("form.namePlaceholder")}
                className="w-full rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md px-4 py-3 text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-xs text-white/60 font-mono tracking-widest uppercase">
                {t("form.emailLabel")}
              </label>
              <input
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder={t("form.emailPlaceholder")}
                inputMode="email"
                className="w-full rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md px-4 py-3 text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-xs text-white/60 font-mono tracking-widest uppercase">
                {t("form.messageLabel")}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("form.messagePlaceholder")}
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md px-4 py-3 text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                type="button"
                onClick={handleOpenGmail}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(155,28,49,.45)",
                }}
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#9B1C31] to-[#6C1E80] px-8 py-3 font-semibold text-white"
              >
                {t("ctaGmail")}
              </motion.button>

              <button
                type="button"
                onClick={handleMailtoFallback}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 font-semibold text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                {t("ctaMailto")}
              </button>
            </div>

            <p className="pt-3 text-xs text-white/35 text-center">
              {t("note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
