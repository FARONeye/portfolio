import { Chapter, NextScene, ResultMeta, Steps, Title, Words, scene, seeded, vars, type StoryProps } from "./shared";

const columns = 4;
const rows = 5;

// The image is cut into shards that assemble, explode, orbit and fall with the story.
export default function FragmentsStory({ project, next }: StoryProps) {
  const marquee = Array.from({ length: 4 }, () => project.tags.join("  ✦  ")).join("  ✦  ");
  return (
    <>
      <div className="fr-glow ps-decor" aria-hidden="true" />
      <div className="fr-beams ps-decor" aria-hidden="true"><i /><i /><i /></div>
      <div className="fr-shards ps-decor" aria-hidden="true">
        {Array.from({ length: columns * rows }, (_, index) => (
          <span
            className="fr-shard"
            key={index}
            style={vars({
              "--c": index % columns,
              "--r": Math.floor(index / columns),
              "--glint": seeded(index, 9).toFixed(3),
              backgroundImage: `url(${project.image})`,
            })}
          />
        ))}
      </div>

      <section className="ps-scene ps-scene-opening" {...scene(0)} aria-labelledby="project-title">
        <span className="eyebrow ps-rise" style={vars({ "--d": 0 })}><span className="eyebrow-mark" /> Projet {project.number} — {project.label}</span>
        <Title text={project.title} />
        <p className="ps-lead ps-rise" style={vars({ "--d": .1 })}>{project.body}</p>
        <ul className="ps-tags ps-rise" style={vars({ "--d": .2 })} aria-label="Domaines du projet">
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <span className="ps-scroll-cue ps-decor"><i />Défilez : l’image va se briser</span>
      </section>

      <section className="ps-scene fr-challenge" {...scene(1)} aria-labelledby="ps-challenge-title">
        <Chapter>01 — Le point de départ</Chapter>
        <Words as="h2" id="ps-challenge-title" className="fr-question" text={project.story.challenge} />
        <p className="ps-rise" style={vars({ "--d": .35 })}>{project.detail}</p>
      </section>

      <section className="ps-scene fr-approach" {...scene(2)} aria-labelledby="ps-approach-title">
        <div className="fr-approach-heading">
          <Chapter>02 — L’approche</Chapter>
          <h2 id="ps-approach-title" className="ps-rise" style={vars({ "--d": .08 })}>Trois fragments.<br /><em>Une seule lumière.</em></h2>
        </div>
        <Steps project={project} className="fr-steps" />
        <div className="fr-step-dots ps-decor" aria-hidden="true">{project.story.steps.map((step, index) => <i style={vars({ "--k": index })} key={step.title} />)}</div>
      </section>

      <section className="ps-scene fr-stack" {...scene(3)} aria-labelledby="ps-stack-title">
        <div className="fr-marquee ps-decor" aria-hidden="true">
          <span>{marquee}</span><span>{marquee}</span><span>{marquee}</span>
        </div>
        <div className="fr-stack-copy">
          <Chapter>03 — Technologies</Chapter>
          <h2 id="ps-stack-title" className="ps-rise" style={vars({ "--d": .1 })}>Les briques<br /><em>du projet.</em></h2>
          <ul className="ps-tags ps-rise" style={vars({ "--d": .2 })}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </div>
      </section>

      <section className="ps-scene fr-result" {...scene(4)} aria-labelledby="ps-result-title">
        <Chapter>04 — Le résultat</Chapter>
        <Words as="h2" id="ps-result-title" text={project.story.outcome} />
        <ResultMeta project={project} />
      </section>

      <NextScene next={next} />
    </>
  );
}
