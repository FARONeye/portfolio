import Image from "next/image";
import { Chapter, NextScene, ResultMeta, Title, Words, scene, seeded, vars, type StoryProps } from "./shared";

// A single day passes while the pages of an editorial issue turn.
export default function SolsticeStory({ project, next }: StoryProps) {
  return (
    <>
      <div className="so-sky ps-decor" aria-hidden="true" />
      <div className="so-stars ps-decor" aria-hidden="true">
        {Array.from({ length: 48 }, (_, index) => (
          <i key={index} style={vars({ left: `${(seeded(index, 4) * 100).toFixed(2)}%`, top: `${(seeded(index, 5) * 70).toFixed(2)}%`, "--tw": seeded(index, 6).toFixed(2) })} />
        ))}
      </div>
      <div className="so-sun ps-decor" aria-hidden="true"><i /></div>
      <div className="so-clock ps-decor" aria-hidden="true"><span>Heure de lecture</span><b>06:00</b><i><em /></i></div>

      <section className="ps-scene ps-scene-opening so-page so-cover" {...scene(0)} aria-labelledby="project-title">
        <div className="so-masthead ps-rise" style={vars({ "--d": 0 })}><span>Le journal de projet</span><span>N° {project.number} · Édition du jour</span></div>
        <div className="so-cover-grid">
          <div>
            <span className="eyebrow ps-rise" style={vars({ "--d": .05 })}><span className="eyebrow-mark" /> {project.label}</span>
            <Title text={project.title} />
            <p className="ps-lead ps-rise" style={vars({ "--d": .12 })}>{project.body}</p>
            <ul className="ps-tags ps-rise" style={vars({ "--d": .2 })} aria-label="Domaines du projet">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          </div>
          <figure className="so-photo ps-rise" style={vars({ "--d": .15 })}>
            <Image src={project.image} alt={project.imageAlt} fill priority sizes="(max-width: 760px) 70vw, 30vw" />
            <figcaption>Fig. 1 — {project.accent}</figcaption>
          </figure>
        </div>
        <span className="ps-scroll-cue ps-decor"><i />Défilez pour tourner la page</span>
      </section>

      <section className="ps-scene so-page so-challenge" {...scene(1)} aria-labelledby="ps-challenge-title">
        <Chapter>01 — Le point de départ</Chapter>
        <div className="so-spread">
          <Words as="h2" id="ps-challenge-title" className="so-question" text={project.story.challenge} />
          <div className="so-column ps-rise" style={vars({ "--d": .3 })}>
            <p className="so-dropcap">{project.detail}</p>
            <span className="so-rule" />
            <p className="so-aside">À l’aube du projet, une seule question guide chaque choix.</p>
          </div>
        </div>
      </section>

      <section className="ps-scene so-page so-approach" {...scene(2)} aria-labelledby="ps-approach-title">
        <Chapter>02 — L’approche</Chapter>
        <h2 id="ps-approach-title" className="ps-rise" style={vars({ "--d": .06 })}>Trois temps, <em>trois colonnes.</em></h2>
        <ol className="so-columns">
          {project.story.steps.map((step, index) => (
            <li data-story-step={index} style={vars({ "--k": index })} key={step.title}>
              <span className="so-column-rule" aria-hidden="true" />
              <span className="ps-step-number">{["Matin", "Midi", "Soir"][index]}</span>
              <strong>{step.title}</strong>
              <p className="so-dropcap">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ps-scene so-page so-stack" {...scene(3)} aria-labelledby="ps-stack-title">
        <Chapter>03 — Technologies</Chapter>
        <h2 id="ps-stack-title" className="ps-rise" style={vars({ "--d": .06 })}>Sommaire</h2>
        <ol className="so-contents">
          {project.tags.map((tag, index) => (
            <li className="ps-rise" style={vars({ "--d": .14 + index * .1 })} key={tag}>
              <span>{tag}</span><i aria-hidden="true" /><b>p. {String((index + 1) * 12).padStart(2, "0")}</b>
            </li>
          ))}
        </ol>
      </section>

      <section className="ps-scene so-page so-result" {...scene(4)} aria-labelledby="ps-result-title">
        <figure className="so-sunframe ps-decor" aria-hidden="true">
          <Image src={project.image} alt="" fill sizes="(max-width: 760px) 70vw, 34vw" />
        </figure>
        <div className="so-result-copy">
          <Chapter>04 — Le résultat</Chapter>
          <Words as="h2" id="ps-result-title" className="so-quote" text={project.story.outcome} />
          <ResultMeta project={project} />
        </div>
      </section>

      <NextScene next={next} />
    </>
  );
}
