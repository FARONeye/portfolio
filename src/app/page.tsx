/* Native navigation gives the scroll narrative a fresh lifecycle on each page. */
import Image from "next/image";
import type { CSSProperties } from "react";
import TravelMap from "./TravelMap";
import Experiences from "./Experiences";
import Jobs from "./Jobs";
import Passions from "./Passions";
import { projectCards } from "./projects";
import { closing, profile } from "./content";

const portrait = "/media/portraits/21C7AA17-2AB3-464F-9942-D4346396FAD9_1_102_o.jpeg";

// The opening introduces Mathis like a terminal session: `whoami` prints his profile, the
// card renders it, then the stack is checked before the parcours begins.
const devSteps = ["Profil", "Compétences"];
const devCaptions = [
  "Bonjour, moi c’est Mathis.",
  "Développeur full-stack, Node.js & Google Cloud.",
  "Voici mon parcours.",
];
// Each code line is a list of [token class, text] pairs; the scroll types them one by one.
const devCode: [string, string][][] = [
  [["c", "$ whoami --format json"]],
  [["", "{"]],
  [["p", "  \"nom\""], ["", ": "], ["s", `"${profile.name}"`], ["", ","]],
  [["p", "  \"rôle\""], ["", ": "], ["s", `"${profile.role}"`], ["", ","]],
  [["p", "  \"basé à\""], ["", ": "], ["s", `"${profile.city}"`], ["", ","]],
  [["p", "  \"poste\""], ["", ": "], ["s", `"${profile.company}"`], ["", ","]],
  [["p", "  \"statut\""], ["", ": "], ["s", `"${profile.status}"`]],
  [["", "}"]],
];
const devTerminal: [string, string, string][] = [
  ["$", "mathis --stack", ""],
  ...profile.stack.map(({ area, tools }): [string, string, string] => ["›", area, `✓ ${tools}`]),
  ["●", "En poste", profile.company],
];

// One rail names every chapter of the page, so the scroll reads as a single story.
const chapters = [
  { id: "presentation", label: "Qui je suis" },
  { id: "experiences", label: "Expériences pro" },
  { id: "jobs", label: "Jobs étudiants" },
  { id: "passions", label: "Passions" },
  { id: "projets", label: "Projets" },
  { id: "atlas", label: "Études" },
  { id: "suite", label: "Mot de fin" },
];
// A contribution graph for the closing scene; the level pattern is fixed so server and client agree.
const commitColumns = 40;
const commitCells = Array.from({ length: commitColumns * 7 }, (_, index) => {
  const column = Math.floor(index / 7);
  const row = index % 7;
  return { column, row, level: (column * 7 + row * 11 + ((column * row) % 5)) % 5 };
});

