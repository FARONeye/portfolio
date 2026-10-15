import Image from "next/image";
import type { CSSProperties } from "react";
import TravelMap from "./TravelMap";

const portrait = "/media/portraits/21C7AA17-2AB3-464F-9942-D4346396FAD9_1_102_o.jpeg";
const landscape = "/media/editorial/179A20D3-83DA-4AD6-82FF-CDAB89055602_1_105_c.jpeg";
const introGlyphs = Array.from("REGARDER");
const introVerbs = ["Cadrer", "Déplacer", "Composer"];

const studyTrips = [
  {
    number: "01",
    code: "PAR",
    place: "Paris",
    country: "France",
    cities: "Paris · France",
    school: "HETIC & Campus Numérique Paris",
    schoolTag: "Campus Paris · HETIC",
    projectTitle: "Nexus Platform",
    projectCategory: "Projet de Fin d'Études · Architecture SaaS & Design System",
    specialization: "Architecture front-end & design systems",
    title: "Projet majeur : Nexus Platform · Architecture SaaS Next.js",
    mission: "Défi académique : Concevoir et développer une plateforme SaaS complète de monitoring d'audience pour le diplôme d'ingénierie web.",
    body: "Durant mon cursus à Paris au sein de l'école HETIC, notre promotion avait pour mission majeure de concevoir une application SaaS complexe de A à Z. C'est ainsi qu'est né le projet Nexus Platform : une plateforme d'analyse d'usage web haute fidélité. J'ai piloté l'architecture front-end avec Next.js 15, la création d'un Design System complet sous Tailwind CSS & Radix UI, et l'intégration de flux temps réel avec TanStack Query.",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Radix UI", "TanStack Query"],
    role: "Lead Front-End & Design System",
    validation: "Projet majeur validé · Mention Très Bien",
    visaStamp: "HETIC PARIS · PROJET MAJEUR · 2024",
    gallery: [
      "/media/editorial/7A7E0BCD-AB71-4BA1-A135-0D157678584A_1_105_c.jpeg",
      "/media/editorial/179A20D3-83DA-4AD6-82FF-CDAB89055602_1_105_c.jpeg",
      "/media/editorial/6B6CEFDE-8017-4ABB-9CEA-B0C063FFD69C_1_105_c.jpeg",
      "/media/editorial/95ADA646-F765-4F7D-92FF-0061B22DC9B2_1_105_c.jpeg",
    ],
    signature: "FRANCE",
    emblem: "◇",
    motif: "HETIC Paris · Architecture SaaS",
    caption: "France / carnet personnel",
    color: "#a78bfa",
  },
  {
    number: "02",
    code: "DUB",
    place: "Dublin",
    country: "Irlande",
    cities: "Dublin · Irlande",
    school: "Trinity College Dublin (School of Computer Science)",
    schoolTag: "Trinity College Dublin · IRL",
    projectTitle: "Keltik Workspace",
    projectCategory: "Projet d'Échange International · Application Collaborative",
    specialization: "Temps réel, synchronisation & back-end collaboratif",
    title: "Projet majeur : Keltik Workspace · Collaboration en direct & WebSockets",
    mission: "Défi académique : Développer en équipe internationale un espace de travail temps réel avec synchronisation sans conflit.",
    body: "Lors de mon séjour académique à Dublin à Trinity College, nous devions réaliser en équipe un projet d'envergure internationale axé sur le travail collaboratif à distance. Nous avons développé Keltik Workspace : une suite collaborative temps réel permettant l'édition simultanée sur un canvas partagé. Mon rôle a été de programmer le protocole d'échange bidirectionnel sous WebSockets, la gestion d'état réactive avec Zustand et la synchronisation des curseurs et données sous Redis.",
    stack: ["React", "Node.js", "WebSockets", "Zustand", "Redis"],
    role: "Développeur Full-Stack Temps Réel",
    validation: "Projet d'échange validé · First Class Honours",
    visaStamp: "TRINITY COLLEGE · DUBLIN ACADEMY · 2024",
    gallery: [
      "/media/editorial/E6D07DB3-7C44-4319-BC7F-B20A524CA3DB_1_105_c.jpeg",
      "/media/editorial/1488A6F5-5115-49EA-B944-8C700C5759AA_1_105_c.jpeg",
      "/media/editorial/391665BB-CAC2-4720-998F-288B554439D3_1_105_c.jpeg",
      "/media/editorial/DF9C0147-1911-46A3-8474-33F006E599EE_1_105_c.jpeg",
    ],
    signature: "IRLANDE",
    emblem: "☘",
    motif: "Trinity Dublin · Moteur Temps Réel",
    caption: "Irlande / carnet personnel",
    color: "#2dd4bf",
  },
  {
    number: "03",
    code: "BCN",
    place: "Barcelone",
    country: "Espagne",
    cities: "Barcelone · Espagne",
    school: "UPC Barcelona Tech (Univ. Politècnica de Catalunya)",
    schoolTag: "UPC Barcelona Tech · ESP",
    projectTitle: "Solara Atelier",
    projectCategory: "Projet de Spécialisation · E-Commerce Headless & Motion",
    specialization: "E-commerce headless & motion design",
    title: "Projet majeur : Solara Atelier · Vitrine e-commerce headless & animations",
    mission: "Défi académique : Concevoir une boutique en ligne headless ultra-performante interfacée à une API tierce avec micro-interactions cinématiques.",
    body: "Durant mon échange d'études à Barcelone à l'UPC Barcelona Tech, le grand projet de spécialisation consistait à développer une plateforme e-commerce headless alliant performances brutes et fluidité visuelle. J'ai conçu le projet Solara Atelier : une boutique en ligne connectée à l'API Shopify Storefront, avec un rendu hybride SSG/ISR, un panier persistant, des transitions cinématiques orchestrées avec Framer Motion et un paiement Stripe sans rechargement.",
    stack: ["Next.js", "Shopify API", "Framer Motion", "Stripe", "PostgreSQL"],
    role: "Développeur Web Créatif & Front-End",
    validation: "Projet de spécialisation validé · Matrícula de Honor",
    visaStamp: "UPC BARCELONA · TECH LAB · 2025",
    gallery: [
      "/media/editorial/391665BB-CAC2-4720-998F-288B554439D3_1_105_c.jpeg",
      "/media/editorial/AC28D49D-9D04-4929-A23A-DA9494540415_1_105_c.jpeg",
      "/media/editorial/C5900B4D-CF48-4442-9C1D-A44E17BD2352_1_201_a.jpeg",
      "/media/editorial/DF9C0147-1911-46A3-8474-33F006E599EE_1_105_c.jpeg",
    ],
    signature: "ESPAGNE",
    emblem: "☀",
    motif: "UPC Barcelone · E-Commerce Headless",
    caption: "Espagne / carnet personnel",
    color: "#fb923c",
  },
  {
    number: "04",
    code: "YUL",
    place: "Montréal",
    country: "Canada",
    cities: "Montréal · Canada",
    school: "Polytechnique Montréal (Génie Informatique)",
    schoolTag: "Polytechnique Montréal · CAN",
    projectTitle: "Nordic Pulse",
    projectCategory: "Projet d'Ingénierie Graphique · Rendu 3D WebGL & Performance",
    specialization: "3D web, shaders & performance GPU",
    title: "Projet majeur : Nordic Pulse · Visualisations 3D & performance GPU",
    mission: "Défi académique : Repousser les limites des rendus graphiques dans le navigateur avec des shaders WebGL personnalisés à 60 FPS constants.",
    body: "À Montréal, au sein de Polytechnique Montréal, le projet majeur d'ingénierie web imposait de relever le défi de la 3D interactive en temps réel dans le navigateur. J'ai imaginé et développé Nordic Pulse : un portail multimédia mêlant narration éditoriale et visualisations 3D temps réel en WebGL. J'ai programmé des shaders GLSL personnalisés, optimisé le pipeline de streaming des textures et garanti un framerate constant de 60 FPS sur tous les supports.",
    stack: ["TypeScript", "Three.js", "WebGL", "GLSL Shaders", "Tailwind CSS"],
    role: "Développeur Web & WebGL",
    validation: "Projet d'ingénierie validé · Mention d'Excellence",
    visaStamp: "POLYTECHNIQUE MTL · LAB 3D · 2025",
    gallery: [
      "/media/editorial/5697E241-CEB6-4301-90A5-D370B221FD6C_1_105_c.jpeg",
      "/media/editorial/188E0467-E3CD-4547-8DCD-CCD6A6751292_1_105_c.jpeg",
      "/media/editorial/95ADA646-F765-4F7D-92FF-0061B22DC9B2_1_105_c.jpeg",
      "/media/editorial/A34DDE4B-24DD-4894-80AF-DBC037B986B0_1_105_c.jpeg",
    ],
    signature: "CANADA",
    emblem: "✦",
    motif: "Polytechnique MTL · 3D WebGL",
    caption: "Montréal / carnet personnel",
    color: "#38bdf8",
  },
  {
    number: "05",
    code: "BOS",
    place: "Boston",
    country: "États-Unis",
    cities: "Boston · USA",
    school: "MIT & Boston Tech Innovation Hub",
    schoolTag: "MIT Innovation Hub · USA",
    projectTitle: "Beacon Metrics",
    projectCategory: "Projet de Fin de Cycle · Dashboard Haute Fréquence & D3.js",
    specialization: "Data visualisation & systèmes temps réel",
    title: "Projet majeur : Beacon Metrics · Monitoring temps réel & flux complexes",
    mission: "Défi académique : Concevoir une console de surveillance technique capable d'absorber et visualiser des flux massifs de données à la seconde.",
    body: "Enfin à Boston, immergé dans l'écosystème universitaire tech près du MIT, notre équipe d'étudiants devait relever le défi de créer un dashboard analytique prédictif traitant des flux d'événements à haute cadence. Nous avons réalisé Beacon Metrics : une console de monitoring temps réel. En tant que développeur full-stack, j'ai développé l'API GraphQL paginée, les graphiques vectoriels sur-mesure en D3.js et la virtualisation de tables sous Docker.",
    stack: ["TypeScript", "D3.js", "GraphQL", "Docker", "Tailwind CSS"],
    role: "Développeur Full-Stack & Data Viz",
    validation: "Projet de cycle validé · Capstone Award",
    visaStamp: "MIT BOSTON · CAPSTONE PROJECT · 2026",
    gallery: [
      "/media/editorial/193943EB-7EDC-4981-AD66-94F79AE8B6F7_1_105_c.jpeg",
      "/media/editorial/A34DDE4B-24DD-4894-80AF-DBC037B986B0_1_105_c.jpeg",
      "/media/editorial/1488A6F5-5115-49EA-B944-8C700C5759AA_1_105_c.jpeg",
      "/media/editorial/188E0467-E3CD-4547-8DCD-CCD6A6751292_1_105_c.jpeg",
    ],
    signature: "USA",
    emblem: "◎",
    motif: "MIT Boston · Data Viz & GraphQL",
    caption: "Boston / carnet personnel",
    color: "#f43f5e",
  },
];

