import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { profile } from "./content";

/* 01 — Qui je suis, on the same scene engine as the other chapters (motion.js gives every scene
   --enter, --inner and --leave). The hero plays on arrival — the name rises letter by letter,
   the portrait is unveiled, the words rotate — then the scroll deals the story in four pictures,
   counts the numbers, gathers the stack and ends on the table of contents. */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const portrait = "/media/portraits/21C7AA17-2AB3-464F-9942-D4346396FAD9_1_102_o.jpeg";
const weights = { hero: 1.1, story: 1.4, numbers: 1.1, stack: 1.2, next: 1 };
const units = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
const stackNames: Record<string, string> = { front: "Front-end", back: "Back-end", cloud: "Cloud", data: "Données" };
const marquee = ["Full-stack", "Node.js", "Google Cloud", "Firebase", "React", "Next.js", "BigQuery", "Automatisation", "Sécurité", "Cloud Functions"];


// The story panels: one photo, then sketches whose strokes draw themselves as the panel lands.
const sketches: Record<string, ReactNode> = {
  code: (
    <>
      <rect pathLength="1" x="28" y="44" width="144" height="112" rx="12" />
      <path pathLength="1" d="M28 70h144" />
      <circle pathLength="1" cx="44" cy="57" r="3.5" /><circle pathLength="1" cx="57" cy="57" r="3.5" /><circle pathLength="1" cx="70" cy="57" r="3.5" />
      <path pathLength="1" d="M72 94 56 111l16 17M106 88l-12 46M128 94l16 17-16 17" />
      <path pathLength="1" d="M150 28l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" />
      <path pathLength="1" d="M22 176c40-8 110-8 156 0" />
    </>
  ),
  cloud: (
    <>
      <path pathLength="1" d="M52 132c-26 0-28-34-4-38 0-30 42-40 56-16 12-22 50-12 46 16 26 2 26 38 0 38z" />
      <path pathLength="1" d="M100 124V92M86 105l14-14 14 14" />
      <path pathLength="1" d="M58 150l-8 20h12l-8 20M142 150l-8 20h12l-8 20" />
      <path pathLength="1" d="M30 40l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" />
    </>
  ),
  music: (
    <>
      {[22, 48, 76, 40, 96, 58, 30, 70, 24].map((h, k) => <path pathLength="1" key={k} className="who-eq" style={v({ "--b": k })} d={`M${40 + k * 15} ${100 - h / 2}v${h}`} />)}
      <path pathLength="1" d="M24 100h8M168 100h8" />
      <path pathLength="1" d="M150 28c0 0 14 4 14 18M150 28v30a8 8 0 1 1-6-8" />
    </>
  ),
};
const stickers = ["/media/passions/fl-studio-icon.png", "/media/passions/capcut-icon.svg"];
const storyPortrait = "/media/portraits/7EADDB51-D424-4320-BA14-C54EB7A66A3E.jpeg";

type Chapter = { id: string; label: string; teaser: string };

