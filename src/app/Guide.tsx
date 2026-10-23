import type { CSSProperties, ReactNode } from "react";

/* The way around the site, for visitors who don't think of scrolling: a dock in the corner (help,
   and a button that plays the next scene) and a guide where each step is learnt by doing it —
   scroll, watch a scene finish itself, touch what can be touched. motion.js runs it:
   data-guide-* for the dialog, data-try-* for the practice areas, data-scroll-next for the dock. */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const pageBlocks = ["Qui je suis", "Expériences", "Jobs étudiants", "Passions", "Projets", "Études"];
const railLabels = ["Qui je suis", "Expériences", "Jobs", "Passions", "Projets"];

const steps: { key: string; title: string; text: ReactNode; practice: ReactNode }[] = [
  {
    key: "scroll",
    title: "Faites défiler",
    text: <>Essayez dans le cadre&nbsp;: molette, trackpad ou doigt. Toute la page se lit <b>comme ça</b>.</>,
    practice: (
      <div className="guide-try guide-try-scroll">
        <div className="guide-try-scroller" data-try-scroll tabIndex={0} aria-label="Zone d’essai : faites défiler">
          <div className="guide-try-page">
            {pageBlocks.map((label, k) => <span className="guide-try-block" key={label} style={v({ "--k": k })}><b>0{k + 1}</b>{label}</span>)}
            <span className="guide-try-end">✓ Vous savez défiler</span>
          </div>
        </div>
        <span className="guide-try-gesture" aria-hidden="true">
          <span className="guide-mouse"><i /></span>
          <span className="guide-pad"><i /><i /></span>
          <span className="guide-phone"><i /></span>
        </span>
        <i className="guide-try-meter" aria-hidden="true"><b /></i>
      </div>
    ),
  },
  {
    key: "scene",
    title: "Chaque écran s’anime",
    text: <>Défilez dans l’écran pour faire entrer le suivant. Arrêtez-vous au milieu&nbsp;: <b>la page finit l’animation</b> pour vous.</>,
    practice: (
      <div className="guide-try guide-try-scene" data-try-scene>
        <span className="guide-screen" aria-hidden="true">
          <i className="guide-scene-a"><b /><b /><b /></i>
          <i className="guide-scene-b"><b /><b /></i>
          <em className="guide-scene-bar" />
        </span>
        <div className="guide-try-scroller guide-try-cover" data-try-scroll-scene tabIndex={0} aria-label="Écran d’essai : faites défiler"><div /></div>
        <span className="guide-try-caption" data-try-caption aria-live="polite">Défilez dans l’écran ↓</span>
      </div>
    ),
  },
  {
    key: "click",
    title: "Certains éléments se cliquent",
    text: <>Repérez ces signes&nbsp;: <b>↗</b> ouvre une page, <b>▶</b> lance un son, un <b>point lumineux</b> ouvre une ville. Touchez les trois.</>,
    practice: (
      <div className="guide-try guide-try-clicks">
        <button type="button" className="guide-try-target guide-try-link" data-try-target>Voir le projet <span aria-hidden="true">↗</span></button>
        <button type="button" className="guide-try-target guide-try-play" data-try-target aria-label="Lancer un son"><span aria-hidden="true">▶</span></button>
        <button type="button" className="guide-try-target guide-try-city" data-try-target aria-label="Ouvrir Dublin"><i aria-hidden="true" />DUB</button>
        <span className="guide-try-count" data-try-count>0 / 3</span>
      </div>
    ),
  },
  {
    key: "rail",
    title: "Le sommaire",
    text: <>Les <b>points à droite</b> de l’écran mènent à chaque chapitre. Touchez «&nbsp;Passions&nbsp;».</>,
    practice: (
      <div className="guide-try guide-try-rail">
        <span className="guide-page" aria-hidden="true"><b /><b /><b /></span>
        <ol className="guide-rail">
          {railLabels.map((label) => (
            <li key={label}>
              <button type="button" data-try-rail={label === "Passions" ? "goal" : ""}><span>{label}</span><i /></button>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
  {
    key: "next",
    title: "Ou laissez-vous guider",
    text: <>Le bouton <b>↓</b> en bas à droite joue la scène suivante à chaque clic. Essayez-le.</>,
    practice: (
      <div className="guide-try guide-try-next">
        <span className="guide-try-mini" aria-hidden="true">
          <span className="guide-try-reel">{pageBlocks.slice(0, 4).map((label, k) => <span key={label} style={v({ "--k": k })}><b>0{k + 1}</b>{label}</span>)}</span>
        </span>
        <button type="button" className="guide-next-btn" data-try-next aria-label="Scène suivante">↓</button>
      </div>
    ),
  },
];

export default function Guide() {
  return (
    <>
      <div className="guide-dock" data-guide-dock>
        <span className="guide-hint" aria-hidden="true">Perdu&nbsp;? <b>Le mode d’emploi est ici</b></span>
        <button type="button" className="guide-launch" data-guide-open aria-haspopup="dialog">
          <span className="guide-launch-icon" aria-hidden="true">?</span>
          <span className="guide-launch-label">Comment naviguer</span>
        </button>
        <button type="button" className="guide-step-btn" data-scroll-next aria-label="Avancer à la scène suivante" title="Scène suivante">
          <span aria-hidden="true">↓</span>
        </button>
      </div>

      <dialog className="guide" data-guide aria-labelledby="guide-title">
        <div className="guide-card">
          <header className="guide-head">
            <span className="guide-kicker" id="guide-title">Mode d’emploi · à vous de jouer</span>
            <button type="button" className="guide-close" data-guide-close aria-label="Fermer le mode d’emploi">×</button>
          </header>
          <div className="guide-viewport">
            <ol className="guide-track">
              {steps.map((step, k) => (
                <li className="guide-slide" data-guide-step={step.key} key={step.key} aria-label={`Étape ${k + 1} sur ${steps.length}`}>
                  {step.practice}
                  <span className="guide-n">0{k + 1} <em className="guide-done" aria-live="polite">✓ Bien joué</em></span>
                  <h2>{step.title}</h2>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <footer className="guide-foot">
            <div className="guide-dots" aria-hidden="true">{steps.map((step) => <i key={step.key} />)}</div>
            <button type="button" className="guide-prev" data-guide-prev>Retour</button>
            <button type="button" className="guide-next" data-guide-next>Passer</button>
          </footer>
        </div>
      </dialog>
    </>
  );
}
