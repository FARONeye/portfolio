import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { airLiquide, experiences } from "./content";

/* 02 — Experiences, played as one pinned sequence of scenes. motion.js gives every scene
   --enter, --inner and --leave; each scene composes them into its own transition and story.
   Every company opens with its own chapter page, so the visitor always knows where they are.
   Air Liquide holds four scenes: the company, the 2FA app, the IT automation, then the outcome.
   Without motion, the scenes simply stack as a readable page. */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const [current, trady] = experiences;
const companies = ["Air Liquide", "Trady"];
// Illustrative codes only: the real ones are never shown anywhere.
const demoCodes = ["482 913", "106 557", "730 284", "915 046", "268 731", "054 619", "397 802", "641 375", "823 190", "179 468"];

// "Ce que j'ai fait" / "Ce que j'ai apporté", the core of every experience.
function Contribution({ did, brought }: { did: string[]; brought: string[] }) {
  return (
    <div className="xp-contrib">
      <div>
        <span>Ce que j’ai fait</span>
        <ul>{did.map((item, k) => <li key={item} style={v({ "--k": k })}>{item}</li>)}</ul>
      </div>
      <div>
        <span>Ce que j’ai apporté</span>
        <ul>{brought.map((item, k) => <li key={item} style={v({ "--k": k + did.length })}>{item}</li>)}</ul>
      </div>
    </div>
  );
}

// The opening of a company's chapter: a flash with its name, then its number and identity.
function CompanyHead({ index, name, job }: { index: number; name: string; job: (typeof experiences)[number] }) {
  return (
    <header className="xp-company-head">
      <span className="xp-company-number">Expérience professionnelle {String(index + 1).padStart(2, "0")} <small>/ 0{experiences.length}</small></span>
      <h3>{name}</h3>
      <p>{job.role} · {job.years.split(" · ")[0]} · {job.place}</p>
    </header>
  );
}

function Flash({ color, children }: { color: string; children: ReactNode }) {
  return <span className="jb-flash xp-flash" aria-hidden="true" style={v({ "--brand": color })}>{children}</span>;
}

// How long each scene holds the screen; the journey's height is derived from their sum.
const weights = { intro: 1, cover: 1.1, app: 1.5, automation: 1.3, role: 1.3, trady: 1.3 };
const units = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