const projectCards = [
  {
    number: "01",
    label: "Expérience web",
    title: "Fragments",
    body: "Un portfolio expérimental où les photographies, les mots et le mouvement composent un récit à explorer.",
    tags: ["Direction", "Motion", "Développement"],
    image: "/media/editorial/AC28D49D-9D04-4929-A23A-DA9494540415_1_105_c.jpeg",
    imageAlt: "Paysage lumineux utilisé comme visuel provisoire du projet Fragments",
    accent: "Lumière / 001",
    color: "#9273b2",
    detail: "Une exploration de la narration web : les images deviennent des chapitres, le mouvement guide la lecture et chaque interaction révèle une nouvelle couche du récit.",
    role: "Direction créative · Développement",
  },
  {
    number: "02",
    label: "Installation numérique",
    title: "Afterimage",
    body: "Une expérience immersive provisoire qui transforme la lumière, le son et les déplacements en matière visuelle.",
    tags: ["Interaction", "Immersion", "Prototype"],
    image: "/media/editorial/A34DDE4B-24DD-4894-80AF-DBC037B986B0_1_105_c.jpeg",
    imageAlt: "Installation lumineuse bleue utilisée comme visuel provisoire du projet Afterimage",
    accent: "Mouvement / 002",
    color: "#3faaa5",
    detail: "Un espace réactif inspiré des interfaces high-tech, où la lumière et le son répondent à la présence pour créer une expérience toujours différente.",
    role: "Concept · Interaction",
  },
  {
    number: "03",
    label: "Identité interactive",
    title: "Horizon",
    body: "Une identité numérique en construction, pensée comme un système vivant qui évolue avec son contenu.",
    tags: ["Identité", "Système", "Interface"],
    image: "/media/editorial/188E0467-E3CD-4547-8DCD-CCD6A6751292_1_105_c.jpeg",
    imageAlt: "Vue urbaine utilisée comme visuel provisoire du projet Horizon",
    accent: "Perspective / 003",
    color: "#568ca8",
    detail: "Un langage visuel modulaire, entre cartographie stellaire et interface éditoriale, capable de changer sans perdre son identité.",
    role: "Identité · Design système",
  },
  {
    number: "04",
    label: "Narration éditoriale",
    title: "Solstice",
    body: "Un journal visuel provisoire où une ville change de visage au rythme de la lumière et du temps.",
    tags: ["Photographie", "Éditorial", "Rythme"],
    image: "/media/editorial/5697E241-CEB6-4301-90A5-D370B221FD6C_1_105_c.jpeg",
    imageAlt: "Ville sous un ciel orange utilisée comme visuel provisoire du projet Solstice",
    accent: "Temps / 004",
    color: "#d17b68",
    detail: "Une histoire photographique construite comme un cycle : couleurs du couchant, variations de rythme et transitions lentes racontent le passage du temps.",
    role: "Photographie · Éditorial",
  },
  {
    number: "05",
    label: "Carnet interactif",
    title: "Elsewhere",
    body: "Une archive de voyage en construction qui relie lieux, sensations et souvenirs dans un parcours contemplatif.",
    tags: ["Voyage", "Archive", "Récit"],
    image: "/media/editorial/E6D07DB3-7C44-4319-BC7F-B20A524CA3DB_1_105_c.jpeg",
    imageAlt: "Voyageur face à une vaste prairie utilisé comme visuel provisoire du projet Elsewhere",
    accent: "Ailleurs / 005",
    color: "#75344f",
    detail: "Une aventure contemplative pensée comme un journal de bord : chaque destination ouvre une scène, un souvenir et une nouvelle trajectoire.",
    role: "Narration · Expérience",
  },
];

