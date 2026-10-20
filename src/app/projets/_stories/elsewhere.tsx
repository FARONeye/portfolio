import Image from "next/image";
import { Chapter, NextScene, ResultMeta, Steps, Title, Words, chapters, scene, seeded, vars, type StoryProps } from "./shared";

// Map units: the map is 1600 × 1000. The route visits one stop per chapter, and
// the approach walks three waypoints (indices 2 to 4) before reaching the next stop.
const route: [number, number][] = [[250, 330], [560, 200], [850, 390], [960, 455], [1070, 520], [900, 770], [1300, 790], [1430, 390]];
const chapterStops = [0, 1, 2, 5, 6, 7];

const contour = (cx: number, cy: number, radius: number, seed: number) => {
  const points = Array.from({ length: 56 }, (_, index) => {
    const angle = (index / 56) * Math.PI * 2;
    const wobble = 1 + Math.sin(angle * 3 + seed) * .13 + Math.sin(angle * 5 + seed * 2) * .06;
    return `${(cx + Math.cos(angle) * radius * 1.35 * wobble).toFixed(1)},${(cy + Math.sin(angle) * radius * wobble).toFixed(1)}`;
  });
  return `M${points.join("L")}Z`;
};
const contours = [[420, 520, 6], [1150, 260, 5], [760, 880, 4], [1450, 700, 4]].flatMap(([cx, cy, rings], hill) =>
  Array.from({ length: rings }, (_, ring) => contour(cx, cy, 40 + ring * 34, hill * 3 + ring * .4)),
);

export default function ElsewhereStory({ project, next }: StoryProps) {
  return (
    <>
      <div className="el-viewport ps-decor" aria-hidden="true">
        <div className="el-map" data-route={JSON.stringify(route)} data-stops={JSON.stringify(chapterStops)}>
          <svg viewBox="0 0 1600 1000" preserveAspectRatio="none">
            <g className="el-contours">{contours.map((d, index) => <path d={d} key={index} />)}</g>
            <path className="el-route-ghost" />
            <path className="el-route-done" />
            <path className="el-route-live" />
          </svg>
          {chapterStops.map((stop, index) => (
            <span className="el-pin" data-pin={index} style={vars({ left: `${route[stop][0] / 16}%`, top: `${route[stop][1] / 10}%` })} key={stop}>
              <i /><b>{String(index).padStart(2, "0")} · {chapters[index]}</b>
            </span>
          ))}
          {[2, 3, 4].map((stop, index) => (
            <span className="el-waypoint" data-waypoint={index} style={vars({ left: `${route[stop][0] / 16}%`, top: `${route[stop][1] / 10}%` })} key={stop}><i /></span>
          ))}
          {Array.from({ length: 14 }, (_, index) => (
            <span className="el-glyph" style={vars({ left: `${(8 + seeded(index, 7) * 84).toFixed(1)}%`, top: `${(8 + seeded(index, 8) * 84).toFixed(1)}%`, "--shape": index % 3 })} key={index} />
          ))}
          <figure className="el-postcard">
            <div className="el-postcard-photo"><Image src={project.image} alt="" fill sizes="(max-width: 760px) 50vw, 30vw" /></div>
            <figcaption>Carte postale · {project.accent}</figcaption>
          </figure>
          <span className="el-marker"><i /></span>
        </div>
      </div>
      <div className="el-coords ps-decor" aria-hidden="true"><span>48.8566° N · 2.3522° E</span><b>Altitude 1 200 m</b></div>
      <div className="el-compass ps-decor" aria-hidden="true"><i>N</i></div>
      <figure className="el-lens ps-decor" aria-hidden="true">
        <Image src={project.image} alt="" fill sizes="(max-width: 760px) 70vw, 40vw" />
      </figure>

      <section className="ps-scene ps-scene-opening el-opening" {...scene(0)} aria-labelledby="project-title">
        <span className="eyebrow ps-rise" style={vars({ "--d": 0 })}><span className="eyebrow-mark" /> Projet {project.number} — {project.label}</span>
        <Title text={project.title} />
        <p className="ps-lead ps-rise" style={vars({ "--d": .1 })}>{project.body}</p>
        <ul className="ps-tags ps-rise" style={vars({ "--d": .2 })} aria-label="Domaines du projet">
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <span className="ps-scroll-cue ps-decor"><i />Défilez pour partir</span>
      </section>

      <section className="ps-scene el-card el-challenge" {...scene(1)} aria-labelledby="ps-challenge-title">
        <Chapter>01 — Le point de départ</Chapter>
        <Words as="h2" id="ps-challenge-title" text={project.story.challenge} />
        <p className="ps-rise" style={vars({ "--d": .35 })}>{project.detail}</p>
      </section>

      <section className="ps-scene el-card el-approach" {...scene(2)} aria-labelledby="ps-approach-title">
        <Chapter>02 — L’approche</Chapter>
        <h2 id="ps-approach-title" className="ps-rise" style={vars({ "--d": .08 })}>Trois étapes<br /><em>sur la route.</em></h2>
        <Steps project={project} className="el-steps" />
      </section>

      <section className="ps-scene el-card el-stack" {...scene(3)} aria-labelledby="ps-stack-title">
        <Chapter>03 — Technologies</Chapter>
        <h2 id="ps-stack-title" className="ps-rise" style={vars({ "--d": .08 })}>Légende<br /><em>de la carte.</em></h2>
        <ul className="el-legend">
          {project.tags.map((tag, index) => (
            <li className="ps-rise" style={vars({ "--d": .16 + index * .1, "--shape": index % 3 })} key={tag}><i aria-hidden="true" />{tag}</li>
          ))}
        </ul>
      </section>

      <section className="ps-scene el-card el-result" {...scene(4)} aria-labelledby="ps-result-title">
        <Chapter>04 — Le résultat</Chapter>
        <Words as="h2" id="ps-result-title" text={project.story.outcome} />
        <ResultMeta project={project} />
      </section>

      <NextScene next={next} />
    </>
  );
}
