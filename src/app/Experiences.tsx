import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { airLiquide, experiences } from "./content";

/* 02 — Experiences, played as one pinned sequence of scenes. motion.js gives every scene
   --enter, --inner and --leave; each scene composes them into its own transition and story.
   Every company opens with its own chapter page, so the visitor always knows where they are.
   Without motion, the scenes simply stack as a readable page. */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const [current, trady] = experiences;
const companies = ["Air Liquide", "Trady"];
const projectName = "Application interne de double authentification";

// Illustrative codes only: the real ones are never shown anywhere.
const demoCodes = ["482 913", "106 557", "730 284", "915 046", "268 731", "054 619", "397 802", "641 375", "823 190", "179 468"];

type Node = { id: string; x: number; y: number };
type Link = [string, string, "data" | "log"];
const nodeIndex = (id: string) => airLiquide.architecture.findIndex((node) => node.id === id);
// The same architecture, drawn twice: a wide layout for desktop and a tall one for phones.
const layouts: { className: string; box: [number, number]; size: [number, number]; nodes: Node[] }[] = [
  {
    className: "xp-arch-wide", box: [940, 540], size: [196, 84],
    nodes: [
      { id: "user", x: 110, y: 100 }, { id: "okta", x: 350, y: 100 }, { id: "google", x: 590, y: 100 }, { id: "front", x: 830, y: 100 },
      { id: "admin", x: 350, y: 280 }, { id: "firestore", x: 590, y: 280 }, { id: "functions", x: 830, y: 280 }, { id: "bigquery", x: 830, y: 450 },
    ],
  },
  {
    className: "xp-arch-tall", box: [360, 520], size: [150, 76],
    nodes: [
      { id: "user", x: 92, y: 50 }, { id: "okta", x: 268, y: 50 }, { id: "front", x: 92, y: 180 }, { id: "google", x: 268, y: 180 },
      { id: "functions", x: 92, y: 310 }, { id: "firestore", x: 268, y: 310 }, { id: "bigquery", x: 92, y: 450 }, { id: "admin", x: 268, y: 450 },
    ],
  },
];
// Drawn in the order the scroll reveals them, matching the numbered legend.
const links: Link[] = [["user", "okta", "data"], ["okta", "google", "data"], ["google", "front", "data"], ["front", "functions", "data"], ["functions", "firestore", "data"], ["functions", "bigquery", "log"], ["admin", "firestore", "data"]];
const legend = [
  "Okta reconnaît la session de l’entreprise.",
  "Google Sign-In confirme l’identité du collaborateur.",
  "L’interface envoie chaque requête avec un jeton sécurisé.",
  "Mes Cloud Functions vérifient les droits dans Firestore.",
  "Chaque action est journalisée dans BigQuery.",
];

// A straight connector from the edge of one box to the edge of the next.
function connector(from: Node, to: Node, [w, h]: [number, number]) {
  if (from.y === to.y) {
    const direction = Math.sign(to.x - from.x);
    return `M${from.x + direction * w / 2} ${from.y} H${to.x - direction * w / 2}`;
  }
  if (from.x === to.x) {
    const direction = Math.sign(to.y - from.y);
    return `M${from.x} ${from.y + direction * h / 2} V${to.y - direction * h / 2}`;
  }
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  return `M${from.x + dx * w / 2} ${from.y} H${to.x} V${to.y - dy * h / 2}`;
}

function Architecture() {
  return (
    <>
      {layouts.map(({ className, box, size, nodes }) => {
        const at = (id: string) => nodes.find((node) => node.id === id)!;
        return (
          <svg key={className} className={`xp-arch ${className}`} viewBox={`0 0 ${box[0]} ${box[1]}`} aria-hidden="true">
            {links.map(([from, to, kind], k) => {
              const d = connector(at(from), at(to), size);
              return (
                <g className={`xp-link xp-link-${kind}`} key={`${from}-${to}`} style={v({ "--k": k })}>
                  <path d={d} pathLength={100} />
                  <circle r="4"><animateMotion dur={`${1.6 + k * .2}s`} repeatCount="indefinite" path={d} /></circle>
                </g>
              );
            })}
            {nodes.map((node) => {
              const meta = airLiquide.architecture[nodeIndex(node.id)];
              const order = ["user", "okta", "google", "front", "functions", "firestore", "bigquery", "admin"].indexOf(node.id);
              return (
                <g className={`xp-node xp-node-${node.id}`} key={node.id} transform={`translate(${node.x} ${node.y})`} style={v({ "--k": order })}>
                  <rect x={-size[0] / 2} y={-size[1] / 2} width={size[0]} height={size[1]} rx="12" />
                  <text className="xp-node-label" y="-4">{meta.label}</text>
                  <text className="xp-node-detail" y="18">{meta.detail}</text>
                </g>
              );
            })}
          </svg>
        );
      })}
    </>
  );
}