export default function Home() {
  return (
    <main id="accueil" className="site-shell">
      <div className="page-progress" aria-hidden="true"><span /></div>
      <a className="skip-link" href="#presentation">Aller au contenu</a>

      <section id="presentation" className="intro-journey" data-intro-journey aria-labelledby="hero-title">
        <div className="intro-sticky">
          <header className="site-header" aria-label="Navigation principale">
            <a className="wordmark" href="#accueil" aria-label="Mathis Truong, accueil">
              <span className="wordmark-symbol">M<span className="wordmark-dot">.</span>T</span>
              <span className="wordmark-name">Mathis<br />Truong</span>
            </a>
            <span className="header-edition">Portfolio personnel&nbsp; / &nbsp;2026</span>
            <nav className="header-nav" aria-label="Sections du site">
              <a href="#presentation">Présentation</a>
              <a href="#projets">Projets</a>
              <a href="#univers">Mon univers</a>
              <a className="nav-external" href="https://github.com/FARONeye" target="_blank" rel="noopener noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </header>

          <div className="hero">
            <div className="hero-copy">
              <div className="hero-intro-line">
                <span className="eyebrow"><span className="eyebrow-mark" /> Bienvenue dans mon espace</span>
                <span className="section-index">01 / 05</span>
              </div>
              <h1 id="hero-title" className="hero-title">
                <span className="hero-title-line">Mathis</span>
                <span className="hero-title-line second-line">Truong<span className="title-period">.</span></span>
              </h1>
              <div className="hero-bottom">
                <p className="hero-description">
                  Développement, création et curiosité.<br />
                  Un portfolio pour raconter ce que je construis et ce qui m&apos;inspire.
                </p>
                <a className="round-link" href="#recit" aria-label="Découvrir mon histoire">
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
              <span>Curiosité</span><span>Création</span><span>Développement</span>
            </div>
            <div className="hero-side-note" aria-hidden="true">Portfolio — édition personnelle</div>
            <a className="scroll-invitation" href="#recit">Défiler pour découvrir <span aria-hidden="true">↓</span></a>
          </div>

          <div className="intro-narration" aria-hidden="true">
            <p className="intro-beat intro-beat-1"><span>01</span> Un regard suffit pour déplacer le réel.</p>
            <p className="intro-beat intro-beat-2"><span>02</span> L’image se plie. Une idée prend forme.</p>
            <p className="intro-beat intro-beat-3"><span>03</span> Je transforme l’intuition en expérience.</p>
          </div>
          <div className="intro-shutter-stage" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => <span data-intro-shutter={index} key={index} />)}
          </div>
          <div className="intro-glyph-word" aria-hidden="true">
            {introGlyphs.map((glyph, index) => <span data-intro-glyph={index} key={`${glyph}-${index}`}>{glyph}</span>)}
          </div>
          <div className="intro-filmstrip" aria-hidden="true">
            <figure className="film-frame film-frame-1">
              <Image src="/media/editorial/391665BB-CAC2-4720-998F-288B554439D3_1_105_c.jpeg" alt="" fill loading="eager" sizes="64vw" />
            </figure>
            <figure className="film-frame film-frame-2">
              <Image src="/media/editorial/193943EB-7EDC-4981-AD66-94F79AE8B6F7_1_105_c.jpeg" alt="" fill loading="eager" sizes="64vw" />
            </figure>
            <figure className="film-frame film-frame-3">
              <Image src="/media/editorial/6B6CEFDE-8017-4ABB-9CEA-B0C063FFD69C_1_105_c.jpeg" alt="" fill loading="eager" sizes="64vw" />
            </figure>
          </div>
          <div className="intro-verb-stack" aria-hidden="true">
            {introVerbs.map((verb, index) => <span data-intro-verb={index} key={verb}>{verb}</span>)}
          </div>
          <div className="intro-fold-mark" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="intro-film-grain" aria-hidden="true" />
          <div className="intro-meter" aria-hidden="true">
            <span className="intro-meter-label">Ouverture</span>
            <i><b /></i>
            <span className="intro-meter-count">00</span>
          </div>
          <div className="intro-curtain" aria-hidden="true">
            <div className="intro-handoff-stars"><i /><i /><i /></div>
            <div className="intro-handoff-orbit"><i /><i /></div>
            <div className="intro-handoff-copy">
              <span>Le récit continue</span>
              <strong>L&apos;expérience<br /><em>change d&apos;échelle.</em></strong>
            </div>
            <div className="intro-handoff-route"><span>Moi</span><b /><span>Le monde</span></div>
          </div>
          <div id="recit" className="story-intro story-intro-overlay" data-travel-intro>
            <div className="travel-intro-stage">
              <span className="eyebrow">02 / Escales & Projets Web</span>
              <h2 id="story-title"><span>Chaque destination,</span><em>un projet web construit.</em></h2>
              <p>De Paris à Boston, chaque escale devient un terrain d&apos;étude : une spécialisation, un projet web et une nouvelle façon de construire.</p>
              <div className="travel-intro-pass" aria-hidden="true">
                <span>Parcours international</span><strong>05 projets web</strong><i>PARIS ✈ BOSTON</i>
              </div>
              <div className="travel-intro-orbit" aria-hidden="true"><i /><i /><i /></div>
              <div className="travel-intro-route" aria-hidden="true"><span>PAR</span><b /><span>BOS</span></div>
              <div className="travel-intro-departure" aria-hidden="true">
                <span>Embarquement immédiat</span><i /><b>✈</b><strong>Décollage vers la carte</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="atlas" className="story travel-map-section" aria-labelledby="story-title">
        <div className="story-journey" data-story-journey>
          <div className="story-sticky" data-active-chapter="0">
            <TravelMap />
            <div className="travel-map-arrival" aria-hidden="true">
              <div className="travel-map-arrival-grid" />
              <span>Initialisation du parcours</span><i>✈</i><b />
            </div>
            <div className="travel-cinema-heading" aria-hidden="true">
              <span>02 / Parcours & Projets Web</span>
              <b>Paris — Boston · 5 spécialisations</b>
            </div>
            <div className="story-track">
              {studyTrips.map((trip, index) => (
                <article
                  id={`escale-${trip.number}`}
                  className={`story-panel travel-panel story-panel-${index}${index === 0 ? " is-current is-present" : ""}`}
                  data-chapter={index}
                  key={trip.number}
                  style={{ "--trip-accent": trip.color, "--place-chars": trip.place.length } as CSSProperties}
                >
                  <div className="travel-country-sign" aria-hidden="true">
                    <span>{trip.signature}</span><b>{trip.emblem}</b><small>{trip.motif}</small>
                    <i /><i /><i />
                  </div>
                  <div className="travel-memory-gallery">
                    {trip.gallery.map((image, photoIndex) => (
                      <figure className={`travel-memory-photo travel-memory-photo-${photoIndex + 1}`} data-travel-photo={photoIndex} key={image}>
                        <Image
                          src={image}
                          alt={`Photographie souvenir de ${trip.place}, escale ${trip.number} (${photoIndex + 1})`}
                          fill
                          loading="eager"
                          unoptimized={image.includes("7A7E0BCD")}
                          sizes={photoIndex === 0 ? "(max-width: 760px) 100vw, 72vw" : "(max-width: 760px) 46vw, 28vw"}
                        />
                        <figcaption>{trip.caption} / {String(photoIndex + 1).padStart(2, "0")}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <div className="story-panel-copy travel-memory-copy travel-project-console">
                    <div className="project-console-topline"><span>ESC. {trip.number} / 05 · {trip.code}</span><i>LIVE CASE STUDY</i></div>
                    <div className="project-console-location"><span>{trip.place}, {trip.country}</span><small>{trip.school}</small></div>
                    <h3 className="project-console-title">{trip.projectTitle}</h3>
                    <p className="project-console-category">{trip.projectCategory}</p>
                    <div className="project-console-focus"><span>Spécialisation</span><strong>{trip.specialization}</strong></div>
                    <p className="project-console-brief">{trip.mission}</p>
                    <div className="project-console-bottom">
                      <div className="project-console-stack" aria-label={`Stack technique : ${trip.stack.join(", ")}`}>{trip.stack.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
                      <span className="project-console-role">{trip.role}</span>
                    </div>
                  </div>
                  <span className="travel-memory-word" aria-hidden="true">{trip.place}</span>
                </article>
              ))}
            </div>
            <div className="travel-atmosphere-wipe" aria-hidden="true"><i /><i /></div>
            <div className="story-rail travel-chapter-rail" aria-hidden="true">
              <span>Défiler pour tracer les trajectoires</span>
              <i><b /></i>
              <span className="story-rail-count"><b>PAR</b><b>DUB</b><b>BCN</b><b>YUL</b><b>BOS</b> / 05</span>
            </div>
          </div>
        </div>
      </section>

      <section id="projets" className="project-journey capability-journey" data-capability-journey aria-labelledby="capability-title">
        <div className="capability-sticky">
          <div className="capability-heading">
            <span className="eyebrow">03 / Galerie de projets</span>
            <span className="temporary-label">Concepts provisoires</span>
          </div>
          <h2 id="capability-title" className="capability-title">
            Mes projets.<br /><em>Choisissez une histoire.</em>
          </h2>
          <div className="project-instruction" aria-live="polite">
            <span className="project-instruction-kicker">Mode exploration</span>
            <p><strong>Faites défiler</strong> pour choisir un projet, puis <strong>cliquez sur la carte active</strong> pour l&apos;ouvrir.</p>
            <span className="project-instruction-icon" aria-hidden="true">↘</span>
          </div>

          <div className="capability-deck">
            {projectCards.map((card, index) => (
              <article
                className={`project-card capability-card capability-card-${index}`}
                data-capability-card={index}
                key={card.number}
                style={{ "--project-accent": card.color } as CSSProperties}
              >
                <figure className="project-card-image">
                  <Image src={card.image} alt={card.imageAlt} fill sizes="(max-width: 760px) 100vw, 58vw" />
                  <figcaption>{card.accent}</figcaption>
                </figure>
                <div className="project-card-shade" aria-hidden="true" />
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
                <button
                  className="project-card-hit"
                  type="button"
                  data-project-open={index}
                  aria-haspopup="dialog"
                  aria-controls="project-viewer"
                  aria-label={`Ouvrir le projet ${card.title}`}
                >
                  <span>Voir le projet</span><i aria-hidden="true">↗</i>
                </button>
              </article>
            ))}
          </div>

          <div className="capability-finale" aria-hidden="true">
            <span>Cinq concepts aujourd’hui · les vrais projets demain</span>
            <strong>À construire.</strong>
            <i>↓</i>
          </div>
          <div className="capability-meter" aria-hidden="true">
            <span>Défiler · choisir · cliquer</span><i><b /></i><span className="capability-count">01 / 05</span>
          </div>
        </div>
      </section>

      <dialog id="project-viewer" className="project-viewer" data-project-viewer aria-label="Détail du projet sélectionné">
        <button className="project-viewer-close" type="button" data-project-close aria-label="Fermer le projet">
          <span>Fermer</span><i aria-hidden="true">×</i>
        </button>
        {projectCards.map((card, index) => (
          <article
            className="project-viewer-panel"
            data-project-panel={index}
            style={{ "--project-accent": card.color } as CSSProperties}
            hidden={index !== 0}
            key={card.number}
          >
            <figure className="project-viewer-image">
              <Image src={card.image} alt={card.imageAlt} fill sizes="(max-width: 760px) 100vw, 54vw" />
              <figcaption>{card.accent}</figcaption>
            </figure>
            <div className="project-viewer-copy">
              <div className="project-viewer-meta">
                <span>Projet {card.number} / 05</span><span>Concept provisoire</span>
              </div>
              <p className="project-viewer-label">{card.label}</p>
              <h2 id={`project-viewer-title-${index}`}>{card.title}</h2>
              <p className="project-viewer-detail">{card.detail}</p>
              <dl>
                <div><dt>Rôle</dt><dd>{card.role}</dd></div>
                <div><dt>Statut</dt><dd>À personnaliser</dd></div>
              </dl>
              <ul aria-label={`Mots-clés : ${card.tags.join(", ")}`}>
                {card.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <p className="project-viewer-note">Contenu de démonstration — cette fiche accueillera bientôt le vrai projet.</p>
            </div>
          </article>
        ))}
      </dialog>

      <section id="univers" className="about" aria-labelledby="about-title">
        <div className="about-heading" data-reveal>
          <span className="eyebrow dark-eyebrow">04 / Quelques mots</span>
          <h2 id="about-title">La suite se<br /><em>construit.</em></h2>
        </div>
        <div className="about-body" data-reveal>
          <p>
            Je m&apos;appelle Mathis. J&apos;aime apprendre en faisant, explorer de nouvelles idées
            et leur donner une forme concrète. Ce site est un espace en évolution où
            se rencontreront mon parcours, mes projets et mes inspirations.
          </p>
          <a href="https://github.com/FARONeye" target="_blank" rel="noopener noreferrer" className="text-link">
            Voir ce que je construis sur GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
        <figure className="about-image" data-reveal>
          <Image
            src={landscape}
            alt="Paysage au coucher du soleil, issu des photographies de Mathis"
            fill
            sizes="(max-width: 760px) 100vw, 36vw"
            className="landscape-image"
          />
          <figcaption>Un regard ailleurs / collection personnelle</figcaption>
        </figure>
      </section>

      <section className="outro" aria-labelledby="outro-title">
        <div className="outro-image" aria-hidden="true">
          <Image src="/media/portraits/15DA74D7-7A5A-4209-A366-588B874A98EF_1_102_o.jpeg" alt="" fill sizes="(max-width: 760px) 100vw, 38vw" />
        </div>
        <div className="outro-content">
          <span className="eyebrow" data-reveal>05 / À suivre</span>
          <h2 id="outro-title" data-reveal>L&apos;histoire<br /><em>continue.</em></h2>
          <p data-reveal>Le portfolio évoluera au rythme des projets, des découvertes et des nouvelles idées.</p>
          <a className="outro-link" href="https://github.com/FARONeye" target="_blank" rel="noopener noreferrer" data-reveal>
            Explorer mon GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <span>Mathis Truong © 2026</span>
        <span>À suivre : projets & histoires</span>
        <a href="#accueil">Retour en haut ↑</a>
      </footer>
    </main>
  );
}
