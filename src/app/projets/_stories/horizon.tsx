import Image from "next/image";
import { Chapter, NextScene, ResultMeta, Steps, Title, Words, scene, seeded, vars, type StoryProps } from "./shared";

// A camera flies over a grid: each chapter waits on the horizon, then rushes past.
export default function HorizonStory({ project, next }: StoryProps) {
  return (
    <>
      <div className="hz-sky ps-decor" aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => (
          <i key={index} style={vars({ left: `${(seeded(index, 1) * 100).toFixed(2)}%`, top: `${(seeded(index, 2) * 46).toFixed(2)}%`, "--tw": seeded(index, 3).toFixed(2) })} />
        ))}
      </div>
      <div className="hz-horizon ps-decor" aria-hidden="true" />
      <div className="hz-floor-wrap ps-decor" aria-hidden="true"><div className="hz-floor" /></div>

      <div className="hz-world">
        <figure className="hz-monolith ps-decor" aria-hidden="true">
          <Image src={project.image} alt="" fill sizes="(max-width: 760px) 50vw, 30vw" />
        </figure>

        <div className="hz-billboards ps-decor" aria-hidden="true">
          {project.tags.map((tag, index) => <span className="hz-billboard" style={vars({ "--k": index })} key={tag}>{tag}</span>)}
        </div>

        <section className="ps-scene ps-scene-opening hz-opening" {...scene(0)} aria-labelledby="project-title">
          <span className="eyebrow ps-rise" style={vars({ "--d": 0 })}><span className="eyebrow-mark" /> Projet {project.number} — {project.label}</span>
          <Title text={project.title} />
          <p className="ps-lead ps-rise" style={vars({ "--d": .1 })}>{project.body}</p>
          <ul className="ps-tags ps-rise" style={vars({ "--d": .2 })} aria-label="Domaines du projet">
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <span className="ps-scroll-cue ps-decor"><i />Défilez pour avancer vers l’horizon</span>
        </section>

        <section className="ps-scene hz-challenge" {...scene(1)} aria-labelledby="ps-challenge-title">
          <Chapter>01 — Le point de départ</Chapter>
          <Words as="h2" id="ps-challenge-title" className="hz-question" text={project.story.challenge} />
          <p className="ps-rise" style={vars({ "--d": .35 })}>{project.detail}</p>
        </section>

        <section className="ps-scene hz-approach" {...scene(2)} aria-labelledby="ps-approach-title">
          <div className="hz-approach-copy">
            <Chapter>02 — L’approche</Chapter>
            <h2 id="ps-approach-title" className="ps-rise" style={vars({ "--d": .08 })}>Construire<br /><em>étage par étage.</em></h2>
            <Steps project={project} className="hz-steps" />
          </div>
          <div className="hz-building ps-decor" aria-hidden="true">
            {project.story.steps.map((step, index) => (
              <span className="hz-slab" style={vars({ "--k": index })} key={step.title}><b>{step.title}</b></span>
            ))}
          </div>
        </section>

        <section className="ps-scene hz-stack" {...scene(3)} aria-labelledby="ps-stack-title">
          <Chapter>03 — Technologies</Chapter>
          <h2 id="ps-stack-title" className="ps-rise" style={vars({ "--d": .08 })}>Traverser<br /><em>chaque couche.</em></h2>
          <ul className="ps-tags ps-rise" style={vars({ "--d": .2 })}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </section>

        <section className="ps-scene hz-result" {...scene(4)} aria-labelledby="ps-result-title">
          <Chapter>04 — Le résultat</Chapter>
          <Words as="h2" id="ps-result-title" text={project.story.outcome} />
          <ResultMeta project={project} />
        </section>

        <NextScene next={next} />
      </div>
    </>
  );
}