export default function Home() {
  return (
    <main id="accueil" className="site-shell">
      <div className="page-progress" aria-hidden="true"><span /></div>
      <nav className="chapter-rail" aria-label="Chapitres de la page">
        {chapters.map((chapter, index) => (
          <a href={`#${chapter.id}`} data-chapter-link={chapter.id} key={chapter.id}>
            <span>0{index + 1}</span><b>{chapter.label}</b>
          </a>
        ))}
      </nav>
      <a className="skip-link" href="#presentation">Aller au contenu</a>

      <section id="presentation" className="intro-journey" data-intro-journey aria-labelledby="hero-title">
        <div className="intro-sticky">
          <header className="site-header" aria-label="Navigation principale">
            <a className="wordmark" href="#accueil" aria-label="Mathis Truong, accueil">
              <span className="wordmark-symbol">M<span className="wordmark-dot">.</span>T</span>
              <span className="wordmark-name">Mathis<br />Truong</span>
            </a>
            <span className="header-edition">Full stack & Cloud&nbsp; / &nbsp;2026</span>
            <nav className="header-nav" aria-label="Sections du site">
              <a href="#experiences">Expériences pro</a>
              <a href="#projets">Projets</a>
              <a href="#atlas">Études</a>
              <a className="nav-external" href="https://github.com/FARONeye" target="_blank" rel="noopener noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </header>

          <div className="hero">
            <div className="hero-copy">
              <div className="hero-intro-line">
                <span className="eyebrow"><span className="eyebrow-mark" /> Développeur full stack & cloud</span>
                <span className="section-index">01 / 07</span>
              </div>
              <h1 id="hero-title" className="hero-title">
                <span className="hero-title-line">Mathis</span>
                <span className="hero-title-line second-line">Truong<span className="title-period">.</span></span>
              </h1>
              <div className="hero-bottom">
                <p className="hero-description">
                  Développeur full-stack chez {profile.company}.<br />
                  Je conçois des applications internes sécurisées, du front-end jusqu’au déploiement sur Google Cloud.
                </p>
                <a className="round-link" href="#experiences" aria-label="Découvrir mon parcours de développeur">
                  <span aria-hidden="true">↘</span>
                </a>
              </div>
            </div>

            <figure className="hero-portrait">
              <Image
                src={portrait}
                alt="Portrait en noir et blanc de Mathis Truong"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 100vw"
                className="portrait-image"
              />
              <figcaption className="portrait-caption">
                <span>Portrait / 001</span><span>Mathis Truong</span>
              </figcaption>
              <span className="portrait-scan" aria-hidden="true" />
            </figure>
            <div className="hero-kinetic" aria-hidden="true">
              <span>Full stack</span><span>Web créatif</span><span>Cloud</span>
            </div>
            <div className="hero-side-note" aria-hidden="true">Conception · Développement · Cloud</div>
            <a className="scroll-invitation" href="#experiences">Défiler pour découvrir <span aria-hidden="true">↓</span></a>
          </div>

          <div className="dev-stage" aria-hidden="true">
            <ol className="dev-steps">
              {devSteps.map((step, index) => (
                <li key={step} data-dev-step={index}><span>0{index + 1}</span>{step}</li>
              ))}
            </ol>
            <div className="dev-captions">
              {devCaptions.map((caption) => <p key={caption}>{caption}</p>)}
            </div>

            <div className="dev-window dev-editor">
              <div className="dev-window-bar"><i /><i /><i /><span>terminal — whoami</span></div>
              <pre className="dev-code">
                {devCode.map((line, index) => (
                  <code key={index} data-dev-line={index}>
                    <span className="dev-gutter">{index + 1}</span>
                    <span className="dev-line">{line.map(([kind, text], token) => <span className={kind && `tok-${kind}`} key={token}>{text}</span>)}</span>
                  </code>
                ))}
              </pre>
            </div>

            <div className="dev-window dev-preview">
              <div className="dev-window-bar"><i /><i /><i /><span>profil.tsx</span></div>
              <div className="dev-ui dev-profile">
                <div className="dev-profile-head" data-dev-build={0}>
                  <span className="dev-profile-avatar"><Image src={portrait} alt="" fill sizes="80px" /></span>
                  <div><strong>{profile.name}</strong><small>{profile.role}</small></div>
                </div>
                <div className="dev-profile-tags" data-dev-build={1}><span>◎ {profile.city}</span>{profile.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="dev-profile-stats" data-dev-build={2}>
                  {profile.stats.map((stat) => <span key={stat.label}><b>{stat.value}</b>{stat.label}</span>)}
                </div>
                <div className="dev-ui-status" data-dev-build={3}><span>● {profile.status}</span></div>
              </div>
            </div>

            <div className="dev-window dev-terminal">
              <div className="dev-window-bar"><i /><i /><i /><span>terminal</span></div>
              <div className="dev-terminal-lines">
                {devTerminal.map(([prompt, command, result], index) => (
                  <p key={command} data-dev-term={index}><b>{prompt}</b><span>{command}</span><i>{result}</i></p>
                ))}
              </div>
            </div>

          </div>
          <div className="intro-meter" aria-hidden="true">
            <span className="intro-meter-label">Pipeline</span>
            <i><b /></i>
            <span className="intro-meter-count">00</span>
          </div>
        </div>
      </section>





      <Experiences />
      <Jobs />

      <Passions />

      <section id="projets" className="project-journey capability-journey" data-capability-journey aria-labelledby="capability-title">
        <div className="capability-sticky">
          <div className="capability-heading">
            <span className="eyebrow">05 / Projets</span>
            <span className="temporary-label">Concepts provisoires</span>
          </div>
          <h2 id="capability-title" className="capability-title">
            Mes projets.<br /><em>Du code au concret.</em>
          </h2>
          <div className="project-instruction" aria-live="polite">
            <span className="project-instruction-kicker">Mode exploration</span>
            <p><strong>Faites défiler</strong> pour explorer, puis <strong>cliquez où vous voulez sur une carte</strong> pour découvrir sa page.</p>
            <span className="project-instruction-icon" aria-hidden="true">↘</span>
          </div>

          <div className="registry" aria-hidden="true">
            <p className="registry-prompt"><b>$</b> ls ~/projets --statut</p>
            {projectCards.map((card, index) => (
              <p className="registry-row" data-registry-row={index} key={card.slug} style={{ "--project-accent": card.color } as CSSProperties}>
                <span>{card.number}</span><b>{card.slug}</b><i>{card.label}</i><em>● en ligne</em>
              </p>
            ))}
          </div>

          <div className="capability-deck">
            {projectCards.map((card, index) => (
              <a
                className={`project-card capability-card capability-card-${index}`}
                href={`/projets/${card.slug}`}
                aria-label={`Ouvrir le projet ${card.title}`}
                data-capability-card={index}
                key={card.number}
                style={{ "--project-accent": card.color } as CSSProperties}
              >
                <figure className="project-card-image">
                  <Image src={card.image} alt={card.imageAlt} fill sizes="(max-width: 760px) 100vw, 58vw" />
                  <figcaption>{card.accent}</figcaption>
                </figure>
                <div className="project-card-shade" aria-hidden="true" />
                <pre className="project-card-code" aria-hidden="true">
                  <code><b>export const</b> {card.slug} = {"{"}</code>
                  <code>  titre: <i>&quot;{card.title}&quot;</i>,</code>
                  <code>  type: <i>&quot;{card.label}&quot;</i>,</code>
                  <code>  stack: [{card.tags.map((tag) => `"${tag}"`).join(", ")}],</code>
                  <code>{"}"};</code>
                  <code><b>await</b> deployer({card.slug}); <em>{"// → /projets/"}{card.slug}</em></code>
                </pre>
                <div className="capability-card-top project-card-top">
                  <span>{card.number}</span><span>{card.label}</span>
                </div>
                <div className="capability-card-copy project-card-copy">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <ul aria-label={`Mots-clés : ${card.tags.join(", ")}`}>
                    {card.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                <span className="project-card-object" aria-hidden="true"><i /><i /></span>
                <span className="project-card-sequence" aria-hidden="true">Projet — {card.number} / 05</span>
                <span className="project-card-status" aria-hidden="true">● Déployé · build #{card.number}{card.title.length}</span>
                <span className="project-card-action" aria-hidden="true">
                  <span>Voir le projet</span><i>↗</i>
                </span>
              </a>
            ))}
          </div>

          <div className="capability-finale" aria-hidden="true">
            <span>Ensuite · 06 / Études</span>
            <strong>Mes études.</strong>
            <i>↓</i>
          </div>
          <div className="capability-meter" aria-hidden="true">
            <span>Défiler · choisir · cliquer</span><i><b /></i><span className="capability-count">01 / 05</span>
          </div>
        </div>
      </section>

      <section id="atlas" className="story travel-map-section" aria-labelledby="studies-title">
        <div className="story-journey" data-story-journey>
          <div className="story-sticky" data-active-chapter="0">
            <TravelMap />
            <div className="studies-heading">
              <span className="eyebrow">06 / Études</span>
              <h2 id="studies-title">Quatre villes,<br /><em>un même fil.</em></h2>
            </div>
          </div>
        </div>
      </section>

      <section id="suite" className="outro-journey" data-outro-journey data-jump-progress=".66" aria-labelledby="outro-title">
        <div className="outro outro-sticky" data-section-motion>
          <div className="commit-graph" aria-hidden="true">
            {commitCells.map((cell, index) => (
              <i key={index} style={{ "--c": cell.column, "--r": cell.row, "--lvl": cell.level } as CSSProperties} />
            ))}
          </div>
          <div className="outro-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="outro-image" aria-hidden="true">
            <div className="dev-window-bar outro-window-bar"><i /><i /><i /><span>mathis.jpg</span></div>
            <Image src="/media/portraits/15DA74D7-7A5A-4209-A366-588B874A98EF_1_102_o.jpeg" alt="" fill sizes="(max-width: 760px) 100vw, 38vw" />
          </div>
          <div className="outro-content">
            <span className="eyebrow" data-reveal>07 / Mot de fin</span>
            <p className="outro-prompt" aria-hidden="true"><b>$</b> <span>git commit -m &quot;merci de votre visite&quot;</span></p>
            <h2 id="outro-title" data-reveal aria-label={closing.headline.join(" ")}>
              <span data-scramble={closing.headline[0]} aria-hidden="true">{closing.headline[0]}</span><br /><em data-scramble={closing.headline[1]} aria-hidden="true">{closing.headline[1]}</em>
            </h2>
            <p data-reveal>{closing.text}</p>
            <div className="outro-links">
              {closing.links.map((link) => (
                <a className={`outro-link${link.primary ? "" : " outro-link-secondary"}`} href={link.href} key={link.label} {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} data-reveal>
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <p className="outro-status" aria-hidden="true"><i /> {closing.status}</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>Mathis Truong © 2026</span>
        <span className="footer-status"><i aria-hidden="true" /> Tous les systèmes opérationnels</span>
        <a href="#accueil">Retour en haut ↑</a>
      </footer>
    </main>
  );
}
