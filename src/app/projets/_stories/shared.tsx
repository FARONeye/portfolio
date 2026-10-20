/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";
import type { CSSProperties, ElementType } from "react";
import type { projectCards } from "../../projects";

export type Project = (typeof projectCards)[number];
export type StoryProps = { project: Project; next: Project };

export const chapters = ["Ouverture", "Point de départ", "Approche", "Technologies", "Résultat", "Suite"];
// The approach holds three steps, so it gets twice the scroll of the other chapters.
export const sceneWeights = [1, 1, 2, 1, 1, 1];

export const vars = (values: Record<string, string | number>) => values as CSSProperties;

export const scene = (index: number) => ({
  "data-story-scene": index,
  "data-story-weight": sceneWeights[index],
  style: vars({ "--i": index }),
});

// Deterministic pseudo-random values: every visit gets the same composition.
export const seeded = (index: number, salt = 0) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export function Title({ text }: { text: string }) {
  const letters = Array.from(text);
  return (
    <h1 id="project-title" className="ps-title" aria-label={text} style={vars({ "--letters": letters.length + 1, "--kn": letters.length })}>
      {letters.map((letter, index) => (
        <span className="ps-letter" style={vars({ "--k": index })} key={index} aria-hidden="true"><span>{letter}</span></span>
      ))}
      <span className="ps-letter ps-title-dot" style={vars({ "--k": letters.length })} aria-hidden="true"><span>.</span></span>
    </h1>
  );
}

// Each word gets its own index so variants can choreograph sentences word by word.
export function Words({ text, as: Tag = "span", className = "", id }: { text: string; as?: ElementType; className?: string; id?: string }) {
  const words = text.split(" ");
  return (
    <Tag className={`ps-words ${className}`} id={id}>
      <span className="ps-sr">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index}>
            <span className="ps-word" style={vars({ "--w": index, "--wn": words.length })}>{word}</span>{index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}

export function Chapter({ children }: { children: string }) {
  return <span className="ps-chapter ps-rise" style={vars({ "--d": 0 })}>{children}</span>;
}

export function ResultMeta({ project }: { project: Project }) {
  return (
    <dl className="ps-meta ps-rise" style={vars({ "--d": .2 })}>
      <div><dt>Rôle</dt><dd>{project.role}</dd></div>
      <div><dt>Statut</dt><dd>Concept provisoire</dd></div>
    </dl>
  );
}

export function NextScene({ next }: { next: Project }) {
  return (
    <section className="ps-scene ps-scene-next" {...scene(5)} aria-labelledby="ps-next-title">
      <Chapter>05 — La suite</Chapter>
      <a className="ps-next ps-rise" href={`/projets/${next.slug}`} style={vars({ "--d": .08, "--next-accent": next.color })}>
        <span>Projet suivant · {next.number}</span>
        <strong id="ps-next-title">{next.title}<i aria-hidden="true">↗</i></strong>
        <small>{next.body}</small>
      </a>
      <a className="ps-gallery-link ps-rise" href="/#projets" style={vars({ "--d": .18 })}>← Retour à la galerie</a>
      <p className="ps-note ps-rise" style={vars({ "--d": .24 })}>Concept provisoire — la présentation détaillée de ce projet arrive bientôt.</p>
      <figure className="ps-next-preview ps-decor" aria-hidden="true" style={vars({ "--next-accent": next.color })}>
        <Image src={next.image} alt="" fill sizes="(max-width: 760px) 1px, 34vw" />
        <figcaption>{next.number} / {next.label}</figcaption>
      </figure>
    </section>
  );
}

export function Steps({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <ol className={`ps-steps ${className}`}>
      {project.story.steps.map((step, index) => (
        <li data-story-step={index} style={vars({ "--k": index })} key={step.title}>
          <span className="ps-step-number">0{index + 1}</span>
          <div><strong>{step.title}</strong><p>{step.text}</p></div>
        </li>
      ))}
    </ol>
  );
}