// Every project scene carries the same banner: this is the app Mathis built, step k of 5.
function ProjectTag({ step }: { step: number }) {
  return (
    <p className="xp-project-tag">
      <span>Le projet que j’ai réalisé</span>
      <b>{projectName}</b>
      <i>Étape {step} / 5</i>
    </p>
  );
}

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
const weights = { intro: 1, cover: 1.1, role: 1.2, problem: 1, arch: 1.3, otp: 1.4, access: 1.3, ops: 1.2, result: 1.1, trady: 1.3 };
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
            <h3>J’ai créé une application interne <em>pour Air Liquide.</em></h3>
            <p>Une application de double authentification qui sécurise l’accès aux comptes techniques partagés de l’entreprise. Je l’ai conçue, développée, déployée et documentée.</p>
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

        {/* 02 — my role at Air Liquide: what I did, what I brought. */}
        <article className="xp-scene xp-s-role xp-t-side" data-xp-scene data-company="0" data-weight={weights.role} data-label="Air Liquide · Mon rôle">
          <div className="xp-copy">
            <span className="xp-kicker">Air Liquide · Mon rôle</span>
            <h3>En charge du projet, <em>de l’idée à la production.</em></h3>
            <Contribution did={current.did} brought={current.brought} />
          </div>
          <div className="xp-visual xp-role-photos">
            {airLiquide.gallery.map((photo, k) => (
              <figure key={photo.image} style={v({ "--k": k })}>
                <Image src={photo.image} alt={photo.alt} fill sizes="(max-width: 760px) 50vw, 26vw" />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
            <span className="xp-role-next">Le projet en 5 étapes ↓</span>
          </div>
        </article>

        {/* 03 — project step 1: the situation before the app. */}
        <article className="xp-scene xp-s-problem xp-project" data-xp-scene data-company="0" data-weight={weights.problem} data-label="Air Liquide · Projet 1/5 · Le point de départ">
          <div className="xp-copy">
            <ProjectTag step={1} />
            <h3>Le point de départ : <em>des codes qui circulaient à la main.</em></h3>
            <ul>{airLiquide.problem.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <p className="xp-question">{airLiquide.problem.question}</p>
          </div>
          <div className="xp-visual xp-sheet" aria-hidden="true">
            <div className="xp-frame-bar"><span>Avant · le tableur de partage</span><i>Illustration</i></div>
            <div className="xp-sheet-grid">
              <div className="xp-sheet-row xp-sheet-head"><span>Compte technique</span><span>Utilisateurs</span><span>Code 2FA</span></div>
              {["ta-reporting@…", "ta-deploy@…", "ta-monitoring@…", "ta-backup@…", "ta-billing@…"].map((account, k) => (
                <div className="xp-sheet-row" key={account} style={v({ "--k": k })}>
                  <span>{account}</span><span>{["jdupont, amartin…", "équipe infra", "?", "à demander", "voir mail"][k]}</span><span>{demoCodes[k + 3]}</span>
                </div>
              ))}
            </div>
            {["« Tu peux m’envoyer le code ? »", "« Qui a accès à ce compte ? »", "« Le code a expiré… »"].map((bubble, k) => (
              <span className="xp-bubble" key={bubble} style={v({ "--k": k })}>{bubble}</span>
            ))}
            <span className="xp-sheet-stamp">À remplacer</span>
          </div>
        </article>

        {/* 04 — project step 2: the architecture I designed. */}
        <article className="xp-scene xp-s-arch xp-project xp-t-iris" data-xp-scene data-company="0" data-weight={weights.arch} data-label="Air Liquide · Projet 2/5 · L’architecture">
          <div className="xp-copy">
            <ProjectTag step={2} />
            <h3>L’architecture <em>que j’ai conçue.</em></h3>
            <ol className="xp-legend">{legend.map((step, k) => <li key={step} style={v({ "--k": k })}><b>{k + 1}</b>{step}</li>)}</ol>
          </div>
          <div className="xp-visual">
            <Architecture />
          </div>
        </article>

        {/* 05 — project step 3: the one-time codes I implemented. */}
        <article className="xp-scene xp-s-otp xp-project xp-t-side" data-xp-scene data-company="0" data-weight={weights.otp} data-otp data-label="Air Liquide · Projet 3/5 · Les codes">
          <div className="xp-copy">
            <ProjectTag step={3} />
            <h3>J’ai développé la génération <em>des codes à usage unique.</em></h3>
            <p>Le collaborateur clique, mes fonctions vérifient son identité et ses droits, puis calculent ses codes côté serveur. Le secret ne quitte jamais le back-end ; l’écran affiche le code du moment et un anneau qui se vide toutes les 30 secondes.</p>
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

        {/* 06 — project step 4: the delegated access management I built. */}
        <article className="xp-scene xp-s-access xp-project xp-t-diag" data-xp-scene data-company="0" data-weight={weights.access} data-label="Air Liquide · Projet 4/5 · Les droits">
          <div className="xp-copy">
            <ProjectTag step={4} />
            <h3>J’ai rendu les équipes <em>autonomes sur leurs accès.</em></h3>
            <ol className="xp-access-steps">
              {airLiquide.accessSteps.map((step, k) => <li key={step.title} style={v({ "--k": k })}><b>{step.title}</b><span>{step.text}</span></li>)}
            </ol>
          </div>
          <div className="xp-visual xp-access" aria-hidden="true">
            <div className="xp-access-orbit">
              <span className="xp-access-account">ta-reporting@…</span>
              {["JD", "AM", "SK", "PL", "LM"].map((initials, k) => (
                <span className={`xp-avatar xp-avatar-${k}`} key={initials} style={v({ "--k": k })}><i />{initials}</span>
              ))}
            </div>
            <div className="xp-access-panel">
              <span>Gérer les utilisateurs</span>
              <p className="xp-access-input"><em>l.martin@…</em><b>Ajouter</b></p>
            </div>
            <div className="xp-access-modal"><span>Retirer p.lefevre@… ?</span><b>Confirmer</b></div>
            <div className="xp-access-admin"><b>Console d’administration</b><span>🔒 sans accès au projet Google Cloud</span></div>
          </div>
        </article>

        {/* 07 — project step 5: traceability and deployment I set up. */}
        <article className="xp-scene xp-s-ops xp-project xp-t-iris" data-xp-scene data-company="0" data-weight={weights.ops} data-label="Air Liquide · Projet 5/5 · Traçabilité">
          <div className="xp-copy">
            <ProjectTag step={5} />
            <h3>J’ai rendu chaque action traçable, <em>sans jamais exposer un code.</em></h3>
            <p>J’ai mis en place des journaux structurés analysés dans BigQuery, et des environnements de test et de production séparés pour valider chaque évolution avant sa mise en ligne.</p>
          </div>
          <div className="xp-visual xp-ops" aria-hidden="true">
            <div className="xp-bq">
              <div className="xp-frame-bar"><span>Journal des actions · BigQuery</span><i>Illustration</i></div>
              <div className="xp-bq-head"><span>Niveau</span><span>Évènement</span><span>Détail</span></div>
              {airLiquide.logs.map((log, k) => (
                <div className={`xp-bq-row xp-bq-${log.level.toLowerCase()}`} key={`${log.event}-${k}`} style={v({ "--k": k })}>
                  <span>{log.level}</span><span>{log.event}</span><span>{log.detail}</span>
                </div>
              ))}
            </div>
            <div className="xp-envs">
              {airLiquide.environments.map((env, k) => <span key={env} style={v({ "--k": k })}>{env}</span>)}
              <i className="xp-envs-package" />
            </div>
          </div>
        </article>

        {/* 08 — what I brought to Air Liquide. */}
        <article className="xp-scene xp-s-result xp-t-band" data-xp-scene data-company="0" data-weight={weights.result} data-label="Air Liquide · Ce que j’ai apporté">
          <span className="xp-kicker">Air Liquide · Bilan</span>
          <h3>Ce que j’ai apporté <em>à Air Liquide.</em></h3>
          <ul className="xp-brought">{current.brought.map((item, k) => <li key={item} style={v({ "--k": k })}><b>0{k + 1}</b>{item}</li>)}</ul>
          <ul className="xp-skills">{airLiquide.skills.map((skill, k) => <li key={skill} style={v({ "--k": k, "--a": `${(k * 137) % 360}deg` })}>{skill}</li>)}</ul>
        </article>

        {/* 09 — Trady: a new chapter, a redesign revealed by a wipe. */}
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
