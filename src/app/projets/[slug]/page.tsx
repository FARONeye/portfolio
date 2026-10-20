/* Native navigation resets the home page's scroll narrative. */
/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { projectCards } from "../../projects";
import { chapters, sceneWeights, vars, type StoryProps } from "../_stories/shared";
import FragmentsStory from "../_stories/fragments";
import AfterimageStory from "../_stories/afterimage";
import HorizonStory from "../_stories/horizon";
import SolsticeStory from "../_stories/solstice";
import ElsewhereStory from "../_stories/elsewhere";
import "../story.css";

type Props = { params: Promise<{ slug: string }> };

// Each project tells its story with its own staging; /story.js drives them all.
const stories: Record<string, (props: StoryProps) => ReactNode> = {
  fragments: (props) => <FragmentsStory {...props} />,
  afterimage: (props) => <AfterimageStory {...props} />,
  horizon: (props) => <HorizonStory {...props} />,
  solstice: (props) => <SolsticeStory {...props} />,
  elsewhere: (props) => <ElsewhereStory {...props} />,
};

export function generateStaticParams() {
  return projectCards.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectCards.find((item) => item.slug === slug);
  if (!project) notFound();
  return { title: `${project.title} — Mathis Truong`, description: project.body };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projectCards.find((item) => item.slug === slug);
  const story = project && stories[project.slug];
  if (!project || !story) notFound();
  const next = projectCards[(projectCards.indexOf(project) + 1) % projectCards.length];
  const units = sceneWeights.reduce((sum, weight) => sum + weight, 0);

  return (
    <main className={`project-story ps-v-${project.slug}`} style={vars({ "--project-accent": project.color, "--story-units": units })}>
      <a className="skip-link" href="#project-title">Aller au projet</a>

      <header className="ps-header">
        <a className="wordmark" href="/" aria-label="Mathis Truong, accueil"><span className="wordmark-symbol">M<span className="wordmark-dot">.</span>T</span></a>
        <a className="ps-back" href="/#projets">← Tous les projets</a>
        <span className="ps-header-index">Projet {project.number} / 0{projectCards.length}</span>
      </header>

      <div className="ps-track" data-project-story data-variant={project.slug}>
        <div className="ps-stage">
          {/* Shown only when motion is reduced, in place of the animated staging. */}
          <figure className="ps-static-media">
            <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 760px) 100vw, 40vw" />
          </figure>

          {story({ project, next })}

          <nav className="ps-chapters" aria-label="Chapitres du projet">
            {chapters.map((chapter, index) => (
              <button type="button" data-story-goto={index} key={chapter}><span>{chapter}</span><i aria-hidden="true" /></button>
            ))}
          </nav>
          <div className="ps-progress" aria-hidden="true">
            <span className="ps-progress-label">{chapters[0]}</span>
            <i><b /></i>
            <span className="ps-count">01 / 0{chapters.length}</span>
          </div>
        </div>
      </div>
      <Script src="/story.js?v=7" strategy="afterInteractive" />
    </main>
  );
}