export default function About({ chapters }: { chapters: Chapter[] }) {
  return (
    <section id="presentation" className="xp-journey who-journey" data-xp-journey aria-labelledby="hero-title" style={v({ "--xp-units": units })}>
      <div className="xp-sticky">

        {/* 00 — the hero: it plays as soon as the page opens. */}
        <article className="xp-scene who-s-hero" data-xp-scene data-weight={weights.hero} data-label="Bonjour" data-no-rest>
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

          <figure className="who-portrait">
            <Image src={portrait} alt="Portrait en noir et blanc de Mathis Truong" fill priority sizes="(max-width: 760px) 100vw, 46vw" />
            <figcaption><span>Portrait / 001</span><span>{profile.city}</span></figcaption>
          </figure>

          <div className="who-hero-copy">
            <span className="eyebrow who-eyebrow"><span className="eyebrow-mark" /> Développeur full stack & cloud</span>
            <h1 id="hero-title" className="who-name">
              <span className="sr-only">{profile.name}</span>
              {profile.name.split(" ").map((word, line) => (
                <span className="who-name-line" key={word} aria-hidden="true">
                  {[...word].map((char, k) => <span className="who-char" key={k} style={v({ "--c": line * 6 + k })}>{char}</span>)}
                  {line === 1 && <span className="who-char who-dot" style={v({ "--c": 12 })}>.</span>}
                </span>
              ))}
            </h1>
            <p className="who-rotator">
              Je conçois{" "}
              <span className="who-words" aria-hidden="true">{profile.rotator.map((word, k) => <b key={word} style={v({ "--i": k })}>{word}</b>)}</span>
              <span className="sr-only">{profile.rotator.join(", ")}</span>
            </p>
            <p className="who-lede">Développeur full-stack chez {profile.company}, du front-end jusqu’au déploiement sur Google Cloud.</p>
            <div className="who-cta">
              <a className="who-btn" href="#experiences">Voir mon parcours <span aria-hidden="true">↘</span></a>
              <span className="who-status"><i aria-hidden="true" />{profile.status}</span>
            </div>
          </div>

          <div className="who-marquee" aria-hidden="true">
            <div className="who-marquee-track">
              {[0, 1].map((copy) => <span key={copy}>{marquee.map((item) => <b key={item}>{item}<i>✦</i></b>)}</span>)}
            </div>
          </div>
          <span className="who-scroll" aria-hidden="true"><i /></span>
        </article>

        {/* 01 — the story in four pictures: each panel is dealt in turn, its sketch drawing itself. */}
        <article className="xp-scene who-s-story xp-t-iris" data-xp-scene data-weight={weights.story} data-label="Qui je suis">
          <div className="who-story-head">
            <span className="xp-kicker">01 / Qui je suis</span>
            <h3>Mathis, <em>en quatre images.</em></h3>
          </div>
          <svg className="who-thread" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30C120 0 200 60 330 30s210-30 340 0 210 30 330 0" /></svg>
          <ol className="who-story">
            {profile.story.map((panel, k) => (
              <li className={`who-panel who-panel-${panel.art}`} key={panel.art} style={v({ "--k": k })}>
                <div className="who-panel-art">
                  {panel.art === "portrait"
                    ? <><Image src={storyPortrait} alt="Mathis, le doigt sur la bouche, en maillot du Barça" fill sizes="(max-width: 760px) 45vw, 22vw" /><span className="who-bubble" aria-hidden="true">Salut&nbsp;!</span></>
                    : <svg viewBox="0 0 200 200" aria-hidden="true">{sketches[panel.art]}</svg>}
                  {panel.art === "music" && stickers.map((src, n) => <Image key={src} className={`who-sticker who-sticker-${n}`} src={src} alt="" width={64} height={64} />)}
                </div>
                <span className="who-panel-n">0{k + 1}</span>
                <b>{panel.title}</b>
                <small>{panel.caption}</small>
              </li>
            ))}
          </ol>
        </article>

        {/* 02 — the numbers count up, each card rising in turn. */}
        <article className="xp-scene who-s-numbers xp-t-band" data-xp-scene data-weight={weights.numbers} data-label="En chiffres">
          <div className="who-numbers-head">
            <span className="xp-kicker">En quelques chiffres</span>
            <h3>Construire, <em>pour de vrai.</em></h3>
          </div>
          <dl className="who-stats">
            {profile.stats.map((stat, k) => (
              <div key={stat.label} style={v({ "--k": k })}>
                <dt data-count={stat.value} data-suffix={stat.suffix}>{stat.value}{stat.suffix}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
          <ul className="who-facts">
            <li>◎ {profile.city}</li>
            {profile.tags.slice(1).map((tag) => <li key={tag}>{tag}</li>)}
            <li>En poste chez {profile.company}</li>
          </ul>
        </article>

        {/* 03 — the stack: every tool flies in from afar and lands in its column. */}
        <article className="xp-scene who-s-stack xp-t-diag" data-xp-scene data-weight={weights.stack} data-label="Ma stack">
          <div className="who-stack-head">
            <span className="xp-kicker">Ma boîte à outils</span>
            <h3>Du front-end <em>jusqu’au cloud.</em></h3>
          </div>
          <div className="who-stack">
            {profile.stack.map((group, g) => (
              <div className="who-stack-col" key={group.area} style={v({ "--g": g })}>
                <span>{stackNames[group.area] || group.area}</span>
                <ul>
                  {group.tools.split(" · ").map((tool, t) => (
                    <li key={tool} style={v({ "--k": g * 4 + t, "--x": `${((g * 4 + t) * 53) % 120 - 60}vw`, "--y": `${((g * 4 + t) * 37) % 90 - 45}vh`, "--r": `${((g * 4 + t) * 47) % 60 - 30}deg` })}>{tool}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <ul className="who-qualities">{profile.qualities.map((quality, k) => <li key={quality} style={v({ "--k": k })}>{quality}</li>)}</ul>
        </article>

        {/* 04 — the way in: the six chapters to come, each one a click away. */}
        <article className="xp-scene who-s-next xp-t-side" data-xp-scene data-weight={weights.next} data-label="Mon parcours">
          <div className="who-next-head">
            <span className="xp-kicker">Et maintenant</span>
            <h3>Voici mon <em>parcours.</em></h3>
            <p>Six chapitres à découvrir en défilant, ou en un clic.</p>
            <span className="who-status"><i aria-hidden="true" />{profile.status}</span>
          </div>
          <ol className="who-chapters">
            {chapters.map((chapter, k) => (
              <li key={chapter.id} style={v({ "--k": k })}>
                <a href={`#${chapter.id}`}>
                  <span>0{k + 2}</span>
                  <b>{chapter.label}</b>
                  <small>{chapter.teaser}</small>
                  <i aria-hidden="true">→</i>
                </a>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}