export default function Experiences() {
  return (
    <section id="experiences" className="xp-journey xp-pro" data-xp-journey aria-labelledby="xp-title" style={v({ "--xp-units": units })}>
      <div className="xp-sticky">
        <div className="xp-hud" aria-hidden="true">
          <span className="xp-hud-company">02 / Expériences pro</span>
          <ol className="xp-hud-companies">
            {companies.map((name, k) => <li key={name} data-hud-company={k}><b>0{k + 1}</b>{name}</li>)}
          </ol>
          <b className="xp-hud-step">Vue d’ensemble</b>
          <i><b /></i>
        </div>

        {/* 00 — the career at a glance, as an elegant timeline. */}
        <article className="xp-scene xp-s-intro" data-xp-scene data-weight={weights.intro} data-label="Vue d’ensemble">
          <div className="xp-copy">
            <span className="eyebrow">02 / Expériences professionnelles</span>
            <h2 id="xp-title">Mes expériences<br /><em>professionnelles.</em></h2>
            <p>Deux expériences en développement web, dont mon alternance chez Air Liquide, toujours en cours. Pour chacune : ce que j’y ai fait, et ce que j’ai apporté à l’entreprise.</p>
          </div>
          <ol className="xp-timeline">
            {experiences.map((job, k) => (
              <li key={job.hash} className={job.current ? "is-current" : undefined} style={v({ "--k": k })}>
                <span className="xp-timeline-years">{job.years.split(" · ")[0]}</span>
                <i aria-hidden="true" />
                <div>
                  <strong>{companies[k]}</strong>
                  <span>{job.role}</span>
                </div>
                {job.current && <em>En poste</em>}
              </li>
            ))}
          </ol>
        </article>

        {/* 01 — Air Liquide opens over La Défense: I created an internal application. */}
        <article className="xp-scene xp-s-cover xp-t-band" data-xp-scene data-company="0" data-weight={weights.cover} data-label="Air Liquide · Présentation">
          <Flash color="#ffffff"><Image src={airLiquide.logo} alt="" width={354} height={68} unoptimized /></Flash>
          <figure className="xp-cover-photo">
            <Image src={airLiquide.cover.image} alt={airLiquide.cover.alt} fill sizes="100vw" />
          </figure>
          <div className="xp-cover-copy">
            <span className="xp-company-number">Expérience professionnelle 01 <small>/ 0{experiences.length}</small></span>
            <span className="xp-logo"><Image src={airLiquide.logo} alt="Air Liquide" width={354} height={68} unoptimized /></span>
            <p className="xp-cover-role"><span className="xp-badge">● En poste</span>{current.role} · {current.years} · {current.place}</p>
            <h3>Développeur full-stack <em>au service IT d’Air Liquide.</em></h3>
            <p>J’y ai créé une application interne de double authentification, de la conception à la production, et j’automatise des tâches lourdes pour le service IT.</p>
          </div>
          <dl className="xp-stats">
            {airLiquide.stats.map((stat) => (
              <div key={stat.label}>
                <dt data-count={stat.value} data-suffix={stat.suffix}>{stat.value}{stat.suffix}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
          <p className="xp-credits">
            Photos via Wikimedia Commons :{" "}
            {airLiquide.credits.map((credit, k) => (
              <span key={credit.href}>{k > 0 && " · "}<a href={credit.href} target="_blank" rel="noopener noreferrer">{credit.label}</a></span>
            ))}
          </p>
        </article>

        {/* 02 — mission 1: the 2FA app, its five steps on one scene, and the one-time codes it serves. */}
        <article className="xp-scene xp-s-otp xp-t-side" data-xp-scene data-company="0" data-weight={weights.app} data-otp data-label="Air Liquide · Mission 1 · Application 2FA">
          <div className="xp-copy">
            <span className="xp-kicker">Air Liquide · Mission 01</span>
            <h3>Une application de double authentification, <em>de l’idée à la production.</em></h3>
            <ol className="xp-app-steps">
              {airLiquide.appSteps.map((step, k) => <li key={step.title} style={v({ "--k": k })}><b>{step.title}</b><span>{step.text}</span></li>)}
            </ol>
          </div>
          <div className="xp-visual xp-otp" aria-hidden="true">
            <div className="xp-otp-app">
              <div className="xp-frame-bar"><span>L’application · comptes techniques</span><i>Illustration</i></div>
              {["ta-reporting@…", "ta-deploy@…", "ta-monitoring@…"].map((account, k) => (
                <div className={`xp-otp-account${k === 0 ? " is-selected" : ""}`} key={account}>
                  <span>{account}</span><b>{k === 0 ? "Afficher le code" : "•••"}</b>
                </div>
              ))}
            </div>
            <ol className="xp-otp-steps">
              {airLiquide.otpSteps.map((step, k) => <li key={step} style={v({ "--k": k })}><i>{k === 2 ? "🔒" : "✓"}</i>{step}</li>)}
            </ol>
            <div className="xp-otp-code">
              <span className="xp-otp-ring" />
              <div className="xp-otp-slot"><div className="xp-otp-reel">{demoCodes.map((code) => <b key={code}>{code}</b>)}</div></div>
              <small>codes d’exemple</small>
            </div>
          </div>
        </article>

        {/* 03 — mission 2: heavy, repetitive IT tasks turned into scripts. Each task's manual bar shrinks to an automated run. */}
        <article className="xp-scene xp-s-auto xp-t-diag" data-xp-scene data-company="0" data-weight={weights.automation} data-label="Air Liquide · Mission 2 · Automatisation IT">
          <div className="xp-copy">
            <span className="xp-kicker">Air Liquide · Mission 02</span>
            <h3>J’automatise les tâches lourdes <em>du service IT.</em></h3>
            <p>{airLiquide.automation.text}</p>
            <ul>{airLiquide.automation.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
          <div className="xp-visual xp-auto" aria-hidden="true">
            <div className="xp-frame-bar"><span>Service IT · tâches automatisées</span><i>Illustration</i></div>
            <div className="xp-auto-rows">
              {airLiquide.automation.tasks.map((task, k) => (
                <div className="xp-auto-row" key={task} style={v({ "--k": k })}>
                  <span>{task}</span>
                  <i className="xp-auto-bar"><b /></i>
                  <span className="xp-auto-tag"><span>À la main</span><span>Automatisé ✓</span></span>
                </div>
              ))}
            </div>
            <div className="xp-auto-term">
              {["$ lancer l’automatisation", ...airLiquide.automation.tasks.map((task) => `✓ ${task.toLowerCase()} · terminé`), "→ du temps rendu à l’équipe IT"].map((line, k) => <code key={line} style={v({ "--k": k })}>{line}</code>)}
            </div>
          </div>
        </article>

        {/* 04 — what I did and what I brought to Air Liquide, in one place. */}
        <article className="xp-scene xp-s-role xp-t-band" data-xp-scene data-company="0" data-weight={weights.role} data-label="Air Liquide · Mon bilan">
          <div className="xp-copy">
            <span className="xp-kicker">Air Liquide · Bilan</span>
            <h3>Ce que j’ai fait, <em>ce que j’ai apporté.</em></h3>
            <Contribution did={current.did} brought={current.brought} />
          </div>
          <div className="xp-visual xp-role-photos">
            {airLiquide.gallery.map((photo, k) => (
              <figure key={photo.image} style={v({ "--k": k })}>
                <Image src={photo.image} alt={photo.alt} fill sizes="(max-width: 760px) 50vw, 26vw" />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </article>

        {/* 05 — Trady: a new chapter, a redesign revealed by a wipe. */}
        <article className="xp-scene xp-s-trady xp-company xp-t-side" data-xp-scene data-company="1" data-weight={weights.trady} data-label={`Trady · ${trady.years}`}>
          <Flash color="#3faaa5"><b className="xp-flash-name">Trady</b></Flash>
          <div className="xp-copy">
            <CompanyHead index={1} name={companies[1]} job={trady} />
            <Contribution did={trady.did} brought={trady.brought} />
          </div>
          <div className="xp-visual xp-redesign" aria-hidden="true">
            <div className="xp-frame-bar"><span>La refonte que j’ai réalisée</span><i>Illustration</i></div>
            <div className="xp-redesign-stage">
              <div className="xp-ui xp-ui-before"><i /><i /><i /><i /><i /><i /><b>bug</b><b>bug</b><b>bug</b></div>
              <div className="xp-ui xp-ui-after"><span className="xp-ui-nav" /><strong>Une interface claire</strong><span className="xp-ui-line" /><span className="xp-ui-line" /><div className="xp-ui-cards"><i /><i /><i /></div><span className="xp-ui-cta">Commencer</span></div>
              <span className="xp-redesign-handle"><i>Avant</i><i>Après</i></span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
