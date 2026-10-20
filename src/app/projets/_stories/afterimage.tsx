import Image from "next/image";
import { Chapter, NextScene, ResultMeta, Steps, Title, Words, scene, vars, type StoryProps } from "./shared";

// Scroll becomes a horizontal journey; the image leaves echoes behind it at speed.
export default function AfterimageStory({ project, next }: StoryProps) {
  const frame = (className: string) => (
    <figure className={className} aria-hidden="true">
      <Image src={project.image} alt="" fill sizes="(max-width: 760px) 60vw, 40vw" />
    </figure>
  );
  return (
    <>
      <div className="af-scanlines ps-decor" aria-hidden="true" />
      <svg className="af-wave ps-decor" aria-hidden="true" preserveAspectRatio="none"><path className="af-wave-echo" /><path className="af-wave-main" /></svg>
      <div className="af-live ps-decor" aria-hidden="true"><i /> En direct · <b>0</b> événements</div>

      <div className="af-frames ps-decor">
        {frame("af-frame af-echo af-echo-3")}
        {frame("af-frame af-echo af-echo-2")}
        {frame("af-frame af-echo af-echo-1")}
        {frame("af-frame af-main")}
      </div>

      <div className="af-rail">
        <section className="ps-scene ps-scene-opening af-opening" {...scene(0)} aria-labelledby="project-title">
          <span className="eyebrow ps-rise" style={vars({ "--d": 0 })}><span className="eyebrow-mark" /> Projet {project.number} — {project.label}</span>
          <Title text={project.title} />
          <p className="ps-lead ps-rise" style={vars({ "--d": .1 })}>{project.body}</p>
          <ul className="ps-tags ps-rise" style={vars({ "--d": .2 })} aria-label="Domaines du projet">
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <span className="ps-scroll-cue ps-decor"><i />Défilez vite : l’image laisse une trace</span>
        </section>

        <section className="ps-scene af-challenge" {...scene(1)} aria-labelledby="ps-challenge-title">
          <Chapter>01 — Le point de départ</Chapter>
          <Words as="h2" id="ps-challenge-title" className="af-question" text={project.story.challenge} />
          <p className="ps-rise" style={vars({ "--d": .35 })}>{project.detail}</p>
        </section>

        <section className="ps-scene af-approach" {...scene(2)} aria-labelledby="ps-approach-title">
          <Chapter>02 — L’approche</Chapter>
          <h2 id="ps-approach-title" className="ps-rise" style={vars({ "--d": .08 })}>Du serveur à l’écran,<br /><em>en un battement.</em></h2>
          <div className="af-pipeline">
            <i className="af-pipeline-line ps-decor" aria-hidden="true"><b /></i>
            <i className="af-packet ps-decor" aria-hidden="true" />
            <Steps project={project} className="af-steps" />
          </div>
        </section>

        <section className="ps-scene af-stack" {...scene(3)} aria-labelledby="ps-stack-title">
          <div className="af-stack-copy">
            <Chapter>03 — Technologies</Chapter>
            <h2 id="ps-stack-title" className="ps-rise" style={vars({ "--d": .08 })}>Un réseau<br /><em>toujours connecté.</em></h2>
          </div>
          <ul className="af-network" aria-label="Technologies et domaines">
            {project.tags.map((tag, index) => (
              <li style={vars({ "--a": `${index / project.tags.length - .25}turn`, "--d": .12 + index * .1 })} key={tag}>
                <i className="ps-decor" aria-hidden="true"><b /></i><span>{tag}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ps-scene af-result" {...scene(4)} aria-labelledby="ps-result-title">
          <div className="af-screens-label ps-rise ps-decor" style={vars({ "--d": .3 })} aria-hidden="true"><span>Client A</span><span>Client B</span><span>Client C</span></div>
          <Chapter>04 — Le résultat</Chapter>
          <Words as="h2" id="ps-result-title" text={project.story.outcome} />
          <ResultMeta project={project} />
        </section>

        <NextScene next={next} />
      </div>
    </>
  );
}
